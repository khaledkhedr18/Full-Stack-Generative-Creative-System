import Stripe from "stripe";
import config from "../config/env.js";

const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: "2026-02-25.clover",
});

export default stripe;
