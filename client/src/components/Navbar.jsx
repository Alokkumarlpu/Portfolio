import { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [activeHash, setActiveHash] = useState('');

  useEffect(() => {
    setActiveHash(window.location.hash);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Skills', path: '/#skills' },
    { name: 'Projects', path: '/projects' },
    { name: 'Journey', path: '/#journey' },
    { name: 'Contact', path: '/#contact' },
  ];

  const isActive = (path) => {
    if (path.startsWith('/#')) {
      return activeHash === path.replace('/', '');
    }
    return location.pathname === path && !activeHash;
  };

  return (
    <>
      <style>
        {`
          @keyframes logoGlow {
            0%, 100% { text-shadow: 0 0 10px rgba(124, 58, 237, 0.4); }
            50% { text-shadow: 0 0 25px rgba(124, 58, 237, 0.8), 0 0 40px rgba(6, 182, 212, 0.4); }
          }
          .logo-pulsing {
            animation: logoGlow 3s infinite ease-in-out;
          }
        `}
      </style>
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[9999] bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] origin-left"
        style={{ scaleX }}
      />

      <style>{`
        @keyframes logoBreathe {
          0%, 100% { text-shadow: 0 0 5px rgba(124,58,237,0.2); }
          50% { text-shadow: 0 0 20px rgba(124,58,237,0.6), 0 0 30px rgba(6,182,212,0.4); }
        }
        .logo-breathe {
          animation: logoBreathe 3s infinite ease-in-out;
        }
      `}</style>

      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2 backdrop-blur-xl bg-white/70 dark:bg-[#0a0a1a]/60 shadow-lg' : 'py-4 backdrop-blur-sm bg-white/40 dark:bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-14' : 'h-20'}`}>
            {/* Logo */}
            <div className="flex-shrink-0">
              <NavLink 
                to="/" 
                className="text-2xl md:text-3xl font-heading font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] logo-breathe hover:tracking-[0.05em] transition-all duration-300"
              >
                AK
              </NavLink>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-6">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.path}
                    whileHover={{ x: 4, letterSpacing: '0.05em' }}
                    className="relative group px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-300 tracking-[0.05em]"
                  >
                    {link.name}
                    {/* Underline Slide / Active State */}
                    <div className={`absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] shadow-[0_0_8px_rgba(124,58,237,0.6)] origin-left transition-transform duration-300 ease-out ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                    {isActive(link.path) && (
                      <motion.div 
                        layoutId="navUnderline"
                        className="absolute -bottom-1 left-0 w-full h-1 bg-[#7c3aed] blur-md opacity-20"
                      />
                    )}
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="-mr-2 flex items-center md:hidden z-50">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors z-[60] relative outline-none"
              >
                {isOpen ? <FiX className="w-6 h-6 leading-none block" /> : <FiMenu className="w-6 h-6 leading-none block" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-in Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Dim Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden h-screen w-screen"
                onClick={() => setIsOpen(false)}
              />
              
              {/* Menu Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 w-[82vw] max-w-xs h-screen bg-white/90 dark:bg-[#0a0a1a]/95 backdrop-blur-2xl border-l border-gray-200 dark:border-white/10 z-50 md:hidden flex flex-col pt-24 px-6 shadow-2xl"
              >
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-lg font-heading font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-white/5 hover:text-[#7c3aed] dark:hover:text-[#06b6d4] transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
