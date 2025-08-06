import express from 'express';
import { getOrderItems, createOrderItem } from '../controllers/orderItemController';

const router = express.Router();

router.get('/', getOrderItems);
router.post('/', createOrderItem);

export default router;
