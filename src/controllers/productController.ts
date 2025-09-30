import { Request, Response } from 'express';
import pool from '../db';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const query =
      'SELECT id, name, CAST(cost AS INTEGER), description, ingredients, "imgURL" FROM product ORDER BY name ASC';
    const result = await pool.query(query);

    console.log('Products fetched from DB:', result.rows);

    res.status(200).json({ products: result.rows });
  } catch (err) {
    console.error('Database connection failed:', err);
    res
      .status(500)
      .json({ success: false, error: 'Database connection failed' });
  }
};
