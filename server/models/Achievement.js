const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String, // Organization/Issuer
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: String, // e.g., "Jan 2026"
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Achievement', achievementSchema);
