import express from 'express';
import {
  createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus
} from '../controllers/order.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

export default router;