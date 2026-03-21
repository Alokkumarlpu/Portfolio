import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import useFetch from '../hooks/useFetch';
import { experienceService } from '../services/experienceService';
import { profileService } from '../services/profileService';

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
      className="relative pl-8 mb-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      {/* Dot — centered on the vertical line at left:0 */}
      <div className="absolute left-0 top-5 -translate-x-1/2 z-10">
        {entry.current && (
          <div className={`absolute inset-0 rounded-full ${dotStyle.ping} animate-ping`} />
        )}
        <div className={`relative w-3 h-3 rounded-full border-2 ${dotStyle.dot} ${dotStyle.shadow}`} />
      </div>

      {/* Card */}
      <div className={`bg-gray-900/60 border border-gray-700/50 border-l-4 ${borderColor} rounded-xl p-4 md:p-5 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(124,58,237,0.1)] transition-all duration-300 group`}>
        {/* Title + Date */}
        <div className="flex items-start justify-between gap-4 mb-1">
          <h4 className="font-bold text-white text-base leading-snug group-hover:text-[#06b6d4] transition-colors">
            {entry.icon && <span className="mr-2">{entry.icon}</span>}
            {entry.title}
          </h4>
          {dateBadge && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 whitespace-nowrap border border-purple-500/30 flex-shrink-0 font-mono font-medium">
              {dateBadge}
            </span>
          )}
        </div>

        {/* Company */}
        <p className="text-purple-400 text-sm font-medium mb-2">
          {entry.company}
          {entry.location && (
            <span className="text-gray-500 font-normal"> | {entry.location}</span>
          )}
        </p>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
          {entry.description}
        </p>

        {/* Type badge */}
        {(entry.type) && (
          <div className="mt-3">
            <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
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
    <div className="mb-4">
      {/* Sub-heading */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-2xl font-bold text-center mb-2 mt-12 font-heading text-white">
          {heading}
        </h3>
        <div className="flex justify-center mb-8">
          <div className="w-12 h-0.5 bg-purple-500 rounded-full" />
        </div>
      </motion.div>

      {/* Timeline wrapper */}
      <div className="relative">
        {/* Vertical line at left:0 */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-purple-500/30" />

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
  const containerRef = useRef(null);
  useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const loading = expLoading || profLoading;

  const rawExp = (allExpData && allExpData.length > 0) ? allExpData : fallbackExperience;
  const rawAchievements = profileData?.achievements?.length > 0 ? profileData.achievements : fallbackAchievements;

  const workEntries = [...rawExp].filter(e => e.type === 'Work').sort((a, b) => parseDateValue(b.startDate) - parseDateValue(a.startDate));
  const trainingEntries = [...rawExp].filter(e => e.type === 'Training').sort((a, b) => parseDateValue(b.startDate) - parseDateValue(a.startDate));
  const educationEntries = [...rawExp].filter(e => e.type === 'Education').sort((a, b) => parseDateValue(b.startDate) - parseDateValue(a.startDate));
  const achievementEntries = [...rawAchievements].map(a => ({ ...a, type: a.type || 'Achievement' })).sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date));

  return (
    <section id="journey" className="py-24 bg-[#050510] transition-colors relative overflow-hidden" ref={containerRef}>
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_10%_20%,rgba(124,58,237,0.05)_0%,rgba(5,5,16,1)_60%)] pointer-events-none z-0" />

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center flex flex-col items-center"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#e2e8f0] mb-4 tracking-tight">
            My Journey
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-full" />
        </motion.div>

        {loading && rawExp === fallbackExperience ? (
          <div className="mt-16 text-center text-[#64748b] animate-pulse">Loading journey data...</div>
        ) : (
          <>
            <TimelineSection heading="Experience" entries={workEntries} />
            <TimelineSection heading="Training" entries={trainingEntries} />
            <TimelineSection heading="Education & Certifications" entries={educationEntries} />
            {achievementEntries.length > 0 && (
              <TimelineSection heading="Achievements" entries={achievementEntries} />
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Journey;
