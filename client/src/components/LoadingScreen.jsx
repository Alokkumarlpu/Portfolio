import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check session storage to only show on first visit
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (hasVisited) {
      setIsLoading(false);
      return;
    }

    const duration = 2000;
    const interval = 20;
    let currentProgress = 0;
    
    const timer = setInterval(() => {
      currentProgress += (100 / (duration / interval));
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(timer);
        setTimeout(() => {
          setIsLoading(false);
          sessionStorage.setItem('hasVisited', 'true');
        }, 500); 
      }
      setProgress(currentProgress);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const nameLetters = "Alok Kumar".split('');

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#050510]"
        >
          {/* Logo / Name */}
          <div className="flex items-center space-x-2 text-4xl md:text-6xl font-heading font-bold text-white mb-12">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-[#7c3aed] mr-4 drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]"
            >
              AK
            </motion.div>
            <div className="flex">
              {nameLetters.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.1, delay: 0.5 + i * 0.05 }}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]"
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="w-64 max-w-[80vw] h-1 bg-white/10 rounded-full overflow-hidden absolute bottom-20">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]"
              style={{ width: `${progress}%` }}
              layout
            />
          </div>
          <div className="absolute bottom-12 text-gray-500 font-mono text-sm tracking-widest">
            {Math.round(progress)}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
