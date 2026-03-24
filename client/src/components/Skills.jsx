import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useFetch from '../hooks/useFetch';
import { skillService } from '../services/skillService';
import Tilt from 'react-parallax-tilt';
import { fadeInUp, staggerContainer } from '../hooks/useScrollAnimation';

import { 
  SiReact, SiJavascript, SiHtml5, SiCss,
  SiTailwindcss, SiNodedotjs, SiExpress,
  SiPython, SiDjango, SiPhp,
  SiMongodb, SiMysql,
  SiGit, SiGithub, SiDocker, SiPostman,
  SiCplusplus
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { BsCodeSquare } from 'react-icons/bs';

const skillIconMap = {
  'JavaScript':   { icon: SiJavascript,  color: '#F7DF1E' },
  'Python':       { icon: SiPython,      color: '#3776AB' },
  'Java':         { icon: FaJava,        color: '#ED8B00' },
  'C++':          { icon: SiCplusplus,   color: '#00599C' },
  'PHP':          { icon: SiPhp,         color: '#777BB4' },
  'React.js':     { icon: SiReact,       color: '#61DAFB' },
  'HTML':         { icon: SiHtml5,       color: '#E34F26' },
  'CSS':          { icon: SiCss,         color: '#1572B6' },
  'Tailwind CSS': { icon: SiTailwindcss, color: '#06B6D4' },
  'Node.js':      { icon: SiNodedotjs,   color: '#339933' },
  'Express.js':   { icon: SiExpress,     color: '#FFFFFF' },
  'Django':       { icon: SiDjango,      color: '#44B78B' },
  'MongoDB':      { icon: SiMongodb,     color: '#47A248' },
  'MySQL':        { icon: SiMysql,       color: '#4479A1' },
  'Git':          { icon: SiGit,         color: '#F05032' },
  'GitHub':       { icon: SiGithub,      color: '#FFFFFF' },
  'Docker':       { icon: SiDocker,      color: '#2496ED' },
  'Postman':      { icon: SiPostman,     color: '#FF6C37' },
};

const hardcodedCategories = [
  { name: 'Languages', emoji: '💻', skills: ['JavaScript','Python','Java','C++','PHP'] },
  { name: 'Frontend', emoji: '🎨', skills: ['React.js','HTML','CSS','Tailwind CSS'] },
  { name: 'Backend', emoji: '⚙️', skills: ['Node.js','Express.js','Django'] },
  { name: 'Database', emoji: '🗄️', skills: ['MongoDB','MySQL'] },
  { name: 'Tools', emoji: '🛠️', skills: ['Git','GitHub','Docker','Postman'] },
];

const categoryStyles = {
  'Languages': 'from-[#7c3aed] to-purple-400',
  'Frontend': 'from-[#06b6d4] to-cyan-400',
  'Backend': 'from-green-400 to-emerald-500',
  'Database': 'from-[#f59e0b] to-amber-400',
  'Tools': 'from-red-500 to-rose-400',
};

const SkillItem = ({ skillName, index, parentHovered }) => {
  const [isHovered, setIsHovered] = useState(false);
  const mapping = skillIconMap[skillName] || { icon: BsCodeSquare, color: '#9CA3AF' };
  const IconComponent = mapping.icon;

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0, transition: { delay: index * 0.05 } }
      }}
      animate={parentHovered ? { y: [0, -6, 0] } : { y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: "easeInOut" }}
      className="flex items-center gap-3 p-2 cursor-pointer transition-all duration-300 group rounded-lg hover:bg-white/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <IconComponent 
        className={`text-2xl transition-all duration-300 transform ${isHovered ? 'scale-125' : ''}`}
        style={{ 
          color: mapping.color,
          filter: isHovered ? `drop-shadow(0 0 12px ${mapping.color})` : 'none',
          willChange: 'transform, filter'
        }}
      />
      <span className="text-sm text-gray-400 font-medium group-hover:text-white transition-colors duration-300">
        {skillName}
      </span>
    </motion.div>
  );
}

const CategoryCard = ({ category, catIdx }) => {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const borderGradient = categoryStyles[category.name] || 'from-gray-500 to-gray-400';

  return (
    <Tilt 
      tiltMaxAngleX={8} 
      tiltMaxAngleY={8} 
      glareEnable={true} 
      glareMaxOpacity={0.06}
      scale={1.02}
      perspective={1200}
      onEnter={() => setIsCardHovered(true)}
      onLeave={() => setIsCardHovered(false)}
      className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] group/tilt"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 80 },
          visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.8, ease: "easeOut", delay: catIdx * 0.15 } 
          }
        }}
        className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 hover:border-[#7c3aed]/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 relative overflow-hidden will-change-transform"
      >
        {/* Gradient Top Border */}
        <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${borderGradient}`} />
        
        {/* Decorative background glow on hover */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${borderGradient} opacity-0 group-hover/tilt:opacity-20 blur-3xl transition-opacity duration-700 rounded-full`} />

        {/* Card Header */}
        <motion.div 
          whileInView={{ textShadow: ["0 0 0px transparent", "0 0 20px rgba(124,58,237,0.5)", "0 0 0px transparent"] }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="flex flex-col items-center text-center mb-6 pointer-events-none"
        >
          <div className="text-5xl mb-4 transform group-hover/tilt:scale-125 group-hover/tilt:rotate-12 transition-all duration-500 drop-shadow-xl">{category.emoji}</div>
          <h3 className={`text-2xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r ${borderGradient}`}>
            {category.name}
          </h3>
        </motion.div>
        
        {/* Skills Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 relative z-10 w-full">
          {category.skills.map((skillName, i) => (
            <SkillItem key={skillName} skillName={skillName} index={i} parentHovered={isCardHovered} />
          ))}
        </div>
      </motion.div>
    </Tilt>
  );
};

const Skills = () => {
  const { data: apiSkills, loading } = useFetch(skillService.getAllSkills);

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-[#050510]">
      {/* Background radial fade */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.05)_0%,rgba(5,5,16,1)_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading - Split Text Effect */}
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, amount: 0.2 }}
           className="text-center mb-20 flex flex-col items-center"
        >
          <div className="flex flex-wrap justify-center overflow-hidden">
            {"My Skills".split(" ").map((word, i) => (
              <motion.h2 
                key={i}
                variants={{
                  hidden: { y: 80, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 } }
                }}
                className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[#e2e8f0] mb-4 tracking-tight mr-3 last:mr-0"
              >
                {word}
              </motion.h2>
            ))}
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[#64748b] font-medium mb-6"
          >
            Technologies I work with
          </motion.p>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-24 h-1.5 bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] rounded-full drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
          ></motion.div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center mt-16 text-[#64748b] animate-pulse">Loading skills data...</div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {hardcodedCategories.map((category, catIdx) => (
              <CategoryCard key={category.name} category={category} catIdx={catIdx} />
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default Skills;
