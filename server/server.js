import './config/env.js';
import path from 'path';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { sendContactEmail } from './utils/sendEmail.js';

// Route imports
import projectRoutes from './routes/projectRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';

connectDB();

const app = express();

const parseAllowedOrigins = () => {
  const raw = process.env.CORS_ORIGINS || process.env.CLIENT_URL || '';
  const configured = raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  // Always allow local frontend development hosts.
  const localDefaults = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
  ];

  return [...new Set([...configured, ...localDefaults])];
};

const allowedOrigins = parseAllowedOrigins();

const isAllowedVercelPreview = (origin) => {
  // Allow Vercel preview URLs only if explicitly enabled.
  if (process.env.ALLOW_VERCEL_PREVIEW !== 'true') return false;
  return /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(origin);
};

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman/cURL/server-to-server) with no Origin header.
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.includes(origin) || isAllowedVercelPreview(origin);
    if (isAllowed) return callback(null, true);

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/achievements', achievementRoutes);

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
