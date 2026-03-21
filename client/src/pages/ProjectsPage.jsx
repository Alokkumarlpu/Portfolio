import { useState } from 'react';
import { motion } from 'framer-motion';
import useFetch from '../hooks/useFetch';
import { projectService } from '../services/projectService';
import ProjectCard from '../components/ProjectCard';
import { fadeInUp } from '../hooks/useScrollAnimation';

const ProjectsPage = () => {
  const { data: projects, loading, error } = useFetch(projectService.getAllProjects);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Web', 'Game', 'AI', 'Other'];

  const filteredProjects = projects 
    ? filter === 'All' 
      ? projects 
      : projects.filter(p => p.category === filter)
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
    <div className="min-h-screen bg-[#050510] pt-28 pb-20 relative overflow-hidden">
      {/* Background radial fade */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.05)_0%,rgba(5,5,16,1)_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,rgba(124,58,237,0.05)_0%,rgba(5,5,16,1)_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
           variants={fadeInUp}
           initial="hidden"
           animate="visible"
           className="text-center mb-16 flex flex-col items-center"
        >
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-[#e2e8f0] mb-4 tracking-tight">
            All Projects
          </h1>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto mb-6">
            A comprehensive list of my side projects, assignments, and open-source contributions.
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-[#06b6d4] to-[#7c3aed] rounded-full drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
        </motion.div>

        <div className="flex justify-center mb-16 overflow-x-auto pb-4 custom-scrollbar">
          <div className="flex gap-2 bg-white/5 backdrop-blur-md p-2 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.2)] border border-white/10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                  ${filter === cat 
                    ? 'bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]' 
                    : 'text-[#94a3b8] hover:bg-white/10 hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-center p-8 bg-red-900/10 text-red-400 rounded-xl border border-red-900/30 mb-8 backdrop-blur-sm">
            <p>Failed to load projects: {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project, idx) => (
              <ProjectCard key={project._id || idx} project={project} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold text-[#64748b]">No projects found for this category.</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
