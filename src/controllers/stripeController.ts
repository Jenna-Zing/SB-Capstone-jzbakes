import { Request, Response } from 'express';
import pool from '../db';
import { stripe } from '../config/stripe';

const calculateOrderAmount = (items: any[]) => {
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  let total = 0;
  items.forEach((item) => {
    total += item.cost * item.quantity;
  });
  // Stripe expects the amount in cents (integer)
  return Math.round(total * 100);
};

export const createPaymentIntent = async (req: Request, res: Response) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: 'usd',
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({ clientSecret: paymentIntent.client_secret });
};

// IMPORTANT: For webhook endpoints, use raw body
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  // const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const webhookSecret =
    'whsec_5ef1cfa69ea601e6cb45611e79c108fbbbd12169de5c527c4a36d7ea6a25c71e';

  let event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Verified webhook', event.type);

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;

      // Save to your database
      try {
        await pool.query(
          `INSERT INTO stripePayments 
          (stripe_payment_intent_id, amount, currency, status, customer_email, created_at) 
          VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            paymentIntent.id,
            paymentIntent.amount,
            paymentIntent.currency,
            'succeeded',
            paymentIntent.receipt_email,
            new Date(paymentIntent.created * 1000),
          ]
        );
      } catch (dbError: any) {
        console.error("Error saving to database:", dbError.message);
        // We still want to return 200 to Stripe so it doesn't retry, 
        // but we should log this critical failure.
      }
      // await db.transactions.create({
      //   stripe_payment_intent_id: paymentIntent.id,
      //   amount: paymentIntent.amount,
      //   currency: paymentIntent.currency,
      //   status: 'succeeded',
      //   customer_email: paymentIntent.receipt_email,
      //   created_at: new Date(paymentIntent.created * 1000),
      // });

      console.log('PaymentIntent was successful!');
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('PaymentIntent failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt
  res.json({ received: true });
};
