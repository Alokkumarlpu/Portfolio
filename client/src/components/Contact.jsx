import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';
import useForm from '../hooks/useForm';
import { contactService } from '../services/contactService';
import useFetch from '../hooks/useFetch';
import { profileService } from '../services/profileService';
import { fadeInUp, staggerContainer } from '../hooks/useScrollAnimation';
import MagneticButton from './MagneticButton';
import Tilt from 'react-parallax-tilt';

const Contact = () => {
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: profile } = useFetch(profileService.getProfile);
  const { values, handleChange, reset } = useForm({
    name: '',
    email: '',
    message: ''
  });

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

      {/* Background radial fade overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,5,16,0.5)_0%,rgba(5,5,16,1)_100%)] pointer-events-none z-0" />

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-64 h-64 bg-[#7c3aed]/10 blur-[100px] rounded-full"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#06b6d4]/10 blur-[100px] rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading - Split Text */}
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, amount: 0.2 }}
           className="text-center mb-16 flex flex-col items-center"
        >
          <div className="flex flex-wrap justify-center overflow-hidden">
            {"Get In Touch".split(" ").map((word, i) => (
              <motion.h2 
                key={i}
                variants={{
                  hidden: { y: 60, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 } }
                }}
                className="text-4xl md:text-5xl font-heading font-extrabold text-[#e2e8f0] mb-4 tracking-tight mr-4"
              >
                {word}
              </motion.h2>
            ))}
          </div>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-1.5 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-full drop-shadow-[0_0_8px_rgba(124,58,237,0.6)]"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-[#94a3b8] max-w-2xl mx-auto text-lg"
          >
            I am open to internship and full-stack developer opportunities. Feel free to reach out for collaborations or projects.
          </motion.p>
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

            <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.02} className="pointer-events-auto">
              <motion.div 
                 variants={{
                   hidden: { opacity: 0, x: -50 },
                   visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                 }} 
                 className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl flex items-start space-x-4 border border-white/10 shadow-lg hover:border-[#7c3aed]/50 transition-all duration-300 group hover:translate-x-2"
              >
                <div className="bg-[#7c3aed]/20 p-4 rounded-2xl text-[#7c3aed] group-hover:rotate-[360deg] transition-transform duration-500 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                  <FiMail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1 font-heading">Email</h4>
                  <a href={`mailto:${profile?.email || 'alokkumar985642@gmail.com'}`} className="text-[#94a3b8] hover:text-[#06b6d4] transition-colors break-all font-body">
                    {profile?.email || 'alokkumar985642@gmail.com'}
                  </a>
                </div>
              </motion.div>
            </Tilt>

            <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.02} className="pointer-events-auto">
              <motion.div 
                 variants={{
                   hidden: { opacity: 0, x: -50 },
                   visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.1 } }
                 }} 
                 className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl flex items-start space-x-4 border border-white/10 shadow-lg hover:border-[#06b6d4]/50 transition-all duration-300 group hover:translate-x-2"
              >
                <div className="bg-[#06b6d4]/20 p-4 rounded-2xl text-[#06b6d4] group-hover:rotate-[360deg] transition-transform duration-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <FiPhone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1 font-heading">Phone</h4>
                  <p className="text-[#94a3b8] font-body">
                    {profile?.phone || '+91 7970820876'}
                  </p>
                </div>
              </motion.div>
            </Tilt>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:w-2/3"
          >
            <motion.div 
              animate={status.type === 'error' ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="bg-white/5 backdrop-blur-2xl p-8 md:p-10 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/10 relative overflow-hidden group/form"
            >
              {/* Form Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-[#7c3aed]/20 to-[#06b6d4]/20 rounded-3xl opacity-0 group-hover/form:opacity-100 transition-opacity duration-1000 blur-xl z-0" />

              <form onSubmit={handleSubmit} className="relative z-10">
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-xl mb-6 flex items-center gap-3 backdrop-blur-md border ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}
                  >
                    {status.type === 'success' ? (
                      <motion.span 
                        animate={{ scale: [1, 1.5, 1] }} 
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        ✅
                      </motion.span>
                    ) : '❌'} {status.message}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="group/input">
                    <label htmlFor="name" className="block text-xs font-bold text-[#94a3b8] mb-2 pl-1 uppercase tracking-widest">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-[#0a0a1a]/80 backdrop-blur-sm border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50 focus:border-[#7c3aed] focus:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all text-white placeholder-gray-700 shadow-inner group-hover/input:border-white/20"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="group/input">
                    <label htmlFor="email" className="block text-xs font-bold text-[#94a3b8] mb-2 pl-1 uppercase tracking-widest">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-[#0a0a1a]/80 backdrop-blur-sm border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4] focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all text-white placeholder-gray-700 shadow-inner group-hover/input:border-white/20"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div className="mb-8 group/input">
                  <label htmlFor="message" className="block text-xs font-bold text-[#94a3b8] mb-2 pl-1 uppercase tracking-widest">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={values.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-5 py-4 bg-[#0a0a1a]/80 backdrop-blur-sm border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/50 focus:border-[#7c3aed] focus:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all text-white placeholder-gray-700 resize-none shadow-inner custom-scrollbar group-hover/input:border-white/20"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>
                
                <MagneticButton
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 text-white font-bold rounded-2xl transition-all duration-300 relative overflow-hidden group/btn
                    ${isSubmitting ? 'bg-white/10 text-gray-400 cursor-not-allowed border border-white/5 opacity-50' : 'bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]'}
                  `}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        {/* 3D Cube Spinner */}
                        <div className="w-5 h-5 relative preserve-3d">
                          <motion.div 
                            animate={{ rotateX: [0, 90, 180, 270, 360], rotateY: [0, 90, 180, 270, 360] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute inset-0 border border-white/50"
                          />
                        </div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <>
                        Send Message
                        <FiSend className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </span>
                </MagneticButton>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
