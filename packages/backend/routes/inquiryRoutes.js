import express from 'express';
import { deleteInquiry, getInquiries, submitInquiry, updateInquiryStatus } from '../controllers/inquiryController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitInquiry);                                      // Public
router.get('/', protect, admin, getInquiries);                       // Admin only
router.put('/:id', protect, admin, updateInquiryStatus);             // Admin only
router.delete('/:id', protect, admin, deleteInquiry);                // Admin only

export default router;
