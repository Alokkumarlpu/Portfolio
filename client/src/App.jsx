import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import AdminDashboard from './pages/AdminDashboard';
import LoadingScreen from './components/LoadingScreen';

const AnimatedRoute = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedRoute><Home /></AnimatedRoute>} />
        <Route path="/projects" element={<AnimatedRoute><ProjectsPage /></AnimatedRoute>} />
        <Route path="/admin" element={<AnimatedRoute><AdminDashboard /></AnimatedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <div className="min-h-screen flex flex-col relative selection:bg-[#7c3aed]/30 selection:text-[#e2e8f0]">
      <LoadingScreen />
      
      <Navbar />
      <main className="flex-grow w-full custom-noise-filter">
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
