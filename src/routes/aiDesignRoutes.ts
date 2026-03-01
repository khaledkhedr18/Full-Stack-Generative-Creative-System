import { Router } from "express";
import {
  generateDesign,
  retryDesign,
  getMyDesigns,
  getDesign,
  getAiStatus,
} from "../controllers/aiDesignController.js";
import {
  generateDesignRules,
  getDesignRules,
} from "../middleware/validators/aiDesignValidator.js";
import validate from "../middleware/validators/validate.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/status", getAiStatus);

router.post("/generate-design", generateDesignRules, validate, generateDesign);

router.post("/designs/:id/retry", getDesignRules, validate, retryDesign);

router.get("/my-designs", getMyDesigns);

router.get("/designs/:id", getDesignRules, validate, getDesign);

export default router;
