const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Your Name' },
  title: { type: String, default: 'Full Stack Developer' },
  bio: { type: String, default: 'Welcome to my portfolio' },
  about: { type: String, default: 'About me content...' },
  email: { type: String, default: 'email@example.com' },
  phone: { type: String, default: '+1234567890' },
  location: { type: String, default: 'City, Country' },
  profileImage: { type: String }, // Cloudinary URL
  resumeUrl: { type: String }, // Cloudinary PDF URL
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' }
  },
  heroTypingRoles: { type: [String], default: ['Developer', 'Designer'] },
  achievements: [{
    title: String,
    description: String,
    date: String,
    icon: String
  }],
  certificates: [{
    title: String,
    issuer: String,
    date: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
