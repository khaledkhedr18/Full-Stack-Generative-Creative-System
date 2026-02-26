import { Router, Request, Response } from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  createUser,
} from "../controllers/userController.js";
import {
  createUserRules,
  getUserRules,
  updateUserRules,
} from "../middleware/validators/userValidator.js";
import validate from "../middleware/validators/validate.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

router.use(protect, authorize("admin"));

router.route("/").get(getUsers).post(createUserRules, validate, createUser);

router
  .route("/:id")
  .get(getUserRules, validate, getUser)
  .delete(getUserRules, validate, deleteUser)
  .patch(getUserRules, updateUserRules, validate, updateUser);

export default router;
