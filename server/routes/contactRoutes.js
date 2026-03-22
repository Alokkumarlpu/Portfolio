import express from 'express';
const router = express.Router();
import {
  submitContact,
  getAllMessages,
  markAsRead,
} from '../controllers/contactController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(submitContact).get(protect, getAllMessages);
router.route('/:id').put(protect, markAsRead);

export default router;
