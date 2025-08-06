import express from 'express';
import { getUsers, createUser } from '../controllers/userController';

const router = express.Router();

router.get('/', getUsers); // GET /api/users
router.post('/', createUser); // POST /api/users

export default router;
