import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import useFetch from '../hooks/useFetch';
import { experienceService } from '../services/experienceService';
import { profileService } from '../services/profileService';
import { achievementService } from '../services/achievementService';

const fallbackExperience = [
  {
    title: "Web Development Intern",
    company: "Vanillakart",
    type: "Work",
    startDate: "2025-09-01",
    endDate: "2025-11-30",
    current: false,
    description: "Built and maintained responsive web applications using MERN stack, implementing REST APIs and dynamic UI components. Managed authentication, data handling, and performance optimization. Delivered scalable mobile-friendly solutions."
  },
  {
    title: "Java Application Development Training",
    company: "Lovely Professional University",
    type: "Training",
    startDate: "2025-06-01",
    endDate: "2025-07-31",
    current: false,
    description: "Mastered Java for application development. Built 4 Java apps: File Splitter & Merger, Road Runner, World Clock, Snake Game using OOP, Swing, and multithreading. Implemented JDBC connectivity."
  },
  {
    title: "B.Tech Computer Science and Engineering",
    company: "Lovely Professional University",
    type: "Education",
    startDate: "2023-08-01",
    endDate: null,
    current: true,
    description: "Pursuing B.Tech in CSE with CGPA 7.06. Specializing in full-stack development, algorithms, and software engineering."
  },
  {
    title: "Intermediate (PCM)",
    company: "P.L.S College, Patna",
    type: "Education",
    startDate: "2022-01-01",
    endDate: "2023-01-01",
    current: false,
    description: "Completed Intermediate with PCM stream.\nPercentage: 64%"
  },
  {
    title: "Matriculation",
    company: "Bal Vidya Niketan, Patna",
    type: "Education",
    startDate: "2020-01-01",
    endDate: "2021-01-01",
    current: false,
    description: "Completed matriculation.\nPercentage: 69%"
  }
];

const fallbackAchievements = [
  {
    title: "HackSmart Finalist — Top 10 Teams",
    company: "HackSmart: Code India Forward",
    type: "Achievement",
    icon: "🏆",
    date: "2026",
    description: "Developed scalable full-stack multilingual voice assistant using LLAMA LLM with real-time speech processing and API integration."
  },
  {
    title: "Google Adversarial Nibbler Contributor",
    company: "Google / LPU",
    type: "Achievement",
    icon: "🎯",
    date: "2024",
    description: "Identified AI vulnerabilities in Google's Adversarial Nibbler Project and earned ₹9,000 reward."
  }
];

const parseDateValue = (dateStr) => {
  if (!dateStr) return new Date(0).getTime();
  const parsed = new Date(dateStr);
  return isNaN(parsed) ? new Date(0).getTime() : parsed.getTime();
};

const formatDateBadge = (start, end, current) => {
  if (!start) return '';
  const startYr = new Date(start).getFullYear();
  const endYr = current ? 'Present' : (end ? new Date(end).getFullYear() : '');
  if (startYr && endYr) return `${startYr} - ${endYr}`;
  if (startYr) return `${startYr}`;
  return '';
};

const dotColorMap = {
  Work: { dot: 'bg-green-500 border-green-300', shadow: 'shadow-[0_0_10px_rgba(34,197,94,0.8)]', ping: 'bg-green-500/30' },
  Training: { dot: 'bg-blue-500 border-blue-300', shadow: 'shadow-[0_0_10px_rgba(59,130,246,0.8)]', ping: 'bg-blue-500/30' },
  Education: { dot: 'bg-purple-500 border-purple-300', shadow: 'shadow-[0_0_10px_rgba(124,58,237,0.8)]', ping: 'bg-purple-500/30' },
  Achievement: { dot: 'bg-amber-500 border-amber-300', shadow: 'shadow-[0_0_10px_rgba(245,158,11,0.8)]', ping: 'bg-amber-500/30' },
};

const borderColorMap = {
  Work: 'border-l-green-500',
  Training: 'border-l-blue-500',
  Education: 'border-l-purple-500',
  Achievement: 'border-l-amber-500',
};

const TimelineItem = ({ entry, index }) => {
  const dateBadge = entry.dateLabel || formatDateBadge(entry.startDate || entry.date, entry.endDate, entry.current);
  const dotStyle = dotColorMap[entry.type] || dotColorMap.Education;
  const borderColor = borderColorMap[entry.type] || 'border-l-purple-500';

  return (
    <motion.div
      className="relative pl-8 mb-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      variants={{
        hidden: { opacity: 0, x: -50 },
        visible: { 
          opacity: 1, 
          x: 0, 
          transition: { type: 'spring', stiffness: 100, damping: 20, delay: index * 0.1 } 
        }
      }}
    >
      {/* Dot — centered on the vertical line at left:0 */}
      <div className="absolute left-0 top-6 -translate-x-1/2 z-20">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, delay: index * 0.1 + 0.2 }}
          className="relative"
        >
          {entry.current && (
            <div className={`absolute inset-0 rounded-full ${dotStyle.ping} animate-ping scale-150`} />
          )}
          <div className={`relative w-4 h-4 rounded-full border-2 bg-[#0a0a1a] ${dotStyle.dot} ${dotStyle.shadow} transition-transform duration-300 group-hover:scale-125`} />
        </motion.div>
      </div>

      {/* Card */}
      <div className={`bg-gray-900/40 backdrop-blur-md border border-gray-700/30 border-l-4 ${borderColor} rounded-2xl p-5 md:p-6 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(124,58,237,0.15)] transition-all duration-500 group relative overflow-hidden`}>
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-colors duration-500" />
        
        {/* Title + Date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 relative z-10">
          <h4 className="font-bold text-white text-lg leading-tight group-hover:text-[#06b6d4] transition-colors duration-300">
            {entry.icon && <span className="mr-2 text-xl">{entry.icon}</span>}
            {entry.title}
          </h4>
          {dateBadge && (
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="text-[10px] px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-300 whitespace-nowrap border border-purple-500/20 flex-shrink-0 font-mono font-bold tracking-wider uppercase shadow-[0_0_10px_rgba(168,85,247,0.1)]"
            >
              {dateBadge}
            </motion.span>
          )}
        </div>

        {/* Company */}
        {(entry.company || entry.issuer || entry.organization) && (
          <p className="text-purple-400 font-semibold mb-3 flex items-center gap-2 relative z-10 text-sm md:text-base">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></span>
            <span className="break-words">
              {entry.company || entry.issuer || entry.organization}
              {entry.location && (
                <span className="text-gray-500 font-normal"> | {entry.location}</span>
              )}
            </span>
          </p>
        )}

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap relative z-10 group-hover:text-gray-300 transition-colors duration-300">
          {entry.description}
        </p>

        {/* Type badge */}
        {(entry.type) && (
          <div className="mt-4 relative z-10">
            <span className="text-[10px] px-2.5 py-1 rounded bg-gray-800/50 text-gray-400 border border-gray-700/50 uppercase tracking-widest font-bold">
              {entry.type}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const TimelineSection = ({ heading, entries }) => {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="mb-12">
      {/* Sub-heading - Letter by letter reveal */}
      <div className="flex justify-center flex-wrap overflow-hidden">
        {heading.split("").map((letter, i) => (
          <motion.h3
            key={i}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03, duration: 0.4 }}
            className="text-2xl font-bold mb-2 mt-16 font-heading text-white tracking-tight mr-[1px]"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.h3>
        ))}
      </div>
      <div className="flex justify-center mb-10">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "3rem" }}
          transition={{ duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
        />
      </div>

      {/* Timeline wrapper */}
      <div className="relative">
        {/* Vertical line at left:0 */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/5 rounded-full" />
        
        {/* Progress Line - Using whileInView with spring for simpler robust behavior that feels premium */}
        <motion.div 
          className="absolute left-0 top-0 w-[2px] bg-gradient-to-b from-purple-500 via-blue-500 to-indigo-500 rounded-full origin-top z-10 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.5, ease: "circOut" }}
          style={{ height: '100%' }}
        />

        {/* Cards */}
        {entries.map((entry, i) => (
          <TimelineItem key={entry._id || i} entry={entry} index={i} />
        ))}
      </div>
    </div>
  );
};

const Journey = () => {
  const { data: allExpData, loading: expLoading } = useFetch(experienceService.getAllExperience);
  const { data: profileData, loading: profLoading } = useFetch(profileService.getProfile);
  const { data: achievementsData, loading: achLoading } = useFetch(achievementService.getAllAchievements);
  const containerRef = useRef(null);

  const loading = expLoading || profLoading || achLoading;

  const rawExp = (allExpData && allExpData.length > 0) ? allExpData : fallbackExperience;
  const rawAchievements = (achievementsData && achievementsData.length > 0) 
    ? achievementsData 
    : (profileData?.achievements?.length > 0 ? profileData.achievements : fallbackAchievements);

  const workEntries = [...rawExp].filter(e => e.type === 'Work').sort((a, b) => parseDateValue(b.startDate) - parseDateValue(a.startDate));
  const trainingEntries = [...rawExp].filter(e => e.type === 'Training').sort((a, b) => parseDateValue(b.startDate) - parseDateValue(a.startDate));
  const educationEntries = [...rawExp].filter(e => e.type === 'Education').sort((a, b) => parseDateValue(b.startDate) - parseDateValue(a.startDate));
  
  const achievementEntries = [
    ...([...rawAchievements].map(a => ({ ...a, type: 'Achievement' }))),
    ...([...rawExp].filter(e => e.type === 'Achievement'))
  ].sort((a, b) => {
    const valA = parseDateValue(a.date || a.startDate);
    const valB = parseDateValue(b.date || b.startDate);
    return valB - valA;
  });

  return (
    <section id="journey" className="py-24 bg-[#050510] transition-colors relative overflow-hidden" ref={containerRef}>
      {/* Background Particles/Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,rgba(124,58,237,0.05)_0%,rgba(5,5,16,1)_60%)] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-full h-1/2 bg-[radial-gradient(circle_at_90%_80%,rgba(6,182,212,0.03)_0%,rgba(5,5,16,1)_70%)] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Main heading - Split Text Effect */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 text-center flex flex-col items-center"
        >
          <div className="flex flex-wrap justify-center overflow-hidden">
            {"My Journey".split(" ").map((word, i) => (
              <motion.h2 
                key={i}
                variants={{
                  hidden: { y: 60, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 } }
                }}
                className="text-4xl md:text-5xl font-heading font-extrabold text-[#e2e8f0] mb-4 tracking-tight mr-4"
              >
                {word}
              </motion.h2>
            ))}
          </div>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "5rem" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-1.5 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-full drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]" 
          />
        </motion.div>

        {loading && rawExp === fallbackExperience ? (
          <div className="mt-16 text-center text-[#64748b] animate-pulse">Loading journey data...</div>
        ) : (
          <div className="space-y-16">
            <TimelineSection heading="Experience" entries={workEntries} />
            <TimelineSection heading="Training" entries={trainingEntries} />
            <TimelineSection heading="Education" entries={educationEntries} />
            {achievementEntries.length > 0 && (
              <TimelineSection heading="Achievements" entries={achievementEntries} />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Journey;
