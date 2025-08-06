import { Request, Response } from 'express';

export const getUsers = (req: Request, res: Response) => {
  res.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]);
};

export const createUser = (req: Request, res: Response) => {
  const newUser = req.body; // TODO: how do you define and get this data?
  res.status(201).json({
    message: 'User created',
    user: newUser,
  });
};
