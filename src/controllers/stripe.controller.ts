import { Request, Response } from "express";
import {
  createPaymentIntent,
  constructWebhookEvent,
} from "../services/stripe.service";

const createPaymentIntentAPI = async (req: Request, res: Response) => {
  const { amount } = req.body;

  if (!amount || typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    const paymentIntent = await createPaymentIntent(amount);
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: "Failed to create payment intent", error: err });
  }
};

const stripeWebhookAPI = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).json({ message: "Webhook secret not configured" });
  }

  try {
    const event = constructWebhookEvent(req.body as Buffer, sig, webhookSecret);

    switch (event.type) {
      case "payment_intent.succeeded":
        console.log("PaymentIntent succeeded:", event.data.object.id);
        break;
      case "payment_intent.payment_failed":
        console.log("PaymentIntent failed:", event.data.object.id);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).json({ message: "Webhook signature verification failed", error: err });
  }
};

export { createPaymentIntentAPI, stripeWebhookAPI };
