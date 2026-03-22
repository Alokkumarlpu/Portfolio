require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { sendContactEmail } = require('./utils/sendEmail');

connectDB();

const app = express();

// Fix CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://aportfolio-mu.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Add health route BEFORE other routes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
});

// Routes
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/experience', require('./routes/experienceRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/achievements', require('./routes/achievementRoutes'));

app.get('/api/test-email', async (req, res) => {
  try {
    await sendContactEmail('Test Name', 'test@example.com', 'This is a test message');
    res.json({ success: true, message: 'Email sent!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Portfolio API is running...');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Keep-alive ping for Render free tier
  const renderUrl = process.env.RENDER_URL;
  if (renderUrl) {
    setInterval(async () => {
      try {
        await fetch(`${renderUrl}/api/health`);
        console.log('Keep-alive ping sent ✅');
      } catch (err) {
        console.log('Ping failed:', err.message);
      }
    }, 14 * 60 * 1000);
  }
});
