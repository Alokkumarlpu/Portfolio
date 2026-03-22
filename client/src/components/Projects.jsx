import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { projectService } from '../services/projectService';
import ProjectCard from './ProjectCard';
import { fadeInUp } from '../hooks/useScrollAnimation';

const Projects = () => {
  const { data: projects, loading, error } = useFetch(projectService.getAllProjects);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Web', 'Game', 'AI', 'Other'];

  const filteredProjects = projects
    ? filter === 'All'
      ? projects.filter(p => p.featured).slice(0, 6)
      : projects.filter(p => p.category === filter).slice(0, 6)
    : [];

  const SkeletonCard = () => (
    <div className="bg-gray-900/80 rounded-2xl overflow-hidden border border-white/[0.08] animate-pulse h-[420px]">
      <div className="h-[200px] bg-white/5"></div>
      <div className="p-5">
        <div className="h-5 bg-white/5 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-white/5 rounded w-full mb-2"></div>
        <div className="h-4 bg-white/5 rounded w-5/6 mb-6"></div>
        <div className="flex gap-2">
          <div className="h-4 bg-white/5 rounded w-16"></div>
          <div className="h-4 bg-white/5 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-[#050510]">
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,rgba(124,58,237,0.05)_0%,rgba(5,5,16,1)_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading - Split Text */}
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, amount: 0.2 }}
           className="text-center mb-16 flex flex-col items-center"
        >
          <div className="flex flex-wrap justify-center overflow-hidden">
            {"Featured Projects".split(" ").map((word, i) => (
              <motion.h2 
                key={i}
                variants={{
                  hidden: { y: 60, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 } }
                }}
                className="text-3xl md:text-5xl font-heading font-extrabold text-[#e2e8f0] mb-4 tracking-tight mr-4"
              >
                {word}
              </motion.h2>
            ))}
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-sm mb-6"
          >
            Things I've built and shipped
          </motion.p>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "4rem" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-1 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-full"
          ></motion.div>
        </motion.div>

        {/* Filter tabs with sliding indicator */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap relative p-1 bg-white/5 rounded-full w-fit mx-auto border border-white/10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`relative z-10 text-xs font-semibold px-6 py-2.5 rounded-full transition-colors duration-300
                ${filter === cat ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <span className="relative z-10">{cat}</span>
              {filter === cat && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] rounded-full shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="text-center p-8 bg-red-900/10 text-red-400 rounded-xl border border-red-900/30 mb-8 backdrop-blur-sm">
            <p>Failed to load projects: {error}</p>
          </div>
        )}

        {/* Uniform grid — all cards same size */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project, i) => (
                <motion.div
                  key={project._id}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9, y: 50 },
                    visible: { 
                      opacity: 1, 
                      scale: 1, 
                      y: 0, 
                      transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' } 
                    }
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))
            ) : (
            <div className="col-span-full text-center p-12 text-[#64748b] bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
              No projects found in this category.
            </div>
          )}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <NavLink
            to="/projects"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-transparent border-2 border-[#7c3aed]/50 text-[#e2e8f0] hover:bg-[#7c3aed]/10 hover:border-[#7c3aed] font-medium rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(124,58,237,0.1)] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          >
            View All Projects
          </NavLink>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
