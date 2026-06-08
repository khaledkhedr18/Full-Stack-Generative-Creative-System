import { NextFunction, Request, Response } from "express";
import CustomDesign from "../models/CustomDesign.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { AuthRequest } from "../middleware/auth.js";
import config from "../config/env.js";
import {
  generateDesignImage,
  checkModelStatus,
} from "../utils/aiImageService.js";

/**
 * @desc Resolve a product image URL to a readable path for the AI service
 * @param imageUrl - Local path or remote URL
 * @returns Resolved image source string
 */
function resolveImageSource(imageUrl: string): string {
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  if (imageUrl.startsWith("/uploads")) {
    return imageUrl.substring(1);
  }
  return imageUrl;
}

/**
 * @desc Generate a custom AI design on the actual product image
 * @route POST /api/ai/generate-design
 * @access Private
 */
export const generateDesign = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const { productId, variantId, prompt, strength } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    const variant = product.variants.find((v) => v.variantId === variantId);
    if (!variant) {
      return next(
        new AppError(
          `Variant "${variantId}" not found on "${product.name}"`,
          404,
        ),
      );
    }

    const frontImage = variant.images.find((img) => img.view === "front");
    if (!frontImage && variant.images.length === 0) {
      return next(
        new AppError(
          "This variant has no images. Cannot generate a design without a product image",
          400,
        ),
      );
    }

    const originalImageUrl = frontImage?.url || variant.images[0].url;
    const imageSource = resolveImageSource(originalImageUrl);

    const design = await CustomDesign.create({
      user: userId,
      product: productId,
      variantId,
      prompt,
      originalImageUrl,
      fee: config.customDesignFee,
      status: "pending",
    });

    try {
      const filename = await generateDesignImage(
        imageSource,
        prompt,
        product.name,
        variant.color.name,
        strength || 0.55,
      );

      design.generatedImageUrl = `/uploads/designs/${filename}`;
      design.status = "completed";
      await design.save();

      const baseUrl = `${req.protocol}://${req.get("host")}`;

      res.status(201).json({
        success: true,
        message: "Design generated successfully",
        data: {
          designId: design._id,
          product: {
            name: product.name,
            color: variant.color.name,
          },
          prompt: design.prompt,
          originalImageUrl: originalImageUrl.startsWith("http")
            ? originalImageUrl
            : `${baseUrl}${originalImageUrl}`,
          generatedImageUrl: `${baseUrl}${design.generatedImageUrl}`,
          fee: design.fee,
          status: design.status,
        },
      });
    } catch (error: any) {
      design.status = "failed";
      await design.save();

      if (error.response?.status === 503) {
        return next(
          new AppError(
            "AI model is warming up. Please try again in about 60 seconds",
            503,
          ),
        );
      }

      console.error("AI generation failed:", error.message);
      return next(
        new AppError("Failed to generate design. Please try again later", 500),
      );
    }
  },
);

/**
 * @desc Retry a failed design generation
 * @route POST /api/ai/designs/:id/retry
 * @access Private
 */
export const retryDesign = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    const design = await CustomDesign.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!design) {
      return next(new AppError("Design not found", 404));
    }

    if (design.status !== "failed") {
      return next(
        new AppError(
          `Can only retry failed designs. This design is "${design.status}"`,
          400,
        ),
      );
    }

    const product = await Product.findById(design.product);
    if (!product) {
      return next(new AppError("Original product no longer exists", 404));
    }

    const variant = product.variants.find(
      (v) => v.variantId === design.variantId,
    );
    if (!variant) {
      return next(new AppError("Original variant no longer exists", 404));
    }

    const imageSource = resolveImageSource(design.originalImageUrl);

    design.status = "pending";
    await design.save();

    try {
      const filename = await generateDesignImage(
        imageSource,
        design.prompt,
        product.name,
        variant.color.name,
        0.55,
      );

      design.generatedImageUrl = `/uploads/designs/${filename}`;
      design.status = "completed";
      await design.save();

      const baseUrl = `${req.protocol}://${req.get("host")}`;

      res.status(200).json({
        success: true,
        message: "Design retried and generated successfully",
        data: {
          designId: design._id,
          prompt: design.prompt,
          generatedImageUrl: `${baseUrl}${design.generatedImageUrl}`,
          fee: design.fee,
          status: design.status,
        },
      });
    } catch (error: any) {
      design.status = "failed";
      await design.save();

      if (error.response?.status === 503) {
        return next(
          new AppError(
            "AI model is still warming up. Please try again in about 60 seconds",
            503,
          ),
        );
      }

      return next(new AppError("Retry failed. Please try again later", 500));
    }
  },
);

/**
 * @desc Get all of the current user's custom designs
 * @route GET /api/ai/my-designs
 * @access Private
 */
export const getMyDesigns = asyncHandler(
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    const designs = await CustomDesign.find({ user: userId })
      .populate("product", "name slug basePrice currency variants")
      .sort("-createdAt");

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const designsWithUrls = designs.map((d) => ({
      ...d.toJSON(),
      generatedImageUrl: d.generatedImageUrl
        ? `${baseUrl}${d.generatedImageUrl}`
        : null,
    }));

    res.status(200).json({
      success: true,
      count: designs.length,
      data: designsWithUrls,
    });
  },
);

/**
 * @desc Get a single custom design by ID
 * @route GET /api/ai/designs/:id
 * @access Private
 */
export const getDesign = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    const design = await CustomDesign.findOne({
      _id: req.params.id,
      user: userId,
    }).populate("product", "name slug basePrice currency variants");

    if (!design) {
      return next(new AppError("Design not found", 404));
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.status(200).json({
      success: true,
      data: {
        ...design.toJSON(),
        generatedImageUrl: design.generatedImageUrl
          ? `${baseUrl}${design.generatedImageUrl}`
          : null,
      },
    });
  },
);

/**
 * @desc Check if the AI model is ready
 * @route GET /api/ai/status
 * @access Private
 */
export const getAiStatus = asyncHandler(async (req: Request, res: Response) => {
  const status = await checkModelStatus();

  res.status(200).json({
    success: true,
    data: status,
  });
});
