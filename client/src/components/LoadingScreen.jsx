import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShow(true);
      sessionStorage.setItem('hasVisited', 'true');
    } else {
      if (onComplete) onComplete();
    }

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setShow(false);
            if (onComplete) onComplete();
          }, 500);
          return 100;
        }
        return oldProgress + 1;
      });
    }, 20);

    return () => clearInterval(timer);
  }, [onComplete]);

  const name = "ALOK KUMAR";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[10000] bg-[#050510] flex flex-col items-center justify-center p-4 overflow-hidden"
        >
          {/* Central Logo */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-dashed border-[#7c3aed]/40 flex items-center justify-center mb-12 relative"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl md:text-5xl font-heading font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]"
            >
              AK
            </motion.span>
            
            {/* Spinning Glow Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[#06b6d4] opacity-20 shadow-[0_0_30px_rgba(6,182,212,0.4)]" />
          </motion.div>

          {/* Name Reveal */}
          <div className="flex mb-8">
            {name.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className={`text-2xl md:text-3xl font-heading font-bold tracking-widest text-[#e2e8f0] ${char === ' ' ? 'mr-4' : ''}`}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>

          {/* Loading Bar Container */}
          <div className="w-64 md:w-80 h-1 bg-white/5 rounded-full overflow-hidden relative mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] shadow-[0_0_15px_rgba(124,58,237,0.8)]"
            />
          </div>

          {/* Percentage */}
          <motion.span 
            className="text-sm font-mono text-[#64748b] tracking-[0.2em]"
          >
            {progress}%
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
