import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';
import useFetch from '../hooks/useFetch';
import { profileService } from '../services/profileService';
import Tilt from 'react-parallax-tilt';
import { fadeInUp, staggerContainer } from '../hooks/useScrollAnimation';

const fallbackCertificatesFull = [
  {
    icon: "🤖",
    title: "Generative AI Mastermind",
    issuer: "Out Skill",
    date: "Nov 2025",
    description: "Mastered generative AI concepts including LLMs, prompt engineering, and AI application development.",
    tags: ["AI", "LLM", "Prompt Engineering"],
    link: "#"
  },
  {
    icon: "☁️",
    title: "Cloud Computing",
    issuer: "NPTEL",
    date: "Oct 2025",
    description: "Learned cloud infrastructure, deployment models, virtualization, and cloud service platforms.",
    tags: ["Cloud", "AWS", "DevOps"],
    link: "#"
  }
];

const CertificateCard = ({ cert }) => {
  return (
    <Tilt
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      glareEnable={true}
      glareMaxOpacity={0.15}
      scale={1.02}
      transitionSpeed={400}
      className={`relative group h-full`}
    >
      <div className="h-full relative z-0 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_15px_40px_rgba(124,58,237,0.2)] transition-shadow duration-500">
        <motion.div 
          variants={fadeInUp}
          className={`bg-[#0a0a1a]/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm flex flex-col h-full border border-white/10 transition-all duration-300 relative z-10 group`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Card Hover Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/0 to-[#06b6d4]/0 group-hover:from-[#7c3aed]/10 group-hover:to-[#06b6d4]/10 transition-colors duration-500 z-0 pointer-events-none" />

          {/* Top Banner Area */}
          <div 
            className="relative h-40 overflow-hidden bg-[#050510] border-b border-white/5"
            style={{ transform: 'translateZ(20px)' }}
          >
            <div className="w-full h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.2)_0%,rgba(5,5,16,1)_70%)] text-white/20">
              <span className="text-6xl filter drop-shadow-[0_0_15px_rgba(124,58,237,0.5)] transform group-hover:scale-110 transition-transform duration-500">{cert.icon}</span>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
            
            <div className="absolute top-4 right-4 z-20">
              <span className="text-[10px] font-bold px-3 py-1.5 rounded-full border tracking-wider uppercase bg-[#7c3aed]/20 text-[#7c3aed] border-[#7c3aed]/30 backdrop-blur-md">
                {cert.issuer}
              </span>
            </div>
          </div>
          
          <div className="p-6 flex flex-col flex-grow relative z-10 bg-[#0a0a1a]" style={{ transform: 'translateZ(30px)' }}>
            <h3 className="text-xl font-heading font-bold text-white mb-2 line-clamp-1 group-hover:text-[#06b6d4] transition-colors">
              {cert.title}
            </h3>
            
            <p className="text-xs text-[#64748b] font-medium mb-4 flex items-center gap-1">
              🗓️ Issued {cert.date}
            </p>
            
            <p className="text-[#94a3b8] text-sm mb-6 flex-grow leading-relaxed font-body">
              {cert.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {cert.tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="text-[11px] font-mono font-medium px-2 py-1 text-[#06b6d4] bg-[#06b6d4]/10 border border-[#06b6d4]/20 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <a 
              href={cert.link} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 text-[#e2e8f0] hover:bg-[#7c3aed] hover:border-[#7c3aed] hover:text-white font-medium rounded-lg transition-all duration-300 mt-auto hover:shadow-[0_0_15px_rgba(124,58,237,0.4)]"
            >
              View Credential <FiExternalLink className="ml-2 w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </Tilt>
  );
};

const Certificates = () => {
  const { data: profileData, loading } = useFetch(profileService.getProfile);

  let certificates = fallbackCertificatesFull;
  if (profileData && profileData.certificates && profileData.certificates.length > 0) {
    certificates = profileData.certificates.map(dbCert => {
      const enriched = fallbackCertificatesFull.find(f => f.title === dbCert.title) || {};
      return {
        ...dbCert,
        icon: enriched.icon || "📜",
        description: enriched.description || "Completed certification.",
        tags: enriched.tags || ["Certification"],
        link: enriched.link || "#"
      };
    });
  }

  const SkeletonCard = () => (
    <div className="bg-[#0a0a1a] rounded-2xl overflow-hidden shadow-sm border border-white/5 animate-pulse h-[400px]">
      <div className="h-40 bg-white/5"></div>
      <div className="p-6">
        <div className="h-6 bg-white/5 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-white/5 rounded w-full mb-2"></div>
        <div className="h-4 bg-white/5 rounded w-5/6 mb-6"></div>
        <div className="flex gap-2 mb-6">
          <div className="h-4 bg-white/5 rounded w-16"></div>
          <div className="h-4 bg-white/5 rounded w-16"></div>
        </div>
        <div className="h-10 bg-white/5 rounded w-full mt-auto"></div>
      </div>
    </div>
  );

  return (
    <section id="certificates" className="py-24 bg-[#050510] transition-colors relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
           variants={fadeInUp}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, amount: 0.2 }}
           className="mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#e2e8f0] mb-3 tracking-tight">
                Certificates
              </h2>
              <p className="text-[#64748b] mb-4 text-lg">Courses & Certifications</p>
              <div className="w-24 h-1.5 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-full drop-shadow-[0_0_8px_rgba(124,58,237,0.6)]"></div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr"
          >
            {certificates.map((cert, index) => (
              <CertificateCard key={cert._id || index} cert={cert} />
            ))}
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default Certificates;
