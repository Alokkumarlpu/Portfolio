const express = require('express');
const router = express.Router();
const {
  submitContact,
  getAllMessages,
  markAsRead,
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(submitContact).get(protect, getAllMessages);
router.route('/:id').put(protect, markAsRead);

module.exports = router;
