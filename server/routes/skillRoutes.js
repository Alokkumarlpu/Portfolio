const express = require('express');
const router = express.Router();
const { getAllSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllSkills)
  .post(protect, admin, createSkill);

router.route('/:id')
  .put(protect, admin, updateSkill)
  .delete(protect, admin, deleteSkill);

module.exports = router;
