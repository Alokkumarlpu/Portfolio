const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Certificate = require('./models/Certificate');
const { parseMonthYear } = require('./utils/dateUtils');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const updateSortDates = async () => {
  try {
    await connectDB();
    
    const certificates = await Certificate.find({});
    console.log(`Updating ${certificates.length} certificates...`);
    
    for (const cert of certificates) {
      if (cert.date) {
        cert.sortDate = parseMonthYear(cert.date);
        await cert.save();
        console.log(`Updated sortDate for: ${cert.title} -> ${cert.sortDate}`);
      }
    }

    console.log('Update completed!');
    process.exit();
  } catch (error) {
    console.error('Update error:', error);
    process.exit(1);
  }
};

updateSortDates();
