import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';
import useFetch from '../hooks/useFetch';
import { certificateService } from '../services/certificateService';
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
    link: "https://drive.google.com/file/d/1gCZXxcX2GfDjZOCzecbWTJS7ps0ecIoz/view",
    imageUrl: "https://drive.google.com/thumbnail?id=1gCZXxcX2GfDjZOCzecbWTJS7ps0ecIoz&sz=w1000"
  },
  {
    icon: "☁️",
    title: "Cloud Computing",
    issuer: "NPTEL",
    date: "Oct 2025",
    description: "Learned cloud infrastructure, deployment models, virtualization, and cloud service platforms.",
    tags: ["Cloud", "AWS", "DevOps"],
    link: "https://drive.google.com/file/d/1p6CnWkmu5tx3G80gVzN1qbgidfTpGWYo/view",
    imageUrl: "https://drive.google.com/thumbnail?id=1p6CnWkmu5tx3G80gVzN1qbgidfTpGWYo&sz=w1000"
  }
];

const CertificateCard = ({ cert }) => {
  return (
    <Tilt
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      glareEnable={true}
      glareMaxOpacity={0.15}
      scale={1.03}
      transitionSpeed={1000}
      className={`relative group h-full`}
      perspective={1200}
    >
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={{
          hidden: { opacity: 0, y: 60 },
          visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.6, ease: 'easeOut' } 
          }
        }}
        className="h-full relative z-0 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_20px_60px_rgba(124,58,237,0.2)] group-hover:-translate-y-2 transition-all duration-500 bg-[#0a0a1a]/95 backdrop-blur-xl border border-white/10 hover:border-[#7c3aed]/50 overflow-hidden flex flex-col will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Hover Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/0 to-[#06b6d4]/0 group-hover:from-[#7c3aed]/10 group-hover:to-[#06b6d4]/10 transition-colors duration-500 z-0 pointer-events-none" />

        {/* Top Banner Area */}
        <div 
          className="relative h-48 overflow-hidden bg-[#050510] border-b border-white/5"
          style={{ transform: 'translateZ(25px)' }}
        >
          {/* Background Icon/Glow */}
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15)_0%,rgba(5,5,16,1)_80%)] text-white/10 z-0">
            <span className="text-7xl filter drop-shadow-[0_0_20px_rgba(124,58,237,0.4)] transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
              {cert.icon || "📜"}
            </span>
          </div>

          {cert.imageUrl && (
            <img 
              src={cert.imageUrl} 
              alt={cert.title} 
              className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-115 transition-transform duration-1000 opacity-90 group-hover:opacity-100 z-10 will-change-transform"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-transparent opacity-70 z-20" />
          
          <div className="absolute top-4 right-4 z-30">
            <span className="text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 tracking-wider uppercase backdrop-blur-md group-hover:border-[#7c3aed]/50 group-hover:bg-[#7c3aed]/20 group-hover:text-white transition-all duration-300">
              {cert.issuer}
            </span>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-grow relative z-10 bg-[#0a0a1a]" style={{ transform: 'translateZ(35px)' }}>
          <h3 className="text-xl font-heading font-bold text-white mb-2 line-clamp-1 group-hover:text-[#06b6d4] transition-colors duration-300">
            {cert.title}
          </h3>
          
          <p className="text-[11px] text-[#64748b] font-bold mb-4 flex items-center gap-1.5 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></span>
            Issued {cert.date}
          </p>
          
          <p className="text-[#94a3b8] text-sm mb-6 flex-grow leading-relaxed font-body line-clamp-2">
            {cert.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6 overflow-hidden">
            {(cert.tags || []).map((tag, idx) => (
              <span 
                key={idx}
                className="text-[10px] font-mono font-bold px-2.5 py-1 text-[#7c3aed] bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out"
                style={{ transitionDelay: `${0.1 + idx * 0.05}s` }}
              >
                {tag}
              </span>
            ))}
          </div>

          <a 
            href={cert.link} 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center justify-center w-full px-4 py-3 bg-white/5 border border-white/10 text-[#e2e8f0] hover:bg-gradient-to-r hover:from-[#7c3aed] hover:to-[#06b6d4] hover:border-transparent hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-500 mt-auto hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]"
          >
            Verify Credential <FiExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:rotate-12 transition-transform" />
          </a>
        </div>
      </motion.div>
    </Tilt>
  );
};

const Certificates = () => {
  const { data: dbCertificates, loading } = useFetch(certificateService.getAllCertificates);

  let certificates = fallbackCertificatesFull;
  if (dbCertificates && dbCertificates.length > 0) {
    certificates = dbCertificates.map(dbCert => {
      const enriched = fallbackCertificatesFull.find(f => f.title === dbCert.title) || {};
      return {
        ...dbCert,
        icon: dbCert.icon || enriched.icon || "📜",
        description: dbCert.description || enriched.description || "Completed certification.",
        tags: dbCert.tags || enriched.tags || ["Certification"],
        link: dbCert.link || enriched.link || "#",
        imageUrl: dbCert.imageUrl || enriched.imageUrl || null
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
