import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// ==============================================================================
// CLOUDINARY CONFIGURATION
// ==============================================================================

// Validate required environment variables
const validateCloudinaryConfig = () => {
  const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Cloudinary configuration incomplete. Missing:');
    missing.forEach(key => console.error(`   - ${key}`));
    return false;
  }
  return true;
};

if (!validateCloudinaryConfig()) {
  console.error('⚠️  Cloudinary uploads will be disabled');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Test Cloudinary connection on startup
cloudinary.api.ping()
  .then(() => {
    console.log(`✅ Cloudinary connected (${process.env.CLOUDINARY_CLOUD_NAME})`);
  })
  .catch(err => {
    console.error('❌ Cloudinary connection failed:', err.message);
    console.error('   Check your CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
  });

// ==============================================================================
// MULTER STORAGE CONFIGURATIONS
// ==============================================================================

// Storage for profile images
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/profile',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{
      width: 500,
      height: 500,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
    }],
  },
});

// Storage for resume PDF
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'portfolio/resume',
    resource_type: 'raw',
    allowed_formats: ['pdf'],
    public_id: 'Alok_Kumar_Resume',
    format: 'pdf',
  }),
});

// ==============================================================================
// MULTER UPLOAD MIDDLEWARE
// ==============================================================================

export const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed (jpg, jpeg, png, webp)'), false);
    }
  },
});

export const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'), false);
    }
  },
});

export default cloudinary;