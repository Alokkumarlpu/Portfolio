import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'Frontend', // Options: Frontend, Backend, Database, Tools
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Skill', skillSchema);
