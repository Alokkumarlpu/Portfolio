import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiStar } from 'react-icons/fi';
import Tilt from 'react-parallax-tilt';

const categoryConfig = {
  Web:   { gradient: 'from-violet-900 to-indigo-900', icon: '🌐', badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  AI:    { gradient: 'from-cyan-900 to-blue-900',     icon: '🤖', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  Game:  { gradient: 'from-green-900 to-emerald-900', icon: '🎮', badge: 'bg-green-500/20 text-green-300 border-green-500/30' },
  Tool:  { gradient: 'from-amber-900 to-orange-900',  icon: '🛠️', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  Other: { gradient: 'from-gray-800 to-gray-900',     icon: '💻', badge: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
};

const ProjectCard = ({ project }) => {
  const config = categoryConfig[project.category] || categoryConfig.Other;

  return (
    <Tilt
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      glareEnable={true}
      glareMaxOpacity={0.12}
      scale={1.02}
      transitionSpeed={400}
      className="h-full group"
    >
      <style>{`
        @keyframes spin-border {
          0%   { --card-angle: 0deg; }
          100% { --card-angle: 360deg; }
        }
        @property --card-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        .project-card-wrapper {
          position: relative;
        }
        .project-card-wrapper::before {
          content: '';
          position: absolute;
          inset: -1px;
          background: conic-gradient(from var(--card-angle), transparent, transparent, #7c3aed, #06b6d4, transparent, transparent);
          border-radius: 17px;
          animation: spin-border 4s linear infinite;
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
        }
        .group:hover .project-card-wrapper::before {
          opacity: 1;
        }
      `}</style>

      <div className="project-card-wrapper h-full">
        <div
          className="bg-[#0a0a1a]/95 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col h-full border border-white/10 transition-all duration-500 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] group-hover:shadow-[0_20px_60px_rgba(124,58,237,0.2)] group-hover:border-[#7c3aed]/40 will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Hover glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/0 to-[#06b6d4]/0 group-hover:from-[#7c3aed]/10 group-hover:to-[#06b6d4]/10 transition-colors duration-500 z-0 pointer-events-none rounded-2xl" />

          {/* Image Area — fixed 200px */}
          <div
            className="relative h-[200px] w-full overflow-hidden flex-shrink-0 border-b border-white/5"
            style={{ transform: 'translateZ(20px)' }}
          >
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover scale-105 group-hover:scale-[1.08] transition-transform duration-700 ease-out will-change-transform"
              />
            ) : (
              <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${config.gradient}`}>
                <span className="text-5xl mb-1 transform group-hover:scale-125 transition-transform duration-500">{config.icon}</span>
                <span className="font-heading font-extrabold text-[3rem] leading-none text-white/[0.12] tracking-widest select-none">
                  {project.title.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}

            {/* Bottom gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Category badge — top left with pulse */}
            <div className="absolute top-3 left-3 z-20">
              <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full border tracking-wider uppercase backdrop-blur-md transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(124,58,237,0.5)] group-hover:scale-110 ${config.badge}`}>
                {project.category}
              </span>
            </div>

            {/* Featured badge — top right */}
            {project.featured && (
              <div className="absolute top-3 right-3 z-20">
                <span className="text-[10px] font-bold px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/20 text-amber-300 backdrop-blur-md tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                  <FiStar className="w-3 h-3 fill-current animate-pulse" /> Featured
                </span>
              </div>
            )}

            {/* Hover action icons — slide up with stagger */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4 z-30">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#7c3aed] hover:border-[#7c3aed] hover:scale-110 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]"
                  style={{ transitionDelay: '0.1s' }}
                >
                  <FiGithub className="w-5 h-5" />
                </a>
              )}
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#06b6d4] hover:border-[#06b6d4] hover:scale-110 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                  style={{ transitionDelay: '0.2s' }}
                >
                  <FiExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div
            className="p-5 flex flex-col flex-1 relative z-10 bg-[#0a0a1a]"
            style={{ transform: 'translateZ(30px)' }}
          >
            {/* Title */}
            <h3 className="text-lg font-heading font-bold text-white mb-2 line-clamp-2 group-hover:text-[#06b6d4] transition-colors duration-300">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-[#64748b] line-clamp-3 flex-1 leading-relaxed">
              {project.description}
            </p>

            {/* Tech stack — slide up on hover */}
            <div className="flex flex-wrap gap-1.5 mt-4 overflow-hidden">
              {project.techStack.slice(0, 5).map((tech, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono font-bold px-2.5 py-1 text-[#06b6d4] bg-[#06b6d4]/10 border border-[#06b6d4]/20 rounded-md translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out"
                  style={{ transitionDelay: `${0.1 + idx * 0.05}s` }}
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 5 && (
                <span className="text-[10px] font-bold px-2 py-1 text-gray-500 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500" style={{ transitionDelay: '0.35s' }}>
                  +{project.techStack.length - 5}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Tilt>
  );
};

export default ProjectCard;
