const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('./models/Project');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const imageMap = {
  'Car Rental Web Application': '/projects/car-rental.png',
  'Language Translator': '/projects/translator.png',
  'Language Translator Platform': '/projects/translator.png',
  'Java Snake Game': '/projects/snake-game.png',
  'File Splitter & Merger': '/projects/file-splitter.png',
  'Multilingual Voice Assistant': '/projects/voice-assistant.png',
};

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);

    let updated = 0;
    for (const [title, image] of Object.entries(imageMap)) {
      const result = await Project.updateMany(
        {
          title,
          $or: [{ image: { $exists: false } }, { image: null }, { image: '' }],
        },
        { $set: { image } }
      );
      updated += result.modifiedCount || 0;
    }

    console.log(`Updated projects: ${updated}`);

    const projects = await Project.find({}, { _id: 0, title: 1, image: 1 }).lean();
    console.log(JSON.stringify(projects, null, 2));

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Failed to update project images:', error);
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  }
}

run();
