import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useState, useRef } from 'react';
import useFetch from '../hooks/useFetch';
import { profileService } from '../services/profileService';
import HeroCanvas from './HeroCanvas';
import Tilt from 'react-parallax-tilt';
import { TypeAnimation } from 'react-type-animation';
import { FiArrowRight, FiDownload } from 'react-icons/fi';

const fallbackProfile = {
  name: "Alok Kumar",
  bio: "Passionate Computer Science student at LPU building full-stack web applications with MERN stack. I love turning ideas into real-world products.",
  heroTypingRoles: ["Full Stack Developer", "MERN Stack Developer"],
  resumeUrl: "#"
};

// Custom Magnetic Button
const MagneticButton = ({ children, className, onClick, href, to, download }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = buttonRef.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.2, y: y * 0.2 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const commonProps = {
    ref: buttonRef,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    animate: { x: position.x, y: position.y },
    transition: { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 },
    className: `relative inline-flex items-center justify-center font-medium transition-colors duration-300 outline-none ${className}`
  };

  if (to) {
    return (
      <NavLink to={to} className="outline-none" tabIndex={-1}>
        <motion.div {...commonProps}>{children}</motion.div>
      </NavLink>
    );
  }

  if (href) {
    return (
      <a href={href} target={download ? '_self' : '_blank'} rel="noreferrer" download={download || undefined} className="outline-none" tabIndex={-1}>
        <motion.div {...commonProps}>{children}</motion.div>
      </a>
    );
  }

  return (
    <motion.button onClick={onClick} {...commonProps}>
      {children}
    </motion.button>
  );
};

const Hero = () => {
  const { data: profileData, loading } = useFetch(profileService.getProfile);
  const [imageError, setImageError] = useState(false);

  const profile = (profileData && profileData.name) ? profileData : fallbackProfile;
  const roles = profile?.heroTypingRoles?.length > 0 ? profile.heroTypingRoles : fallbackProfile.heroTypingRoles;

  // Build the sequence array for react-type-animation: [text, delay, text, delay...]
  const typeSequence = roles.flatMap(role => [role, 2000]);

  const nameLetters = profile.name ? profile.name.split('') : [];
  const bioWords = profile.bio ? profile.bio.split(' ') : [];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-[#050510]">
      <HeroCanvas />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex flex-col-reverse md:flex-row items-center justify-between pointer-events-none">

        {/* LEFT COLUMN - TEXT */}
        <div className="md:w-[55%] mt-12 md:mt-0 text-center md:text-left pointer-events-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl md:text-2xl text-[#06b6d4] font-medium mb-3 font-mono tracking-wide"
          >
            Hello I am
          </motion.h2>

          <div className="flex justify-center md:justify-start flex-wrap mb-4 h-auto items-end">
            {nameLetters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
                className="text-5xl md:text-7xl font-heading font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] drop-shadow-[0_0_15px_rgba(124,58,237,0.3)] min-w-[10px]"
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </div>

          {roles.length > 0 && (
            <div className="text-2xl md:text-4xl font-semibold text-gray-300 mb-6 flex flex-wrap items-center justify-center md:justify-start">
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

          <div className="flex flex-wrap justify-center md:justify-start mb-10 max-w-xl">
            {bioWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.03 }}
                className="text-lg text-[#64748b] mr-1.5 mb-1"
              >
                {word}
              </motion.span>
            ))}
          </div>




          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
          >
            <MagneticButton
              to="/projects"
              className="group px-8 py-3.5 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white rounded-full shadow-[0_0_20px_rgba(124,58,237,0.4)] active:translate-y-[2px]"
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
              className="group px-8 py-3.5 bg-transparent border-2 border-[#7c3aed]/50 text-[#e2e8f0] hover:bg-[#7c3aed]/10 hover:border-[#7c3aed] rounded-full flex items-center cursor-pointer"
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
          className="md:w-[45%] flex justify-center mt-10 md:mt-0 pointer-events-auto"
        >
          <Tilt
            tiltMaxAngleX={12}
            tiltMaxAngleY={12}
            glareEnable={true}
            glareMaxOpacity={0.2}
            glareColor="#7c3aed"
            scale={1.05}
            className="relative"
            perspective={1000}
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
                 animation: spin-gradient 4s linear infinite;
                 padding: 4px;
                 border-radius: 50%;
               }
             `}</style>

            <div className="animated-border-avatar relative shadow-[0_0_40px_rgba(124,58,237,0.3)]">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden bg-[#0a0a1a] relative z-10 flex items-center justify-center">
                {(profile?.profileImage && !imageError) ? (
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center text-white text-8xl font-bold font-heading">
                    {profile?.name ? profile.name.charAt(0) : 'A'}
                  </div>
                )}
              </div>

            </div>
          </Tilt>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
      >
        <div className="text-xs text-[#64748b] tracking-widest uppercase mb-2">Scroll to explore</div>
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-[#06b6d4] rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
