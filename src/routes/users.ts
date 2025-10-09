import express from 'express';
// import { getUsers, createUser } from '../controllers/userController';
import {
  createUser,
  getCurrentUser,
  loginUser,
  logoutUser,
} from '../controllers/userController';

const router = express.Router();

// router.get('/', getUsers); // GET /api/users
// router.post('/', createUser); // POST /api/users
router.get('/me', getCurrentUser);
router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;
