import express from 'express';
const router = express.Router();
import { getProfile, updateProfile, uploadProfileImage, uploadResumePDF } from '../controllers/profileController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadImage, uploadResume } from '../utils/cloudinary.js';

router.route('/')
  .get(getProfile)
  .put(protect, admin, updateProfile);

router.post('/upload-image', protect, admin, uploadImage.single('profileImage'), uploadProfileImage);
router.post('/upload-resume', protect, admin, uploadResume.single('resume'), uploadResumePDF);

export default router;
