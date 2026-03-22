const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Certificate = require('./models/Certificate');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedCertificates = async () => {
  try {
    await connectDB();
    
    // Clear existing to avoid duplicates if needed, or just check
    // await Certificate.deleteMany({}); 

    const certificates = [
      {
        title: "Generative AI Mastermind",
        issuer: "Out Skill",
        date: "Nov 2025",
        description: "Mastered generative AI concepts including LLMs, prompt engineering, and AI application development.",
        tags: ["AI", "LLM", "Prompt Engineering"],
        link: "https://drive.google.com/file/d/1gCZXxcX2GfDjZOCzecbWTJS7ps0ecIoz/view",
        imageUrl: "https://drive.google.com/thumbnail?id=1gCZXxcX2GfDjZOCzecbWTJS7ps0ecIoz&sz=w1000",
        icon: "🤖"
      },
      {
        title: "Cloud Computing",
        issuer: "NPTEL",
        date: "Oct 2025",
        description: "Learned cloud infrastructure, deployment models, virtualization, and cloud service platforms.",
        tags: ["Cloud", "AWS", "DevOps"],
        link: "https://drive.google.com/file/d/1p6CnWkmu5tx3G80gVzN1qbgidfTpGWYo/view",
        imageUrl: "https://drive.google.com/thumbnail?id=1p6CnWkmu5tx3G80gVzN1qbgidfTpGWYo&sz=w1000",
        icon: "☁️"
      }
    ];

    for (const cert of certificates) {
      const existing = await Certificate.findOne({ title: cert.title });
      if (!existing) {
        await Certificate.create(cert);
        console.log(`Added: ${cert.title}`);
      } else {
        console.log(`Updating: ${cert.title}`);
        await Certificate.findOneAndUpdate({ title: cert.title }, cert);
      }
    }

    console.log('Certificates seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding certificates:', error);
    process.exit(1);
  }
};

seedCertificates();
