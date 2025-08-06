import { Request, Response } from 'express';

export const getProducts = (req: Request, res: Response) => {
  res.json([
    { id: 1, name: 'Phone', price: 699 },
    { id: 2, name: 'Laptop', price: 1200 },
  ]);
};
