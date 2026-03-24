import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import AdminDashboard from './pages/AdminDashboard';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import Lenis from 'lenis';
import GlobalParticles from './components/GlobalParticles';

const AnimatedRoute = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

const hasAdminToken = () => {
  const userInfoRaw = localStorage.getItem('userInfo');
  if (!userInfoRaw) return false;

  try {
    const parsed = JSON.parse(userInfoRaw);
    return Boolean(parsed?.token);
  } catch {
    return false;
  }
};

const RequireAdminAuth = ({ children }) => {
  if (!hasAdminToken()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const RedirectIfAuthed = ({ children }) => {
  if (hasAdminToken()) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedRoute><Home /></AnimatedRoute>} />
        <Route path="/projects" element={<AnimatedRoute><ProjectsPage /></AnimatedRoute>} />
        <Route
          path="/admin"
          element={
            <AnimatedRoute>
              <RequireAdminAuth>
                <AdminDashboard />
              </RequireAdminAuth>
            </AnimatedRoute>
          }
        />
        <Route
          path="/admin/login"
          element={
            <AnimatedRoute>
              <RedirectIfAuthed>
                <AdminDashboard />
              </RedirectIfAuthed>
            </AnimatedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="bg-[#050510] min-h-screen text-white selection:bg-[#7c3aed]/30 selection:text-white">
      <GlobalParticles />

      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen onComplete={() => setLoading(false)} key="loading" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {!isAdminRoute && <CustomCursor />}
            <ScrollToTop />
            {!isAdminRoute && <Navbar />}
            <main className="relative z-10">
              <AnimatedRoutes />
            </main>
            {!isAdminRoute && <Footer />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
