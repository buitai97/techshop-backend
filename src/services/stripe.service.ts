import stripe from "../config/stripe";

const createPaymentIntent = async (amount: number, currency = "usd") => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe expects cents
    currency,
    automatic_payment_methods: { enabled: true },
  });
  return paymentIntent;
};

const retrievePaymentIntent = async (paymentIntentId: string) => {
  return stripe.paymentIntents.retrieve(paymentIntentId);
};

const constructWebhookEvent = (
  payload: Buffer,
  signature: string,
  secret: string,
) => {
  return stripe.webhooks.constructEvent(payload, signature, secret);
};

export { createPaymentIntent, retrievePaymentIntent, constructWebhookEvent };
