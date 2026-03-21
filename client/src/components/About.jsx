import { motion } from 'framer-motion';
import useFetch from '../hooks/useFetch';
import { profileService } from '../services/profileService';
import Tilt from 'react-parallax-tilt';
import { fadeInUp, staggerContainer } from '../hooks/useScrollAnimation';

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
        
        {/* Section Heading */}
        <motion.div
           variants={fadeInUp}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, amount: 0.2 }}
           className="text-center mb-20 flex flex-col items-center"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#e2e8f0] mb-4 tracking-tight">
            About Me
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-full drop-shadow-[0_0_8px_rgba(124,58,237,0.6)]"></div>
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
            <motion.h3 variants={fadeInUp} className="text-2xl md:text-3xl font-heading font-bold text-[#e2e8f0] mb-8">
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
                  // Highlight specific keywords in the text dynamically
                  const highlighted = sentence.replace(
                    /(MERN stack|full-stack|REST APIs|Computer Science|UI)/gi,
                    '<span class="text-[#06b6d4] font-medium drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">$&</span>'
                  );
                  
                  return (
                    <motion.p 
                      key={idx}
                      variants={fadeInUp}
                      dangerouslySetInnerHTML={{ __html: highlighted }}
                    />
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
                 tiltMaxAngleX={8} 
                 tiltMaxAngleY={8} 
                 glareEnable={false}
                 className="h-full"
              >
                <motion.div 
                   variants={fadeInUp}
                   className="h-full bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-[#7c3aed]/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Decorative Gradient Top Border */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="flex items-start gap-4">
                    <div className="text-3xl filter drop-shadow-[0_0_10px_rgba(124,58,237,0.4)]">
                      {info.icon}
                    </div>
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
