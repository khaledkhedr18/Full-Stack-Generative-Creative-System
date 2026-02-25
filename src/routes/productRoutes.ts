import { Router } from "express";
import {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "../controllers/productController.js";
import {
  createProductRules,
  getProductRules,
  getProductsQueryRules,
  updateProductRules,
} from "../middleware/validators/productValidator.js";
import validate from "../middleware/validators/validate.js";
import { protect } from "../middleware/auth.js";
import { uploadProductImages } from "../middleware/upload.js";

const router = Router();

router
  .route("/")
  .get(getProductsQueryRules, validate, getProducts)
  .post(protect, createProductRules, validate, createProduct);

router
  .route("/:id")
  .get(getProductRules, validate, getProduct)
  .patch(protect, getProductRules, updateProductRules, validate, updateProduct)
  .delete(protect, getProductRules, validate, deleteProduct);

router.post(
  "/:id/variants/:variantId/images",
  protect,
  uploadProductImages,
  uploadProductImage,
);


export default router;
