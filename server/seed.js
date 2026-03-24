import './config/env.js';
import mongoose from 'mongoose';
import Profile from './models/Profile.js';
import Skill from './models/Skill.js';
import Experience from './models/Experience.js';
import Project from './models/Project.js';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding');
    } catch (error) {
        console.error('Connection failed:', error);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();
    try {
        console.log('Clearing existing data...');
        await Skill.deleteMany({});
        await Experience.deleteMany({});
        await Project.deleteMany({});

        console.log('Seeding Profile (including achievements and certificates)...');
        const existingProfile = await Profile.findOne();
        const preservedProfileImage = existingProfile?.profileImage || '';
        const preservedResumeUrl = existingProfile?.resumeUrl || '';

        await Profile.findOneAndUpdate({}, {
            name: "Alok Kumar",
            title: "Full Stack Developer",
            bio: "Passionate Computer Science student at LPU building full-stack web applications with MERN stack. I love turning ideas into real-world products.",
            about: "Hi! I'm Alok Kumar, a B.Tech Computer Science student at Lovely Professional University, Phagwara. I specialize in full-stack web development using the MERN stack. I have hands-on experience building scalable web apps, REST APIs, and dynamic UIs. I'm passionate about solving real-world problems through clean, efficient code.",
            email: "alokkumar985642@gmail.com",
            phone: "+917970820876",
            location: "Phagwara, Punjab, India",
            profileImage: preservedProfileImage,
            resumeUrl: preservedResumeUrl,
            socialLinks: {
                github: "https://github.com/Alokkumarlpu",
                linkedin: "https://linkedin.com/in/alok7970",
                twitter: "",
                instagram: ""
            },
            heroTypingRoles: [
                "Full Stack Developer",
                "MERN Stack Developer"
            ],
            achievements: [
                {
                    title: "HackSmart Finalist — Top 10 Teams",
                    description: "Developed scalable full-stack multilingual voice assistant using LLAMA LLM with real-time speech processing at HackSmart: Code India Forward.",
                    date: "Jan 2026",
                    icon: "🏆"
                },
                {
                    title: "Google Adversarial Nibbler Contributor",
                    description: "Identified AI vulnerabilities in Google's Adversarial Nibbler Project and earned ₹9,000 reward.",
                    date: "Nov 2024",
                    icon: "🎯"
                }
            ],
            certificates: [
                {
                    title: "Generative AI Mastermind",
                    issuer: "Out Skill",
                    date: "Nov 2025"
                },
                {
                    title: "Cloud Computing",
                    issuer: "NPTEL",
                    date: "Oct 2025"
                }
            ]
        }, { new: true, upsert: true, setDefaultsOnInsert: true });

        console.log('Seeding Skills...');
        const skillsToInsert = [
            // Frontend
            { name: "React.js",     category: "Frontend",  order: 1 },
            { name: "JavaScript",   category: "Frontend",  order: 2 },
            { name: "HTML",         category: "Frontend",  order: 3 },
            { name: "CSS",          category: "Frontend",  order: 4 },
            { name: "Tailwind CSS", category: "Frontend",  order: 5 },

            // Backend
            { name: "Node.js",      category: "Backend",   order: 6 },
            { name: "Express.js",   category: "Backend",   order: 7 },
            { name: "Python",       category: "Backend",   order: 8 },
            { name: "Django",       category: "Backend",   order: 9 },
            { name: "Java",         category: "Backend",   order: 10 },
            { name: "PHP",          category: "Backend",   order: 11 },

            // Database
            { name: "MongoDB",      category: "Database",  order: 12 },
            { name: "MySQL",        category: "Database",  order: 13 },

            // Tools
            { name: "Git",          category: "Tools",     order: 14 },
            { name: "GitHub",       category: "Tools",     order: 15 },
            { name: "Docker",       category: "Tools",     order: 16 },
            { name: "Postman",      category: "Tools",     order: 17 },
        ];
        await Skill.insertMany(skillsToInsert);

        console.log('Seeding Experience...');
        const expToInsert = [
            {
                title: "Web Development Intern",
                company: "Vanillakart",
                type: "Work",
                startDate: new Date("2025-09-01"),
                endDate: new Date("2025-11-30"),
                current: false,
                description: "Built and maintained responsive web applications using MERN stack, implementing REST APIs and dynamic UI components. Managed authentication, data handling, and performance optimization. Delivered scalable mobile-friendly solutions.",
                order: 1
            },
            {
                title: "Java Application Development Training",
                company: "Lovely Professional University",
                type: "Training",
                startDate: new Date("2025-06-01"),
                endDate: new Date("2025-07-31"),
                current: false,
                description: "Mastered Java for application development. Built 4 Java apps: File Splitter & Merger, Road Runner, World Clock, Snake Game using OOP, Swing, and multithreading. Implemented JDBC connectivity.",
                order: 2
            },
            {
              title: "B.Tech Computer Science and Engineering",
              company: "Lovely Professional University",
              location: "Phagwara, Punjab",
              type: "Education",
              startDate: new Date("2023-08-01"),
              endDate: null,
              current: true,
              description: "Pursuing B.Tech in CSE with CGPA 7.06. Specializing in full-stack development, algorithms, and software engineering.",
              order: 3
            },
            {
              title: "Intermediate (PCM)",
              company: "P.L.S College",
              location: "Patna, Bihar",
              type: "Education",
              startDate: new Date("2022-05-01"),
              endDate: new Date("2023-05-31"),
              current: false,
              description: "Completed Intermediate with Physics, Chemistry and Mathematics (PCM) stream. Percentage: 64%",
              order: 4
            },
            {
              title: "Matriculation",
              company: "Bal Vidya Niketan",
              location: "Patna, Bihar",
              type: "Education",
              startDate: new Date("2020-03-01"),
              endDate: new Date("2021-04-30"),
              current: false,
              description: "Completed Secondary education with strong foundational knowledge across all subjects. Percentage: 69%",
              order: 5
            }
        ];
        // Handle endDate: null or undefined for 'current' experiences so that Mongoose validation doesn't fail
        const processExp = expToInsert.map(e => ({...e, endDate: e.current ? undefined : e.endDate}));
        await Experience.insertMany(processExp);

        console.log('Seeding Projects...');
        const projectsToInsert = [
            {
                title: 'Car Rental Web Application',
                description: 'Scalable car rental platform to digitize end-to-end rental operations with seamless booking, user management, and secure payment processing. Increased booking throughput by ~40%, reduced query latency by ~30% through optimization, and automated workflows cutting manual effort by ~50%.',
                image: '/projects/car-rental.png',
                techStack: ["Django", "MySQL", "Razorpay", "Tailwind CSS"],
                category: 'Web',
                featured: true,
                createdAt: new Date('2026-02-01'),
                visible: true,
                order: 1
            },
            {
                title: 'Language Translator',
                description: 'Secure and efficient MERN-based translation platform for managing multilingual content with role-based access, Google OAuth authentication, AI-powered translation, and bulk CSV processing. Increased translation efficiency by ~45% and improved response time by ~35%.',
                image: '/projects/translator.png',
                techStack: ["MongoDB", "Express.js", "React.js", "Node.js", "Google OAuth", "REST APIs"],
                category: 'Web',
                featured: true,
                createdAt: new Date('2025-12-01'),
                visible: true,
                order: 2
            },
            {
                title: 'Java Snake Game',
                description: 'Classic Snake game built in Java with Swing and AWT featuring OOP design, event handling, multithreading, and score tracking. Developed during Java training at LPU.',
                image: '/projects/snake-game.png',
                techStack: ["Java", "Swing", "AWT", "Multithreading", "OOP"],
                category: 'Game',
                featured: false,
                createdAt: new Date('2025-07-01'),
                visible: true,
                order: 3
            },
            {
                title: 'File Splitter & Merger',
                description: 'Java desktop application to split large files into smaller chunks and merge them back. Built with optimized I/O operations and multithreading for performance and reliability.',
                image: '/projects/file-splitter.png',
                techStack: ["Java", "Swing", "Multithreading", "File I/O", "JDBC"],
                category: 'Other',
                featured: false,
                createdAt: new Date('2025-06-15'),
                visible: true,
                order: 4
            },
            {
                title: 'Multilingual Voice Assistant',
                description: 'Full-stack multilingual voice assistant built for HackSmart hackathon using LLAMA LLM with real-time speech processing and API integration. Reached Top 10 Teams (Finalist) at HackSmart: Code India Forward.',
                image: '/projects/voice-assistant.png',
                techStack: ["LLAMA LLM", "Python", "React.js", "Speech Processing", "REST APIs"],
                category: 'AI',
                featured: true,
                createdAt: new Date('2026-01-15'),
                visible: true,
                order: 5
            }
        ];
        await Project.insertMany(projectsToInsert);

        console.log('Seed completed successfully!');
        mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        mongoose.disconnect();
        process.exit(1);
    }
};

seedData();
