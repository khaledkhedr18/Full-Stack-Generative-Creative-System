import { NextFunction, Request, Response } from "express";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { AuthRequest } from "../middleware/auth.js";

/**
 * @desc Get all products with filtering, sorting, pagination
 * @route GET /api/product
 * @access Public
 */

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const features = new ApiFeatures(
    Product.find(),
    req.query as Record<string, string>,
  )
    .filter()
    .search(["name", "description", "brand", "tags"])
    .sort()
    .selectFields()
    .paginate();

  await features.countTotal();

  const products = await features.query;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  res.status(200).json({
    success: true,
    count: products.length,
    total: features.total,
    page,
    pages: Math.ceil(features.total / limit),
    data: products,
  });
});

/**
 * @desc Get a certain product using its id.
 * @route GET /api/product/:id
 * @access Public
 */

export const getProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(
        new AppError(`Product with ID ${req.params.id} was not found`, 404),
      );
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  },
);

/**
 * @desc Create a new product.
 * @route POST /api/product
 * @access Private
 */

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: `Product created: ${product.name}`,
      data: product,
    });
  },
);

/**
 * @desc Delete a certain product using its id.
 * @route DELETE /api/product/:id
 * @access Private
 */

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(
        new AppError(`Couldn't find product with id: ${req.params.id}`, 404),
      );
    }

    res.status(200).json({
      success: true,
      message: `Product with id ${req.params.id} was deleted successfully`,
    });
  },
);

/**
 * @desc Update a certain product using its id.
 * @route PATCH /api/product/:id
 * @access Private
 */

export const updateProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!product) {
      return next(
        new AppError(`Couldn't find product with id: ${req.params.id}`, 404),
      );
    }

    res.status(200).json({
      success: true,
      message: `Product with id: ${req.params.id} was updated successfully!`,
      data: product,
    });
  },
);

/**
 * @desc Upload images for a specific product variant
 * @route POST /api/products/:id/variants/:variantId/images
 * @access Private
 */
export const uploadProductImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(
        new AppError(`Product with ID ${req.params.id} was not found`, 404),
      );
    }

    const variant = product.variants.find(
      (v) => v.variantId === req.params.variantId,
    );

    if (!variant) {
      return next(
        new AppError(
          `Variant "${req.params.variantId}" not found on this product`,
          404,
        ),
      );
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files || (!files.image && !files.gallery)) {
      return next(new AppError("No image files provided", 400));
    }

    const PORT = process.env.PORT || 3000;
    const baseUrl =
      process.env.IMAGE_BASE_URL || `http://localhost:${PORT}/uploads/products`;

    if (files.image) {
      variant.images.push({
        url: `${baseUrl}/${files.image[0].filename}`,
        view: (req.body.view as string) || "front",
      });
    }

    if (files.gallery) {
      for (const file of files.gallery) {
        variant.images.push({
          url: `${baseUrl}/${file.filename}`,
          view: "gallery",
        });
      }
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: variant,
    });
  },
);
