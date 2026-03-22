import express from 'express';
const router = express.Router();
import { getAllAchievements, createAchievement, updateAchievement, deleteAchievement } from '../controllers/achievementController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .get(getAllAchievements)
  .post(protect, admin, createAchievement);

router.route('/:id')
  .put(protect, admin, updateAchievement)
  .delete(protect, admin, deleteAchievement);

export default router;
