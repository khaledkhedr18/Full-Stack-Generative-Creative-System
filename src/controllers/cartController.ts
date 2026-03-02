import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { AuthRequest } from "../middleware/auth.js";
import CustomDesign from "../models/CustomDesign.js";
import config from "../config/env.js";

/**
 * @desc Get the current user's cart
 * @route GET /api/cart
 * @access Private
 */
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user?.userId;

  let cart = await Cart.findOne({ user: userId })
    .populate("items.product", "name slug basePrice currency variants")
    .populate(
      "items.customDesignIds",
      "prompt originalImageUrl generatedImageUrl fee status",
    );

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  res.status(200).json({
    success: true,
    data: cart,
  });
});

/**
 * @desc Add an item to the cart (or increase quantity if same product+variant+size exists)
 * @route POST /api/cart
 * @access Private
 */
export const addToCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const {
      productId,
      variantId,
      size,
      quantity = 1,
      customDesignIds,
    } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    const variant = product.variants.find((v) => v.variantId === variantId);
    if (!variant) {
      return next(
        new AppError(`Variant "${variantId}" not found on this product`, 404),
      );
    }

    const sizeEntry = variant.sizes.find((s) => s.size === size);
    if (!sizeEntry) {
      return next(
        new AppError(
          `Size "${size}" not available for variant "${variantId}"`,
          404,
        ),
      );
    }

    if (sizeEntry.stock < quantity) {
      return next(
        new AppError(
          `Insufficient stock. Only ${sizeEntry.stock} available for size "${size}"`,
          400,
        ),
      );
    }

    let customDesignFee = 0;
    const validatedDesignIds: mongoose.Types.ObjectId[] = [];

    if (
      customDesignIds &&
      Array.isArray(customDesignIds) &&
      customDesignIds.length > 0
    ) {
      for (const designId of customDesignIds) {
        const design = await CustomDesign.findOne({
          _id: designId,
          user: userId,
          product: productId,
          variantId: variantId,
          status: "completed",
        });

        if (!design) {
          return next(
            new AppError(
              `Custom design "${designId}" not found, does not match this product/variant, or is not completed yet`,
              404,
            ),
          );
        }

        validatedDesignIds.push(design._id as mongoose.Types.ObjectId);
      }

      // Fee is applied per design side (front, back, etc.)
      customDesignFee = config.customDesignFee * validatedDesignIds.length;
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Compare design arrays: same designs in any order means same item
    const designIdsKey = (ids?: mongoose.Types.ObjectId[]) =>
      ids && ids.length > 0
        ? [...ids]
            .map((id) => id.toString())
            .sort()
            .join(",")
        : null;

    const existingIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variantId === variantId &&
        item.size === size &&
        designIdsKey(item.customDesignIds) ===
          designIdsKey(
            validatedDesignIds.length > 0 ? validatedDesignIds : undefined,
          ),
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + quantity;
      if (newQty > sizeEntry.stock) {
        return next(
          new AppError(
            `Cannot add more. Only ${sizeEntry.stock} available (${cart.items[existingIndex].quantity} already in cart)`,
            400,
          ),
        );
      }
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].price = sizeEntry.price;

      if (validatedDesignIds.length > 0) {
        cart.items[existingIndex].customDesignIds = validatedDesignIds;
        cart.items[existingIndex].customDesignFee = customDesignFee;
      }
    } else {
      cart.items.push({
        product: product._id as any,
        variantId,
        size,
        quantity,
        price: sizeEntry.price,
        customDesignIds:
          validatedDesignIds.length > 0 ? validatedDesignIds : undefined,
        customDesignFee,
      });
    }

    await cart.save();

    await cart.populate(
      "items.product",
      "name slug basePrice currency variants",
    );
    await cart.populate(
      "items.customDesignIds",
      "prompt originalImageUrl generatedImageUrl fee status",
    );

    res.status(200).json({
      success: true,
      message:
        validatedDesignIds.length > 0
          ? `Custom design(s) added to cart (${validatedDesignIds.length} side${validatedDesignIds.length > 1 ? "s" : ""})`
          : "Item added to cart",
      data: cart,
    });
  },
);

/**
 * @desc Update the quantity of a cart item
 * @route PATCH /api/cart
 * @access Private
 */
export const updateCartItem = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const { productId, variantId, size, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variantId === variantId &&
        item.size === size,
    );

    if (itemIndex === -1) {
      return next(new AppError("Item not found in cart", 404));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError("Product no longer exists", 404));
    }

    const variant = product.variants.find((v) => v.variantId === variantId);
    if (!variant) {
      return next(
        new AppError(
          `Variant "${variantId}" no longer exists on this product`,
          404,
        ),
      );
    }

    const sizeEntry = variant.sizes.find((s) => s.size === size);
    if (!sizeEntry) {
      return next(
        new AppError(
          `Size "${size}" no longer available for variant "${variantId}"`,
          404,
        ),
      );
    }

    if (quantity > sizeEntry.stock) {
      return next(
        new AppError(
          `Insufficient stock. Only ${sizeEntry.stock} available`,
          400,
        ),
      );
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].price = sizeEntry.price;
    }

    await cart.save();

    await cart.populate(
      "items.product",
      "name slug basePrice currency variants",
    );
    await cart.populate(
      "items.customDesignIds",
      "prompt originalImageUrl generatedImageUrl fee status",
    );

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: cart,
    });
  },
);

/**
 * @desc Remove a specific item from the cart
 * @route DELETE /api/cart/item
 * @access Private
 */
export const removeFromCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const { productId, variantId, size } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.variantId === variantId &&
        item.size === size,
    );

    if (itemIndex === -1) {
      return next(new AppError("Item not found in cart", 404));
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    await cart.populate(
      "items.product",
      "name slug basePrice currency variants",
    );
    await cart.populate(
      "items.customDesignIds",
      "prompt originalImageUrl generatedImageUrl fee status",
    );

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  },
);

/**
 * @desc Clear the entire cart
 * @route DELETE /api/cart
 * @access Private
 */
export const clearCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }

    cart.items = [] as any;
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: cart,
    });
  },
);
