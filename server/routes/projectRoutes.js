import express from 'express';
const router = express.Router();
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(getAllProjects).post(protect, createProject);
router
  .route('/:id')
  .get(getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

export default router;
