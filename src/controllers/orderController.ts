import { Request, Response } from 'express';

export const getOrders = (req: Request, res: Response) => {
  res.json([{ id: 1, userId: 2, total: 49.99 }]);
};

export const createOrder = (req: Request, res: Response) => {
  const newOrder = req.body;
  res.status(201).json({
    message: 'Order created',
    order: newOrder,
  });
};
