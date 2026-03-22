const express = require('express');
const router = express.Router();
const { getAllAchievements, createAchievement, updateAchievement, deleteAchievement } = require('../controllers/achievementController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllAchievements)
  .post(protect, admin, createAchievement);

router.route('/:id')
  .put(protect, admin, updateAchievement)
  .delete(protect, admin, deleteAchievement);

module.exports = router;
