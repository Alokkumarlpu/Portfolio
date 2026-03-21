const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('./models/Project');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedProjects = async () => {
  try {
    await connectDB();
    console.log('Clearing existing projects...');
    await Project.deleteMany();

    const projects = [
      {
        title: 'Car Rental Web Application',
        description: 'Developed a complete car rental management platform allowing users to browse vehicles, book rentals online, and make secure payments using Razorpay. The system supports role-based authentication for customers, car owners, and administrators.',
        techStack: ['Django', 'MySQL', 'Razorpay', 'Tailwind CSS'],
        category: 'Web',
        featured: true,
      },
      {
        title: 'Language Translator Platform',
        description: 'Built a secure English-to-Hindi translation platform designed for government use with role-based authentication. Implemented AI-assisted translation, glossary management, and bulk document processing.',
        techStack: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
        category: 'AI',
        featured: true,
      },
      {
        title: 'Java Applications Suite',
        description: 'Developed four Java applications including File Splitter & Merger, Road Runner Game, World Clock, and Snake Game while learning advanced Java concepts such as event handling, GUI design, and multithreading.',
        techStack: ['Java', 'Swing', 'Multithreading'],
        category: 'Other',
        featured: true,
      }
    ];

    console.log('Inserting new projects...');
    await Project.insertMany(projects);
    console.log('Projects seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding projects:', error);
    process.exit(1);
  }
};

seedProjects();
