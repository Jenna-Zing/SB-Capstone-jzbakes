import { Request, Response } from 'express';
import pool from '../db';

export async function getHome(req: Request, res: Response): Promise<void> {
  // res.send('Hello from Express!');
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      time: result.rows[0].now,
      message: 'Hello from Express!',
    });
  } catch (err) {
    console.error('Database connection failed:', err);
    res
      .status(500)
      .json({ success: false, error: 'Database connection failed' });
  }
}
