import { Router } from "express";
import {
  createCheckoutSession,
  stripeWebhook,
  verifySession,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/webhook", stripeWebhook);

router.post("/create-checkout-session", protect, createCheckoutSession);
router.get("/verify-session/:sessionId", protect, verifySession);

export default router;
