import { Request, Response } from 'express';

export const getOrderItems = (req: Request, res: Response) => {
  res.json([{ id: 1, orderId: 1, productId: 2, quantity: 3 }]);
};

export const createOrderItem = (req: Request, res: Response) => {
  const newItem = req.body;
  res.status(201).json({
    message: 'Order item created',
    item: newItem,
  });
};
