import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'Work' // Work, Education, Achievement
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Experience', experienceSchema);
