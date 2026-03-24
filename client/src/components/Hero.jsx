import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import { profileService } from '../services/profileService';
import HeroCanvas from './HeroCanvas';
import Tilt from 'react-parallax-tilt';
import { TypeAnimation } from 'react-type-animation';
import { FiArrowRight, FiDownload } from 'react-icons/fi';
import MagneticButton from './MagneticButton';


const fallbackProfile = {
  name: "Alok Kumar",
  bio: "Passionate Computer Science student at LPU building full-stack web applications with MERN stack. I love turning ideas into real-world products.",
  heroTypingRoles: ["Full Stack Developer", "MERN Stack Developer"],
  resumeUrl: "#"
};

// Text Scramble Hook
const useTextScramble = (text, duration = 1.5) => {
  const [scrambled, setScrambled] = useState('');
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  
  useEffect(() => {
    let frame = 0;
    const totalFrames = duration * 60;
    const interval = setInterval(() => {
      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (frame / totalFrames > i / text.length) {
          result += text[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setScrambled(result);
      frame++;
      if (frame > totalFrames) clearInterval(interval);
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [text, duration]);
  
  return scrambled;
};

const Hero = () => {
  const { data: profileData, loading } = useFetch(profileService.getProfile);
  const [imageError, setImageError] = useState(false);

  const profile = (profileData && profileData.name) ? profileData : fallbackProfile;
  const roles = profile?.heroTypingRoles?.length > 0 ? profile.heroTypingRoles : fallbackProfile.heroTypingRoles;
  const typeSequence = roles.flatMap(role => [role, 2000]);

  const nameLetters = (profile.name || "Alok Kumar").split('');
  const bioWords = (profile.bio || "").split(' ');
  const scrambledHello = useTextScramble('Hello I am', 1.5);



  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-14 overflow-hidden bg-[#050510]">
      <HeroCanvas />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex flex-col-reverse md:flex-row items-center justify-between pointer-events-none gap-8 md:gap-0">

        {/* LEFT COLUMN - TEXT */}
        <div className="md:w-[55%] mt-12 md:mt-0 text-center md:text-left pointer-events-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg md:text-2xl text-[#06b6d4] font-medium mb-3 font-mono tracking-wide min-h-8"
          >
            {scrambledHello}
          </motion.div>

          <div className="flex justify-center md:justify-start flex-wrap mb-4 h-auto items-end perspective-1000">
            {nameLetters.map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                initial={{ opacity: 0, y: 60, rotateX: 90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  delay: i * 0.04,
                  duration: 0.6,
                  type: 'spring',
                  stiffness: 100
                }}
                className="text-4xl sm:text-5xl md:text-7xl font-heading font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] drop-shadow-[0_0_15px_rgba(124,58,237,0.3)] leading-[1.1]"
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </div>

          {roles.length > 0 && (
            <div className="text-xl sm:text-2xl md:text-4xl font-semibold text-gray-300 mb-6 flex flex-wrap items-center justify-center md:justify-start">
              <span className="mr-2">A</span>
              <TypeAnimation
                sequence={typeSequence}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-[#7c3aed] drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]"
              />
            </div>
          )}

          <div className="flex flex-wrap justify-center md:justify-start mb-10 max-w-xl mx-auto md:mx-0">
            {bioWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.03 }}
                className="text-base md:text-lg text-[#64748b] mr-1.5 mb-1"
              >
                {word}
              </motion.span>
            ))}
          </div>


          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-4 w-full sm:w-auto"
          >
            <MagneticButton
              to="/projects"
              className="group w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white rounded-full shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95 transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] animate-pulse"
            >
              <span>View Projects</span>
              <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>

            <MagneticButton
              onClick={async () => {
                const url = profile?.resumeUrl && profile.resumeUrl !== '#' ? profile.resumeUrl : '/resume.pdf';
                try {
                  const response = await fetch(url);
                  const blob = await response.blob();
                  const pdfBlob = new Blob([blob], { type: 'application/pdf' });
                  const blobUrl = window.URL.createObjectURL(pdfBlob);
                  const link = document.createElement('a');
                  link.href = blobUrl;
                  link.download = 'Alok_Kumar_Resume.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(blobUrl);
                } catch {
                  window.open(url, '_blank');
                }
              }}
              className="group w-full sm:w-auto px-8 py-3.5 bg-transparent border-2 border-[#7c3aed]/50 text-[#e2e8f0] hover:bg-[#7c3aed]/10 hover:border-[#7c3aed] rounded-full flex items-center justify-center cursor-pointer transition-all"
            >
              <span>Download Resume</span>
              <FiDownload className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </MagneticButton>
          </motion.div>
        </div>

        {/* RIGHT COLUMN - AVATAR */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="md:w-[45%] flex justify-center mt-2 md:mt-0 pointer-events-auto"
        >
          <Tilt
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            glareEnable={true}
            glareMaxOpacity={0.2}
            glareColor="#7c3aed"
            scale={1.05}
            className="relative"
            perspective={1000}
            onMove={(e) => {
              // Add a subtle rotation on top of tilt for 3D depth
            }}
          >
            <style>{`
               @keyframes spin-gradient {
                 0% { --gradient-angle: 0deg; }
                 100% { --gradient-angle: 360deg; }
               }
               @property --gradient-angle {
                 syntax: "<angle>";
                 initial-value: 0deg;
                 inherits: false;
               }
               .animated-border-avatar {
                 background: conic-gradient(from var(--gradient-angle), #7c3aed, #06b6d4, #7c3aed);
                 animation: spin-gradient 3s linear infinite;
                 padding: 4px;
                 border-radius: 50%;
               }
             `}</style>

            <div className="animated-border-avatar relative shadow-[0_0_40px_rgba(124,58,237,0.3)] group">
              <div className="w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full overflow-hidden bg-[#0a0a1a] relative z-10 flex items-center justify-center">
                {(profile?.profileImage && !imageError) ? (
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center text-white text-6xl sm:text-8xl font-bold font-heading">
                    {profile?.name ? profile.name.charAt(0) : 'A'}
                  </div>
                )}
              </div>

            </div>
          </Tilt>
        </motion.div>
      </div>

      {/* Scroll indicator - Mouse SVG */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        whileHover={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center pointer-events-none"
      >
        <div className="w-6 h-10 border-2 border-[#7c3aed]/40 rounded-full flex justify-center p-1 relative">
          <motion.div
            animate={{ 
              y: [0, 16, 0],
              opacity: [1, 0, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }}
            className="w-1.5 h-3 bg-[#06b6d4] rounded-full"
          />
        </div>
        <motion.div 
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-2"
        >
          <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L10 8L18 2" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
