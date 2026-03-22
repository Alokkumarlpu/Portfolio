const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Profile = require('./models/Profile');
const Certificate = require('./models/Certificate');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const migrateCertificates = async () => {
  try {
    await connectDB();
    
    const profile = await Profile.findOne();
    if (profile && profile.certificates && profile.certificates.length > 0) {
      console.log(`Found ${profile.certificates.length} certificates in profile. Migrating...`);
      
      for (const certData of profile.certificates) {
        // Check if certificate already exists to avoid duplicates
        const existing = await Certificate.findOne({ title: certData.title });
        if (!existing) {
          const newCert = new Certificate({
            title: certData.title,
            issuer: certData.issuer,
            date: certData.date,
            link: certData.link,
            imageUrl: certData.imageUrl,
            description: certData.description || 'Completed certification.',
            tags: certData.tags || ['Certification'],
            icon: certData.icon || '📜'
          });
          await newCert.save();
          console.log(`Migrated: ${certData.title}`);
        } else {
          console.log(`Skipped (already exists): ${certData.title}`);
        }
      }
      
      // Optionally clear profile certificates after migration
      // profile.certificates = [];
      // await profile.save();
      // console.log('Cleared certificates from profile.');
      
    } else {
      console.log('No certificates found in profile to migrate.');
    }

    console.log('Migration completed!');
    process.exit();
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateCertificates();
