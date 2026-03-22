import express from 'express';
const router = express.Router();
import { getAllExperience, createExperience, updateExperience, deleteExperience } from '../controllers/experienceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .get(getAllExperience)
  .post(protect, admin, createExperience);

router.route('/:id')
  .put(protect, admin, updateExperience)
  .delete(protect, admin, deleteExperience);

export default router;
