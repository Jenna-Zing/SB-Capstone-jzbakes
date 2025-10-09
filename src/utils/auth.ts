import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';

// Creates a JWT token with some user info (payload) embedded inside, valid for 1 hour.
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

// Checks if a given token is valid and untampered. Returns decoded data if valid, else null.
export const verifyToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET); // JWT_SECRET must match what was used to sign the token
    return decoded; // This is the payload (e.g., { username: "john_doe", iat: ..., exp: ... })
  } catch (error) {
    console.error('Invalid or expired token:', error.message);
    return null; // Token is invalid or expired
  }
};

// Uses bcrypt to securely hash plain-text passwords before storing in DB.
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compares raw password input to a hashed one, returns true if they match.
export const comparePasswords = async (
  inputPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};
