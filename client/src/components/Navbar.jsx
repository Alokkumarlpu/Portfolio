import { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [activeHash, setActiveHash] = useState('');

  useEffect(() => {
    setActiveHash(window.location.hash);
  }, [location]);

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
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] drop-shadow-[0_0_8px_rgba(124,58,237,0.5)] origin-left"
        style={{ scaleX }}
      />

      <nav className="fixed w-full top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-[#0a0a1a]/40 border-b border-gray-200 dark:border-white/5 transition-colors duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <NavLink 
                to="/" 
                className="text-2xl md:text-3xl font-heading font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] drop-shadow-[0_0_15px_rgba(124,58,237,0.4)]"
              >
                Alok Kumar
              </NavLink>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.path}
                    className="relative group px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-300"
                    style={{ perspective: '500px' }}
                  >
                    <div className="group-hover:-rotate-x-[8deg] group-hover:text-[#7c3aed] transition-transform duration-300 ease-out transform-gpu origin-bottom">
                      {link.name}
                    </div>
                    {/* Underline Slide / Active State */}
                    <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#7c3aed] drop-shadow-[0_0_8px_rgba(124,58,237,0.6)] origin-left transition-transform duration-300 ease-out ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                  </a>
                ))}
                
                <motion.button
                  whileTap={{ rotateY: 360, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  onClick={toggleTheme}
                  className="p-2 ml-4 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-[#06b6d4] hover:border-[#06b6d4] transition-all duration-300 shadow-sm outline-none"
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? <FiSun className="w-5 h-5 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" /> : <FiMoon className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="-mr-2 flex items-center md:hidden z-50">
              <motion.button
                whileTap={{ rotateY: 360, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                onClick={toggleTheme}
                className="p-2 mr-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 transition-all shadow-sm outline-none"
              >
                {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </motion.button>
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
                className="fixed top-0 right-0 w-64 h-screen bg-white/90 dark:bg-[#0a0a1a]/95 backdrop-blur-2xl border-l border-gray-200 dark:border-white/10 z-50 md:hidden flex flex-col pt-24 px-6 shadow-2xl"
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
