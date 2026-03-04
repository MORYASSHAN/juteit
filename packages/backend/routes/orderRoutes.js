import express from 'express';
import { addOrderItems, cancelOrder, getMyOrders, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.put('/:id/cancel', protect, cancelOrder);

// Admin Routes
router.get('/', protect, admin, getOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
