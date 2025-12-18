import { Request, Response } from 'express';
import pool from '../db';
import {
  hashPassword,
  comparePasswords,
  verifyToken,
  generateToken,
} from '../utils/auth';
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
