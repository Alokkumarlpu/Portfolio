import multer from 'multer';

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  
  // Multer file upload errors
  if (err instanceof multer.MulterError) {
    console.error(`[${timestamp}] MULTER ERROR:`, err.code, err.message);
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        message: 'Max size: 5MB for images, 10MB for PDF',
        code: 'LIMIT_FILE_SIZE'
      });
    }
    
    return res.status(400).json({
      success: false,
      error: err.message,
      code: err.code
    });
  }

  // JWT and Auth errors
  if (err.name === 'JsonWebTokenError') {
    console.error(`[${timestamp}] JWT ERROR:`, err.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    console.error(`[${timestamp}] TOKEN EXPIRED:`, err.message);
    return res.status(401).json({
      success: false,
      error: 'Token expired',
      code: 'TOKEN_EXPIRED'
    });
  }

  // MongoDB validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    console.error(`[${timestamp}] VALIDATION ERROR:`, messages);
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: messages
    });
  }

  // MongoDB duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    console.error(`[${timestamp}] DUPLICATE KEY ERROR:`, field, err.keyValue);
    return res.status(409).json({
      success: false,
      error: `Duplicate ${field}`,
      field: field
    });
  }

  // CORS errors
  if (err.message.includes('CORS')) {
    console.error(`[${timestamp}] CORS ERROR:`, err.message);
    return res.status(403).json({
      success: false,
      error: 'CORS policy violation',
      message: err.message
    });
  }

  // Generic error handler
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
  console.error(`[${timestamp}] SERVER ERROR [${statusCode}]:`);
  console.error(`  Method: ${req.method}`);
  console.error(`  URL: ${req.originalUrl}`);
  console.error(`  Message: ${err.message}`);
  if (err.stack) console.error(`  Stack: ${err.stack}`);

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
