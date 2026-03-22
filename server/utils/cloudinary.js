import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Test connection on startup
cloudinary.api.ping()
  .then(() => console.log('Cloudinary connected ✅'))
  .catch(err => console.error('Cloudinary error:', err.message))

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
      gravity: 'face'
    }],
  },
})

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
})

export const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files allowed'), false)
    }
  }
})

export const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files allowed'), false)
    }
  }
})

export default cloudinary