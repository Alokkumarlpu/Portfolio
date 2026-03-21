const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadProfileImage, uploadResumePDF } = require('../controllers/profileController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadImage, uploadResume } = require('../utils/cloudinary');

router.route('/')
  .get(getProfile)
  .put(protect, admin, updateProfile);

router.post('/upload-image', protect, admin, uploadImage.single('profileImage'), uploadProfileImage);
router.post('/upload-resume', protect, admin, uploadResume.single('resume'), uploadResumePDF);

module.exports = router;
