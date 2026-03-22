import { motion } from 'framer-motion';
import useFetch from '../hooks/useFetch';
import { profileService } from '../services/profileService';
import Tilt from 'react-parallax-tilt';
import { fadeInUp, staggerContainer, scaleIn } from '../hooks/useScrollAnimation';

const fallbackProfile = {
  about: "Hi! I'm Alok Kumar, a B.Tech Computer Science student at Lovely Professional University, Phagwara. I specialize in full-stack web development using the MERN stack. I have hands-on experience building scalable web apps, REST APIs, and dynamic UIs. I'm passionate about solving real-world problems through clean, efficient code.",
  title: "Full Stack Developer",
  location: "Phagwara, Punjab, India",
  email: "alokkumar985642@gmail.com",
  phone: "+917970820876"
};

const About = () => {
  const { data: profileData, loading: profileLoading } = useFetch(profileService.getProfile);
  const profile = (profileData && profileData.name) ? profileData : fallbackProfile;

  const aboutSentences = profile?.about ? profile.about.split(/(?<=\.)\s+/) : [];

  const quickInfo = [
    { label: "My Title", value: profile.title, icon: "💻" },
    { label: "Location", value: profile.location, icon: "🌍" },
    { label: "Email", value: profile.email, icon: "📧" },
    { label: "Phone", value: profile.phone, icon: "📱" }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#050510]">
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(124,58,237,0.05)_0%,rgba(5,5,16,1)_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading - Split Text Effect */}
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, amount: 0.2 }}
           className="text-center mb-20 flex flex-col items-center"
        >
          <div className="flex flex-wrap justify-center overflow-hidden">
            {"About Me".split(" ").map((word, i) => (
              <motion.h2 
                key={i}
                variants={{
                  hidden: { y: 100, opacity: 0 },
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
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Column - Bio Text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:w-1/2 w-full"
          >
            <motion.h3 
              variants={fadeInUp} 
              className="text-2xl md:text-3xl font-heading font-bold text-[#e2e8f0] mb-8"
            >
              Get to know me!
            </motion.h3>
            
            {profileLoading ? (
               <div className="space-y-4">
                 <div className="h-4 bg-white/10 rounded animate-pulse w-full"></div>
                 <div className="h-4 bg-white/10 rounded animate-pulse w-full"></div>
                 <div className="h-4 bg-white/10 rounded animate-pulse w-5/6"></div>
               </div>
            ) : (
              <div className="space-y-6 text-[#64748b] text-lg leading-relaxed font-body">
                {aboutSentences.map((sentence, idx) => {
                  const words = sentence.split(' ');
                  return (
                    <motion.p 
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { 
                          opacity: 1, 
                          y: 0, 
                          transition: { duration: 0.5, delay: 0.1 * idx } 
                        }
                      }}
                      className="will-change-transform"
                    >
                      {words.map((word, wordIdx) => {
                        const isKeyword = /(MERN stack|full-stack|REST APIs|Computer Science|UI|LPU)/gi.test(word);
                        return (
                          <span key={wordIdx} className="relative inline-block mr-1.5 group">
                            <span className={isKeyword ? "text-[#06b6d4] font-medium" : ""}>
                              {word}
                            </span>
                            {isKeyword && (
                              <motion.span
                                initial={{ width: 0 }}
                                whileInView={{ width: '100%' }}
                                transition={{ duration: 0.8, delay: 1 + idx * 0.1 }}
                                className="absolute bottom-0 left-0 h-[2px] bg-[#7c3aed]/40"
                              />
                            )}
                          </span>
                        );
                      })}
                    </motion.p>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Right Column - 3D Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {quickInfo.map((info, idx) => (
              <Tilt 
                 key={idx}
                 tiltMaxAngleX={15} 
                 tiltMaxAngleY={15} 
                 glareEnable={true}
                 glareMaxOpacity={0.1}
                 scale={1.05}
                 className="h-full"
                 perspective={1000}
              >
                <motion.div 
                   variants={scaleIn}
                   className="h-full bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-[#7c3aed]/50 hover:shadow-[0_0_40px_rgba(124,58,237,0.2)] transition-all duration-500 relative overflow-hidden group will-change-transform"
                >
                  {/* Decorative Gradient Top Border */}
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] opacity-30 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex items-start gap-4 pointer-events-none">
                    <motion.div 
                      whileHover={{ y: -4 }}
                      className="text-3xl filter drop-shadow-[0_0_10px_rgba(124,58,237,0.4)]"
                    >
                      {info.icon}
                    </motion.div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#7c3aed] uppercase tracking-wider mb-2">
                        {info.label}
                      </h4>
                      {profileLoading ? (
                        <div className="h-5 bg-white/10 rounded animate-pulse w-3/4"></div>
                      ) : (
                        <p className="text-[#e2e8f0] font-medium font-heading text-lg break-words">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Tilt>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default About;
