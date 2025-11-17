import { Request, Response } from 'express';
import pool from '../db';
import {
  hashPassword,
  comparePasswords,
  verifyToken,
  generateToken,
} from '../utils/auth';

const tableName = 'user';

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(200).json(null); // No user logged in
      // return res.status(100).json({ message: 'Not logged in' });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.username) {
      return res.status(200).json(null); // invalid/expired token
      // return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const result = await pool.query(
      `SELECT id, username, email, first_name, last_name FROM "${tableName}" WHERE username = $1`,
      [decoded.username]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(200).json(null); // user not found
      // return res.status(404).json({ message: 'User not found' });
    }

    // Validate the user fields
    const isValidUser = validateUserFields(user);
    if (!isValidUser) {
      return res.status(200).json(null); // Invalid user data
    }

    // return the valid user data from their session cookie
    res.status(200).json({
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    });
  } catch (err) {
    console.error('Session restore error:', err);
    res.status(500).json({ message: 'Server error during session restore' });
  }
};

// Validate user fields to ensure they are not null, undefined, or empty
const validateUserFields = (user: {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}) => {
  return (
    user.username &&
    user.first_name &&
    user.last_name &&
    user.email &&
    user.username.trim() !== '' &&
    user.first_name.trim() !== '' &&
    user.last_name.trim() !== '' &&
    user.email.trim() !== ''
  );
};

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

    res.status(201).json({
      message: 'User was successfully created',
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      `SELECT id, username, email, first_name, last_name, password FROM "${tableName}" WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];

    if (!user) {
      console.error('User not found with username: ', username);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare passwords
    const isValid = await comparePasswords(password, user.password);
    if (!isValid) {
      console.error(`Invalid password (${password}) for user: ${username}`);
      return res.status(400).json({ message: 'Invalid username or password' });
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

    res.status(200).json({
      message: 'Successful Login',
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
    res.status(500).json({
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 0, // set maxAge to 0 to immediately expire the cookie
    });
    res.status(200).json({ message: 'Successful Logout' });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
};
