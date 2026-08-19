import express from 'express';
import {
  updateReview,
  deleteReview
} from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Reviews modifications require authentication
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
