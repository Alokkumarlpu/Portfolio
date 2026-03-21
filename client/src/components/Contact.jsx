import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';
import useForm from '../hooks/useForm';
import { contactService } from '../services/contactService';
import useFetch from '../hooks/useFetch';
import { profileService } from '../services/profileService';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { fadeInUp, staggerContainer } from '../hooks/useScrollAnimation';

const Contact = () => {
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [init, setInit] = useState(false);
  const { data: profile } = useFetch(profileService.getProfile);

  const { values, handleChange, reset } = useForm({
    name: '',
    email: '',
    message: ''
  });

  // Initialize tsparticles
  useState(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = useMemo(() => ({
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
      },
    },
    particles: {
      color: { value: ["#7c3aed", "#06b6d4"] },
      links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.1, width: 1 },
      move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 1, straight: false },
      number: { density: { enable: true, area: 800 }, value: 30 },
      opacity: { value: 0.3 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  }), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await contactService.submitContact(values);
      setStatus({ type: 'success', message: 'Message sent successfully! I will get back to you soon.' });
      reset();
      setTimeout(() => setStatus({ type: '', message: '' }), 5000);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#050510] transition-colors relative overflow-hidden">
      {/* tsParticles Background */}
      {init && (
        <Particles id="tsparticles" options={particlesOptions} className="absolute inset-0 z-0 pointer-events-auto" />
      )}

      {/* Background radial fade overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,5,16,0.5)_0%,rgba(5,5,16,1)_100%)] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#e2e8f0] mb-4 tracking-tight">
            Get In Touch
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-full drop-shadow-[0_0_8px_rgba(124,58,237,0.6)]"></div>
          <p className="mt-6 text-[#94a3b8] max-w-2xl mx-auto text-lg">
            I am open to internship and full-stack developer opportunities. Feel free to reach out for collaborations or projects.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">

          {/* Left Column: Contact Info & Illustration */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:w-1/3 flex flex-col gap-6"
          >
            {/* SVG Abstract Illustration */}
            <motion.div variants={fadeInUp} className="hidden lg:flex justify-center items-center mb-6 h-48 relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute w-32 h-32 rounded-full border border-dashed border-[#7c3aed]/40"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                className="absolute w-24 h-24 rounded-full border border-[#06b6d4]/40"
              />
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-16 h-16 bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] rounded-2xl rotate-45 shadow-[0_0_30px_rgba(124,58,237,0.5)] flex items-center justify-center"
              >
                <FiMail className="w-6 h-6 text-white -rotate-45" />
              </motion.div>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl flex items-start space-x-4 border border-white/10 shadow-lg hover:border-[#7c3aed]/50 transition-colors group">
              <div className="bg-[#7c3aed]/20 p-3 rounded-xl text-[#7c3aed] group-hover:scale-110 transition-transform">
                <FiMail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Email</h4>
                <a href={`mailto:${profile?.email || 'alokkumar985642@gmail.com'}`} className="text-[#94a3b8] hover:text-[#06b6d4] transition-colors break-all">
                  {profile?.email || 'alokkumar985642@gmail.com'}
                </a>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl flex items-start space-x-4 border border-white/10 shadow-lg hover:border-[#06b6d4]/50 transition-colors group">
              <div className="bg-[#06b6d4]/20 p-3 rounded-xl text-[#06b6d4] group-hover:scale-110 transition-transform">
                <FiPhone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">Phone</h4>
                <p className="text-[#94a3b8]">
                  {profile?.phone || '+91 7970820876'}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:w-2/3"
          >
            <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/10 relative overflow-hidden group/form">

              {/* Form Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-[#7c3aed]/20 to-[#06b6d4]/20 rounded-3xl opacity-0 group-hover/form:opacity-100 transition-opacity duration-1000 blur-xl z-0" />

              <div className="relative z-10">
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl mb-6 flex items-center gap-3 backdrop-blur-md border ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}
                  >
                    {status.message}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#94a3b8] mb-2 pl-1">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 bg-[#0a0a1a]/80 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50 focus:border-[#7c3aed] transition-all text-white placeholder-gray-600 shadow-inner"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#94a3b8] mb-2 pl-1">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3.5 bg-[#0a0a1a]/80 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] transition-all text-white placeholder-gray-600 shadow-inner"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="mb-8">
                  <label htmlFor="message" className="block text-sm font-medium text-[#94a3b8] mb-2 pl-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={values.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-5 py-3.5 bg-[#0a0a1a]/80 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50 focus:border-[#7c3aed] transition-all text-white placeholder-gray-600 resize-none shadow-inner custom-scrollbar"
                    placeholder="How can I help you?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden group/btn outline-none
                    ${isSubmitting ? 'bg-white/10 text-gray-400 cursor-not-allowed border border-white/5' : 'bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:scale-[1.02]'}
                  `}
                >
                  <span className="relative z-10">{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  {!isSubmitting && <FiSend className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform relative z-10" />}

                  {/* Button shine effect */}
                  {!isSubmitting && (
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover/btn:animate-shine" />
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
