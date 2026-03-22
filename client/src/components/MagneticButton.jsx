import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const MagneticButton = ({ children, className, onClick, href, to, download, type = "button", disabled = false }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);

  const handleMouseMove = (e) => {
    if (!buttonRef.current || disabled) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = buttonRef.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const createRipple = (e) => {
    if (disabled) return;
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    };

    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  const commonProps = {
    ref: buttonRef,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick: createRipple,
    animate: { x: position.x, y: position.y },
    transition: { type: 'spring', stiffness: 200, damping: 20, mass: 0.1 },
    className: `relative inline-flex items-center justify-center font-medium transition-colors duration-300 outline-none overflow-hidden ${className}`
  };

  const content = (
    <>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 0
            }}
          />
        ))}
      </AnimatePresence>
      <div className="relative z-10 flex items-center">
        {children}
      </div>
    </>
  );

  if (to) {
    return (
      <NavLink to={to} className="flex items-center no-underline">
        <motion.div {...commonProps}>{content}</motion.div>
      </NavLink>
    );
  }

  if (href) {
    return (
      <a href={href} target={download ? '_self' : '_blank'} rel="noreferrer" download={download || undefined} className="flex items-center no-underline">
        <motion.div {...commonProps}>{content}</motion.div>
      </a>
    );
  }

  return (
    <motion.button type={type} disabled={disabled} {...commonProps}>
      {content}
    </motion.button>
  );
};

export default MagneticButton;
