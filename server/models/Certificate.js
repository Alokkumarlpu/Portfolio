import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  issuer: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  sortDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: 'Completed certification.'
  },
  tags: {
    type: [String],
    default: ['Certification']
  },
  link: {
    type: String,
    default: '#'
  },
  imageUrl: {
    type: String
  },
  icon: {
    type: String,
    default: '📜'
  }
}, {
  timestamps: true
});

export default mongoose.model('Certificate', certificateSchema);
