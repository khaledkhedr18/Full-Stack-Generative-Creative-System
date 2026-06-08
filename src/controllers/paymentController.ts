import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import stripe from "../utils/stripe.js";
import config from "../config/env.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { AuthRequest } from "../middleware/auth.js";

/**
 * @desc    Create a Stripe Checkout Session from the user's cart
 * @route   POST /api/payments/create-checkout-session
 * @access  Private
 */
export const createCheckoutSession = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const { shippingAddress, notes } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return next(
        new AppError("Cart is empty. Add items before checkout.", 400),
      );
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product);
      if (!product) {
        return next(
          new AppError(`Product "${cartItem.product}" no longer exists`, 404),
        );
      }

      const variant = product.variants.find(
        (v) => v.variantId === cartItem.variantId,
      );
      if (!variant) {
        return next(
          new AppError(
            `Variant "${cartItem.variantId}" not found on "${product.name}"`,
            404,
          ),
        );
      }

      const sizeEntry = variant.sizes.find((s) => s.size === cartItem.size);
      if (!sizeEntry) {
        return next(
          new AppError(
            `Size "${cartItem.size}" not available for "${product.name}"`,
            404,
          ),
        );
      }

      if (sizeEntry.stock < cartItem.quantity) {
        return next(
          new AppError(
            `Insufficient stock for "${product.name}" (${variant.color.name}, ${cartItem.size}). Only ${sizeEntry.stock} left.`,
            400,
          ),
        );
      }

      const designFee = cartItem.customDesignFee || 0;

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: `${variant.color.name} - Size ${cartItem.size}${designFee > 0 ? ` + Custom Design Fee` : ""}`,
          },
          unit_amount: Math.round((sizeEntry.price + designFee) * 100),
        },
        quantity: cartItem.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      metadata: {
        userId: userId!,
        shippingAddress: JSON.stringify(shippingAddress),
        notes: notes || "",
      },
      success_url: `${config.clientUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.clientUrl}/order/cancel`,
    });

    res.status(200).json({
      success: true,
      message: "Checkout session created",
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  },
);

/**
 * @desc    Stripe webhook handler — Stripe calls this when payment succeeds/fails
 * @route   POST /api/payments/webhook
 * @access  Public (called by Stripe, not by users)
 */
export const stripeWebhook = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        config.stripeWebhookSecret,
      );
    } catch (err: any) {
      return next(
        new AppError(
          `Webhook signature verification failed: ${err.message}`,
          400,
        ),
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await fulfillOrder(session);
    }

    res.status(200).json({ received: true });
  },
);

/**
 * Helper: Create the Order in your DB after Stripe confirms payment.
 * Called from the webhook AND from verifySession as a fallback.
 * Idempotent — safe to call multiple times for the same session.
 */
async function fulfillOrder(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const shippingAddress = JSON.parse(session.metadata?.shippingAddress || "{}");
  const notes = session.metadata?.notes;

  if (!userId) {
    console.error("[fulfillOrder] No userId in session metadata", session.id);
    throw new AppError("No userId in session metadata", 400);
  }

  // Idempotency: skip if order already created for this session
  const existingOrder = await Order.findOne({
    "payment.stripeSessionId": session.id,
  });
  if (existingOrder) {
    return existingOrder;
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    console.error(
      "[fulfillOrder] Cart is empty for user",
      userId,
      "session",
      session.id,
    );
    throw new AppError("Cart is empty during fulfillment", 400);
  }

  const orderItems = [];
  for (const cartItem of cart.items) {
    const product = await Product.findById(cartItem.product);
    if (!product) continue;

    const variant = product.variants.find(
      (v) => v.variantId === cartItem.variantId,
    );
    if (!variant) continue;

    const sizeEntry = variant.sizes.find((s) => s.size === cartItem.size);
    if (!sizeEntry) continue;

    orderItems.push({
      product: product._id,
      variantId: cartItem.variantId,
      color: variant.color.name,
      size: cartItem.size,
      quantity: cartItem.quantity,
      price: sizeEntry.price,
      customDesignIds: cartItem.customDesignIds,
      customDesignFee: cartItem.customDesignFee || 0,
    });
  }

  const itemsTotal = orderItems.reduce(
    (sum, item) =>
      sum + (item.price + (item.customDesignFee || 0)) * item.quantity,
    0,
  );

  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress,
    payment: {
      method: "stripe",
      status: "paid",
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent as string,
      paidAt: new Date(),
    },
    itemsTotal,
    shippingCost: 0,
    tax: 0,
    totalAmount: (session.amount_total || 0) / 100,
    status: "confirmed",
    notes,
  });

  // Decrement stock
  for (const item of orderItems) {
    await Product.updateOne(
      {
        _id: item.product,
        "variants.variantId": item.variantId,
        "variants.sizes.size": item.size,
      },
      {
        $inc: {
          "variants.$[v].sizes.$[s].stock": -item.quantity,
        },
      },
      {
        arrayFilters: [
          { "v.variantId": item.variantId },
          { "s.size": item.size },
        ],
      },
    );
  }

  // Clear the cart
  cart.items = [] as any;
  await cart.save();

  console.log(
    "[fulfillOrder] Order created:",
    order.orderNumber,
    "for session",
    session.id,
  );
  return order;
}

/**
 * @desc    Verify a checkout session status (for frontend confirmation page).
 *          Also acts as a FALLBACK: if the webhook hasn't fired yet (common in
 *          local dev) and the payment is confirmed, it creates the order here.
 * @route   GET /api/payments/verify-session/:sessionId
 * @access  Private
 */
export const verifySession = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { sessionId } = req.params;
    const id = Array.isArray(sessionId) ? sessionId[0] : sessionId;

    const session = await stripe.checkout.sessions.retrieve(id);

    if (!session) {
      return next(new AppError("Session not found", 404));
    }

    let order = await Order.findOne({
      "payment.stripeSessionId": id,
    });

    // Fallback: if payment succeeded but the webhook hasn't created the order yet, do it now
    if (!order && session.payment_status === "paid") {
      try {
        order = await fulfillOrder(session);
      } catch (err: any) {
        console.error(
          "[verifySession] Fallback fulfillOrder failed:",
          err.message,
        );
      }
    }

    res.status(200).json({
      success: true,
      data: {
        paymentStatus: session.payment_status,
        orderNumber: order?.orderNumber || null,
        orderId: order?._id || null,
      },
    });
  },
);
