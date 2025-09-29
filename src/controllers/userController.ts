import { Request, Response } from 'express';
import pool from '../db';
import { hashPassword, comparePasswords, generateToken } from '../utils/auth';

const tableName = 'user';

export const getUsers = (req: Request, res: Response) => {
  res.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]);
};

/* export const createUser = (req: Request, res: Response) => {
  const newUser = req.body; // TODO: how do you define and get this data?
  res.status(201).json({
    message: 'User created',
    user: newUser,
  });
}; */

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, phoneNumber, email, username, password } =
    req.body;

  try {
    const existingUser = await pool.query(
      `SELECT * FROM "${tableName}" WHERE username = $1`,
      [username]
    );
    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ message: 'An account with this username already exists' });
    }

    const hashed = await hashPassword(password);
    const newUser = await pool.query(
      `INSERT INTO "${tableName}" (first_name, last_name, phone_number, email, username, password)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, username`,
      [firstName, lastName, phoneNumber, email, username, hashed]
    );

    const token = generateToken({
      id: newUser.rows[0].id,
      email: newUser.rows[0].email,
      username: newUser.rows[0].username,
    });

    // Set token in cookie (HttpOnly for security)
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(201).json({ message: 'User created', user: newUser.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sign up error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT username, email, first_name, last_name, password FROM "${tableName}" WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isValid = await comparePasswords(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({
      message: 'Logged in',
      user: {
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        accessToken: token,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login error' });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 0, // set maxAge to 0 to immediately expire the cookie
    });
    res.json({ message: 'Logged out' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging out' });
  }
};
