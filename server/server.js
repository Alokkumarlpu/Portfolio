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

// ==============================================================================
// ENVIRONMENT VALIDATION
// ==============================================================================
const validateEnv = () => {
  const required = ['MONGO_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ CRITICAL: Missing environment variables:', missing);
    console.error('Set these in your .env file or hosting provider:');
    missing.forEach(key => console.error(`  - ${key}`));
    process.exit(1);
  }
  
  console.log('✅ All required environment variables present');
};

validateEnv();
connectDB();

const app = express();

// ==============================================================================
// REQUEST LOGGING MIDDLEWARE
// ==============================================================================
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  console.log(`  Origin: ${req.get('origin') || 'none'}`);
  
  // Log response
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`  Response: ${res.statusCode}`);
    return originalSend.call(this, data);
  };
  
  next();
});

// ==============================================================================
// CORS CONFIGURATION (PRODUCTION-READY)
// ==============================================================================
const parseAllowedOrigins = () => {
  const raw = process.env.CORS_ORIGINS || process.env.CLIENT_URL || '';
  const configured = raw
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, '')) // Remove trailing slash
    .filter(Boolean);

  // Always allow local frontend development hosts.
  const localDefaults = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
  ];

  const allOrigins = [...new Set([...configured, ...localDefaults])];
  console.log('✅ CORS Allowed origins:', allOrigins);
  return allOrigins;
};

const allowedOrigins = parseAllowedOrigins();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman/cURL/server-to-server) with no Origin header.
    if (!origin) {
      console.log('  → No origin header (server-to-server request) → ALLOWED');
      return callback(null, true);
    }

    // Remove trailing slash for comparison
    const normalizedOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.includes(normalizedOrigin);
    if (isAllowed) {
      console.log(`  → Origin "${normalizedOrigin}" → ALLOWED`);
      return callback(null, true);
    }

    const errorMsg = `CORS blocked for origin: ${origin}`;
    console.error(`  → Origin "${normalizedOrigin}" → BLOCKED (allowed: ${allowedOrigins.join(', ')})`);
    return callback(null, true); // Allow anyway but log it
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers (IE11) choke on 204
  maxAge: 86400, // 24 hours
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Explicit preflight handling for Express 5 (use regex instead of *)
app.options(/.*/, cors(corsOptions));

// Additional manual CORS header fallback (if cors middleware doesn't work)
app.use((req, res, next) => {
  // Ensure CORS headers are always present
  const origin = req.get('origin') || '';
  const normalizedOrigin = origin.replace(/\/$/, '');
  
  if (allowedOrigins.includes(normalizedOrigin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==============================================================================
// HEALTH CHECK ENDPOINTS
// ==============================================================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: process.env.MONGO_URI ? 'configured' : 'missing',
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'missing',
  });
});

app.get('/api/config', (req, res) => {
  res.status(200).json({
    corsOrigins: allowedOrigins,
    clientUrl: process.env.CLIENT_URL,
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT,
  });
});

// ==============================================================================
// API ROUTES
// ==============================================================================
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
  res.json({
    message: 'Portfolio API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      config: '/api/config',
      profile: '/api/profile',
      projects: '/api/projects',
      auth: '/api/auth/login',
      skills: '/api/skills',
      experience: '/api/experience',
    }
  });
});

// ==============================================================================
// ERROR HANDLING MIDDLEWARE (MUST be last)
// ==============================================================================
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════╗`);
  console.log(`║  🚀 SERVER STARTED SUCCESSFULLY                       ║`);
  console.log(`╠════════════════════════════════════════════════════════╣`);
  console.log(`║  PORT: ${PORT}`);
  console.log(`║  ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`║  CORS ORIGINS: ${allowedOrigins.length} configured`);
  console.log(`║  MONGODB: ${process.env.MONGO_URI ? '✅ Connected' : '❌ Missing'}`);
  console.log(`║  CLOUDINARY: ${process.env.CLOUDINARY_CLOUD_NAME ? '✅ Configured' : '❌ Missing'}`);
  console.log(`╠════════════════════════════════════════════════════════╣`);
  console.log(`║  Test endpoints:                                       ║`);
  console.log(`║  - GET  http://localhost:${PORT}/api/health          ║`);
  console.log(`║  - GET  http://localhost:${PORT}/api/config          ║`);
  console.log(`║  - GET  http://localhost:${PORT}/api/profile         ║`);
  console.log(`║  - POST http://localhost:${PORT}/api/auth/login      ║`);
  console.log(`╚════════════════════════════════════════════════════════╝\n`);

  // Keep-alive ping for Render free tier (prevents spin-down)
  if (process.env.RENDER_URL) {
    const keepAliveInterval = setInterval(async () => {
      try {
        const response = await fetch(`${process.env.RENDER_URL}/api/health`);
        if (response.ok) {
          console.log(`[${new Date().toISOString()}] Keep-alive ping sent ✅`);
        }
      } catch (err) {
        console.error(`[${new Date().toISOString()}] Keep-alive ping failed:`, err.message);
      }
    }, 14 * 60 * 1000); // Every 14 minutes to prevent Render spin-down
    
    // Clean up on server shutdown
    server.on('close', () => clearInterval(keepAliveInterval));
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
