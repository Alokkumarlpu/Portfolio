const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  techStack: {
    type: [String],
    default: [],
  },
  githubLink: {
    type: String,
  },
  liveDemo: {
    type: String,
  },
  category: {
    type: String,
    enum: ['Web', 'Game', 'AI', 'Other'],
    default: 'Other',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', projectSchema);
