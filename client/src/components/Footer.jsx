import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import useFetch from '../hooks/useFetch';
import { profileService } from '../services/profileService';
import { fadeInUp } from '../hooks/useScrollAnimation';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { data: profile } = useFetch(profileService.getProfile);

  const socialLinks = [
    { name: "GitHub", icon: FiGithub, url: profile?.socialLinks?.github || "https://github.com/Alokkumarlpu", color: "hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] bg-white/5 border-white/10" },
    { name: "LinkedIn", icon: FiLinkedin, url: profile?.socialLinks?.linkedin || "https://linkedin.com/in/alok7970", color: "hover:text-[#06b6d4] hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] bg-[#06b6d4]/5 border-[#06b6d4]/10" },
    { name: "Email", icon: FiMail, url: `mailto:${profile?.email || 'alokkumar985642@gmail.com'}`, color: "hover:text-[#7c3aed] hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] bg-[#7c3aed]/5 border-[#7c3aed]/10" }
  ];

  return (
    <footer className="bg-[#050510] border-t border-white/10 py-12 relative overflow-hidden z-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,rgba(124,58,237,0.1)_0%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
        
        <motion.div
           variants={fadeInUp}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           className="text-3xl font-heading font-extrabold mb-8 text-center"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] drop-shadow-[0_0_10px_rgba(124,58,237,0.3)]">
            {profile?.name || 'Alok Kumar'}
          </span>
          <span className="text-[#e2e8f0]"> Portfolio</span>
        </motion.div>
        
        <div className="flex space-x-6 mb-10">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a 
                key={index}
                href={social.url} 
                target="_blank" 
                rel="noreferrer" 
                initial={{ y: 0 }}
                animate={{ y: [-5, 5] }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  duration: 2, 
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
                className={`p-3 rounded-full border text-[#94a3b8] transition-all duration-300 transform hover:scale-110 backdrop-blur-sm ${social.color}`}
              >
                <span className="sr-only">{social.name}</span>
                <Icon className="w-6 h-6" />
              </motion.a>
            );
          })}
        </div>
        
        <motion.p 
          variants={fadeInUp}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           className="text-sm text-[#64748b] text-center font-body"
        >
          &copy; {currentYear} {profile?.name || 'Alok Kumar'}. All Rights Reserved.<br />
          <span className="mt-2 inline-block">Built with React, Framer Motion, Tailwind & Three.js</span>
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;
