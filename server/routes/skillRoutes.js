import express from 'express';
const router = express.Router();
import { getAllSkills, createSkill, updateSkill, deleteSkill } from '../controllers/skillController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .get(getAllSkills)
  .post(protect, admin, createSkill);

router.route('/:id')
  .put(protect, admin, updateSkill)
  .delete(protect, admin, deleteSkill);

export default router;
