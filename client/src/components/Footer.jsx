import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import useFetch from '../hooks/useFetch';
import { profileService } from '../services/profileService';
import { fadeInUp } from '../hooks/useScrollAnimation';
import { useState, useEffect } from 'react';
import { FiChevronUp } from 'react-icons/fi';
import MagneticButton from './MagneticButton';
import Tilt from 'react-parallax-tilt';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { data: profile } = useFetch(profileService.getProfile);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(progress);
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { name: "GitHub", icon: FiGithub, url: profile?.socialLinks?.github || "https://github.com/Alokkumarlpu", color: "hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] bg-white/5 border-white/10" },
    { name: "LinkedIn", icon: FiLinkedin, url: profile?.socialLinks?.linkedin || "https://linkedin.com/in/alok7970", color: "hover:text-[#06b6d4] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] bg-[#06b6d4]/5 border-[#06b6d4]/10" },
    { name: "Email", icon: FiMail, url: `mailto:${profile?.email || 'alokkumar985642@gmail.com'}`, color: "hover:text-[#7c3aed] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] bg-[#7c3aed]/5 border-[#7c3aed]/10" }
  ];

  return (
    <footer className="bg-[#050510] border-t border-white/5 py-16 relative overflow-hidden z-20">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/50 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,rgba(124,58,237,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
        
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="text-3xl font-heading font-extrabold mb-8 text-center"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] drop-shadow-[0_0_15px_rgba(124,58,237,0.4)]">
            {profile?.name || 'Alok Kumar'}
          </span>
          <span className="text-white/90 font-heading"> Portfolio</span>
        </motion.div>
        
        <div className="flex space-x-6 mb-12">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <MagneticButton 
                key={index}
                href={social.url} 
                className={`p-4 rounded-2xl border text-[#94a3b8] transition-all duration-300 backdrop-blur-md flex items-center justify-center relative overflow-hidden group/social ${social.color}`}
              >
                <motion.div
                  initial={false}
                  whileTap={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-white/20 rounded-full scale-0"
                />
                <span className="sr-only">{social.name}</span>
                <Icon className="w-6 h-6 relative z-10" />
              </MagneticButton>
            );
          })}
        </div>
        
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.3 }}
           className="text-center"
        >
          <p className="text-sm text-[#64748b] font-medium tracking-wide">
            &copy; {currentYear} {profile?.name || 'Alok Kumar'}. All Rights Reserved.
          </p>
          <p className="text-[10px] text-[#64748b]/60 mt-2 uppercase tracking-[0.2em] font-mono">
            Built with <span className="text-[#06b6d4]">React</span> &bull; <span className="text-[#7c3aed]">Three.js</span> &bull; <span className="text-[#06b6d4]">GSAP</span>
          </p>
        </motion.div>
      </div>

      {/* Back to Top Button with Progress */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="fixed bottom-8 right-8 z-50 pointer-events-auto"
          >
            <Tilt tiltMaxAngleX={20} tiltMaxAngleY={20} scale={1.1} perspective={1000}>
              <button
                onClick={scrollToTop}
                className="w-14 h-14 bg-[#0a0a1a] text-white rounded-full shadow-[0_0_20px_rgba(124,58,237,0.5)] active:scale-95 border border-white/10 flex items-center justify-center relative overflow-hidden group"
              >
                {/* Circular Progress SVG */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                  <circle
                    cx="28"
                    cy="28"
                    r="25"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray="157"
                    strokeDashoffset={157 - (157 * scrollProgress) / 100}
                    className="text-[#7c3aed] transition-all duration-100 ease-out"
                  />
                </svg>
                <FiChevronUp className="w-6 h-6 relative z-10 group-hover:-translate-y-1 transition-transform" />
              </button>
            </Tilt>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
