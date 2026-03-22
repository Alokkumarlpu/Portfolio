import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Mouse Position with MotionValues for high performance
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Trail Points (Lerp targets)
  // We'll use 6 ghost dots
  const trailCount = 6;
  const trailPositions = Array.from({ length: trailCount }).map(() => ({
    x: useMotionValue(-100),
    y: useMotionValue(-100),
  }));

  // Springs for smoother ring movement
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if device is mobile/touch
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const handleHoverStart = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        target.style.cursor === 'pointer'
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleHoverStart);

    // RAFLOOP for Trail Lerping
    let rafId;
    const animateTrail = () => {
      // Each ghost dot follows the one before it with a small lerp
      let prevX = mouseX.get();
      let prevY = mouseY.get();

      trailPositions.forEach((pos) => {
        const currentX = pos.x.get();
        const currentY = pos.y.get();
        
        pos.x.set(currentX + (prevX - currentX) * 0.15);
        pos.y.set(currentY + (prevY - currentY) * 0.15);
        
        prevX = pos.x.get();
        prevY = pos.y.get();
      });

      rafId = requestAnimationFrame(animateTrail);
    };
    rafId = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleHoverStart);
      cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY, trailPositions]);

  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden">
      {/* Ghost Trail */}
      {trailPositions.map((pos, index) => (
        <motion.div
          key={index}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{
            x: pos.x,
            y: pos.y,
            left: -4,
            top: -4,
            opacity: 0.8 / (index + 2),
            backgroundColor: hovered ? '#06b6d4' : '#7c3aed',
            scale: 1 - index * 0.1,
          }}
        />
      ))}

      {/* Outer Ring */}
      <motion.div
        className="absolute w-10 h-10 rounded-full border shadow-[0_0_10px_rgba(124,58,237,0.3)] pointer-events-none"
        style={{
          x: ringX,
          y: ringY,
          left: -20,
          top: -20,
          borderColor: hovered ? 'rgba(6,182,212,0.5)' : 'rgba(124,58,237,0.5)',
        }}
        animate={{
          scale: clicked ? 0.9 : (hovered ? 1.5 : 1),
          backgroundColor: hovered ? 'rgba(6,182,212,0.1)' : 'rgba(124,58,237,0)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      />
      
      {/* Inner Dot */}
      <motion.div
        className="absolute w-2 h-2 rounded-full pointer-events-none z-10"
        style={{
          x: mouseX,
          y: mouseY,
          left: -4,
          top: -4,
          backgroundColor: hovered ? '#06b6d4' : '#7c3aed',
          boxShadow: hovered ? '0 0 15px #06b6d4' : '0 0 15px #7c3aed',
        }}
        animate={{
          scale: clicked ? 0.6 : (hovered ? 3 : 1),
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      />
    </div>
  );
};

export default CustomCursor;
