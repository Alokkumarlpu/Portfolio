const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Certificate = require('./models/Certificate');
const { transformDriveUrl } = require('./utils/googleDrive');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const updateExistingCertificates = async () => {
  try {
    await connectDB();
    
    const certificates = await Certificate.find({});
    console.log(`Checking ${certificates.length} certificates...`);
    
    for (const cert of certificates) {
      if (cert.imageUrl && cert.imageUrl.includes('drive.google.com') && !cert.imageUrl.includes('thumbnail')) {
        const newUrl = transformDriveUrl(cert.imageUrl);
        if (newUrl !== cert.imageUrl) {
          cert.imageUrl = newUrl;
          await cert.save();
          console.log(`Updated image for: ${cert.title}`);
        }
      }
    }

    console.log('Update completed!');
    process.exit();
  } catch (error) {
    console.error('Update error:', error);
    process.exit(1);
  }
};

updateExistingCertificates();
