import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useForm from '../hooks/useForm';
import api from '../services/api';
import useFetch from '../hooks/useFetch';
import { projectService } from '../services/projectService';
import { profileService } from '../services/profileService';
import { skillService } from '../services/skillService';
import { experienceService } from '../services/experienceService';
import { contactService } from '../services/contactService';
import { certificateService as certService } from '../services/certificateService';
import { achievementService } from '../services/achievementService';
import toast, { Toaster } from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiLogOut, FiLayout, FiUser, FiCode, FiBriefcase, FiFileText, FiMessageSquare, FiSettings, FiCheck, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';

const AdminDashboard = () => {
  console.log('DEBUG: certService is', typeof certService, certService);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const isAuthenticated = Boolean(token);
  
  // Data Fetching
  const { data: profile, refetch: refetchProfile } = useFetch(profileService.getProfile, [token], { enabled: isAuthenticated });
  const { data: projects, refetch: refetchProjects } = useFetch(projectService.getAllProjects, [token], { enabled: isAuthenticated });
  const { data: skills, refetch: refetchSkills } = useFetch(skillService.getAllSkills, [token], { enabled: isAuthenticated });
  const { data: experience, refetch: refetchExperience } = useFetch(experienceService.getAllExperience, [token], { enabled: isAuthenticated });
  const { data: messages, refetch: refetchMessages } = useFetch(contactService.getAllMessages, [token], { enabled: isAuthenticated });
  const { data: certificatesList, refetch: refetchCertificatesList } = useFetch(certService.getAllCertificates, [token], { enabled: isAuthenticated });
  const { data: achievements, refetch: refetchAchievements } = useFetch(achievementService.getAllAchievements, [token], { enabled: isAuthenticated });

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      if (parsed?.token) setToken(parsed.token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setToken(null);
  };

  if (!token) {
    return <AdminLogin setToken={setToken} />;
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardTab projects={projects} messages={messages} />;
      case 'profile': return <ProfileTab profile={profile} refetchProfile={refetchProfile} />;
      case 'about': return <AboutTab profile={profile} refetchProfile={refetchProfile} />;
      case 'skills': return <SkillsTab skills={skills} refetchSkills={refetchSkills} />;
      case 'projects': return <ProjectsTab projects={projects} refetchProjects={refetchProjects} />;
      case 'experience': return <ExperienceTab experience={experience} refetchExperience={refetchExperience} />;
      case 'certificates': return <CertificatesTab certificatesList={certificatesList} refetchCertificatesList={refetchCertificatesList} />;
      case 'achievements': return <AchievementsTab achievements={achievements} refetchAchievements={refetchAchievements} />;
      case 'resume': return <ResumeTab profile={profile} refetchProfile={refetchProfile} />;
      case 'messages': return <MessagesTab messages={messages} refetchMessages={refetchMessages} />;
      default: return null;
    }
  };

  const navItems = [
    { id: 'dashboard', icon: FiLayout, label: 'Dashboard' },
    { id: 'profile', icon: FiUser, label: 'Profile Options' },
    { id: 'about', icon: FiSettings, label: 'About Text' },
    { id: 'skills', icon: FiCode, label: 'Skills' },
    { id: 'projects', icon: FiLayout, label: 'Projects' },
    { id: 'experience', icon: FiBriefcase, label: 'Experience' },
    { id: 'certificates', icon: FiFileText, label: 'Certificates' },
    { id: 'achievements', icon: FiFileText, label: 'Achievements' },
    { id: 'resume', icon: FiFileText, label: 'Resume PDF' },
    { id: 'messages', icon: FiMessageSquare, label: 'Messages' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pt-20 flex flex-col md:flex-row">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 shrink-0">
        <div className="font-bold text-xl mb-6 px-4">Admin Panel</div>
        <nav className="space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-violet-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 mt-8">
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

// --- SUB TABS --- //

const DashboardTab = ({ projects, messages }) => {
  const unreadMsg = messages?.filter(m => !m.isRead).length || 0;
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="text-4xl font-bold text-violet-600 mb-2">{projects?.length || 0}</div>
          <div className="text-gray-500 font-medium">Total Projects</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="text-4xl font-bold text-blue-600 mb-2">{messages?.length || 0}</div>
          <div className="text-gray-500 font-medium">Total Messages</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="text-4xl font-bold text-red-500 mb-2">{unreadMsg}</div>
          <div className="text-gray-500 font-medium">Unread Messages</div>
        </div>
      </div>
    </div>
  );
};

const ProfileTab = ({ profile, refetchProfile }) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  const { values, handleChange, setValues } = useForm({
    name: '', title: '', bio: '', email: '', phone: '', location: '',
    github: '', linkedin: '', twitter: '', heroTypingRoles: ''
  });

  useEffect(() => {
    if (profile) {
      setValues({
        name: profile.name || '',
        title: profile.title || '',
        bio: profile.bio || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        github: profile.socialLinks?.github || '',
        linkedin: profile.socialLinks?.linkedin || '',
        twitter: profile.socialLinks?.twitter || '',
        heroTypingRoles: profile.heroTypingRoles?.join(', ') || ''
      });
      if (profile.profileImage) {
        setImagePreview(profile.profileImage);
      }
    }
  }, [profile, setValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await profileService.updateProfile({
        ...values,
        socialLinks: { github: values.github, linkedin: values.linkedin, twitter: values.twitter },
        heroTypingRoles: values.heroTypingRoles.split(',').map(s => s.trim()).filter(Boolean)
      });
      toast.success('Profile updated successfully');
      refetchProfile();
    } catch (err) {
      toast.error('Failed to update: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    setImageUploading(true);
    try {
      await profileService.uploadProfileImage(file);
      toast.success('Profile photo uploaded! ✓');
      refetchProfile();
    } catch (error) {
      toast.error('Upload error: ' + (error.response?.data?.message || error.message));
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Profile Details</h2>
      
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm mb-8 flex justify-center items-center">
        <div className="relative w-32 h-32 mx-auto">
          {(imagePreview || profile?.profileImage) ? (
            <img
              src={imagePreview || profile.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-purple-500"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border-2 border-purple-500 bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
              {profile?.name ? profile.name.charAt(0) : 'A'}
            </div>
          )}
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
            {imageUploading
              ? <span className="text-white text-sm font-medium drop-shadow-md">Uploading...</span>
              : <span className="text-white text-sm font-medium drop-shadow-md">📷 Change</span>
            }
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={imageUploading}
            />
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" name="name" value={values.name} onChange={handleChange} />
          <Input label="Job Title" name="title" value={values.title} onChange={handleChange} />
          <Input label="Email" name="email" value={values.email} onChange={handleChange} />
          <Input label="Phone" name="phone" value={values.phone} onChange={handleChange} />
          <Input label="Location" name="location" value={values.location} onChange={handleChange} />
          <Input label="Hero Typing Roles (comma separated)" name="heroTypingRoles" value={values.heroTypingRoles} onChange={handleChange} />
        </div>
        <div className="pt-2">
          <label className="block text-sm font-medium mb-1">Short Bio</label>
          <textarea name="bio" value={values.bio} onChange={handleChange} rows="3" className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-950 dark:border-gray-800"></textarea>
        </div>
        <h3 className="font-bold pt-4">Social Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="GitHub URL" name="github" value={values.github} onChange={handleChange} />
          <Input label="LinkedIn URL" name="linkedin" value={values.linkedin} onChange={handleChange} />
          <Input label="Twitter URL" name="twitter" value={values.twitter} onChange={handleChange} />
        </div>
        <button type="submit" disabled={loading} className="px-6 py-2 bg-violet-600 text-white rounded-lg mt-4 disabled:opacity-50">Save Profile</button>
      </form>
    </div>
  );
};

const AboutTab = ({ profile, refetchProfile }) => {
  const [aboutText, setAboutText] = useState('');
  useEffect(() => { if (profile) setAboutText(profile.about || ''); }, [profile]);

  const handleSubmit = async () => {
    try {
      await profileService.updateProfile({ about: aboutText });
      toast.success('About section updated');
      refetchProfile();
    } catch {
      toast.error('Failed to update About');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About Paragraph</h2>
      <textarea value={aboutText} onChange={e => setAboutText(e.target.value)} rows="15" className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-gray-950 dark:border-gray-800"></textarea>
      <button onClick={handleSubmit} className="px-6 py-2 bg-violet-600 text-white rounded-lg">Save About Text</button>
    </div>
  );
};

const SkillsTab = ({ skills, refetchSkills }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { values, handleChange, reset, setValues } = useForm({ name: '', category: 'Frontend', proficiency: 50, icon: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await skillService.updateSkill(editingId, values);
      else await skillService.createSkill(values);
      toast.success('Skill saved');
      reset(); setIsAdding(false); setEditingId(null); refetchSkills();
    } catch { toast.error('Error saving skill'); }
  };

  const handleEdit = (sk) => { setValues(sk); setEditingId(sk._id); setIsAdding(true); };
  const handleDelete = async (id) => {
    if (window.confirm('Delete skill?')) {
      try { await skillService.deleteSkill(id); toast.success('Deleted'); refetchSkills(); }
      catch { toast.error('Delete failed'); }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Skills</h2>
        <button onClick={() => { setIsAdding(!isAdding); reset(); setEditingId(null); }} className="bg-violet-600 px-4 py-2 text-white rounded-lg"><FiPlus className="inline mr-2" /> Add Skill</button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Input label="Name" name="name" value={values.name} onChange={handleChange} required />
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select name="category" value={values.category} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-950 dark:border-gray-800">
                <option value="Frontend">Frontend</option><option value="Backend">Backend</option>
                <option value="Database">Database</option><option value="Tools">Tools</option>
              </select>
            </div>
            <Input type="number" label="Proficiency" name="proficiency" value={values.proficiency} onChange={handleChange} />
            <Input label="Icon String" name="icon" value={values.icon} onChange={handleChange} />
          </div>
          <button type="submit" className="px-6 py-2 bg-violet-600 text-white rounded-lg">Save</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills?.map(sk => (
          <div key={sk._id} className="bg-white dark:bg-gray-900 p-4 border rounded-xl flex justify-between items-center">
            <div><div className="font-bold">{sk.name}</div><div className="text-xs text-gray-500">{sk.category} • {sk.proficiency}%</div></div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(sk)} className="text-blue-500"><FiEdit2 /></button>
              <button onClick={() => handleDelete(sk._id)} className="text-red-500"><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExperienceTab = ({ experience, refetchExperience }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { values, handleChange, reset, setValues } = useForm({ title: '', company: '', type: 'Work', startDate: '', endDate: '', current: false, description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...values, current: values.current === 'true' || values.current === true };
      if (editingId) await experienceService.updateExperience(editingId, data);
      else await experienceService.createExperience(data);
      toast.success('Experience saved');
      reset(); setIsAdding(false); setEditingId(null); refetchExperience();
    } catch { toast.error('Error saving experience'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete experience?')) {
      await experienceService.deleteExperience(id); toast.success('Deleted'); refetchExperience();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Experience</h2>
        <button onClick={() => { setIsAdding(!isAdding); reset(); setEditingId(null); }} className="bg-violet-600 px-4 py-2 text-white rounded-lg"><FiPlus className="inline mr-2" /> Add Entry</button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Job/Degree Title" name="title" value={values.title} onChange={handleChange} required />
            <Input label="Company/Institution" name="company" value={values.company} onChange={handleChange} required />
            <div>
              <label className="block text-sm mb-1">Type</label>
              <select name="type" value={values.type} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-950 dark:border-gray-800">
                <option value="Work">Work</option><option value="Education">Education</option><option value="Achievement">Achievement</option>
              </select>
            </div>
            <div className="flex items-center gap-4 pt-6">
              <input type="checkbox" name="current" id="current" checked={values.current} onChange={e => handleChange({ target: { name: 'current', value: e.target.checked }})} />
              <label htmlFor="current">I currently work here</label>
            </div>
            <Input type="date" label="Start Date" name="startDate" value={values.startDate?.split('T')[0] || ''} onChange={handleChange} />
            <Input type="date" label="End Date" name="endDate" value={values.endDate?.split('T')[0] || ''} onChange={handleChange} disabled={values.current} />
          </div>
          <div className="pt-2">
            <label className="block text-sm mb-1">Description</label>
            <textarea name="description" value={values.description} onChange={handleChange} rows="3" className="w-full p-2 border rounded-lg dark:bg-gray-950 dark:border-gray-800"></textarea>
          </div>
          <button type="submit" className="px-6 py-2 bg-violet-600 text-white rounded-lg">Save Entry</button>
        </form>
      )}

      <div className="space-y-4">
        {experience?.map(exp => (
          <div key={exp._id} className="bg-white dark:bg-gray-900 p-6 border rounded-xl flex justify-between">
            <div>
              <h4 className="font-bold text-lg">{exp.title} <span className="text-violet-500 text-sm ml-2">{exp.type}</span></h4>
              <p className="text-gray-500 font-medium">{exp.company}</p>
              <p className="text-sm text-gray-400 mb-2">
                {new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : new Date(exp.endDate).getFullYear()}
              </p>
              <p className="text-sm line-clamp-2">{exp.description}</p>
            </div>
            <div className="flex gap-4 items-start">
              <button onClick={() => { setValues(exp); setEditingId(exp._id); setIsAdding(true); }} className="text-blue-500"><FiEdit2 /></button>
              <button onClick={() => handleDelete(exp._id)} className="text-red-500"><FiTrash2 /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectsTab = ({ projects, refetchProjects }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { values, handleChange, reset, setValues } = useForm({
    title: '', description: '', image: '', techStack: '', githubLink: '', liveDemo: '', category: 'Web', featured: false, visible: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...values, techStack: values.techStack.split(',').map(t=>t.trim()) };
      if (editingId) await projectService.updateProject(editingId, data);
      else await projectService.createProject(data);
      toast.success('Project saved');
      reset(); setIsAdding(false); setEditingId(null); refetchProjects();
    } catch { toast.error('Error saving project'); }
  };
  
  const handleEdit = (p) => { setValues({...p, techStack: p.techStack.join(', ')}); setEditingId(p._id); setIsAdding(true); };
  const handleDelete = async (id) => {
    if(window.confirm('Delete project?')) { await projectService.deleteProject(id); toast.success('Deleted'); refetchProjects(); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Projects</h2>
        <button onClick={() => { setIsAdding(!isAdding); reset(); setEditingId(null); }} className="bg-violet-600 px-4 py-2 text-white rounded-lg"><FiPlus className="inline mr-2" /> Add Project</button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Title" name="title" value={values.title} onChange={handleChange} required />
            <div>
              <label className="block text-sm mb-1">Category</label>
              <select name="category" value={values.category} onChange={handleChange} className="w-full p-2 border rounded-lg dark:bg-gray-950 dark:border-gray-800">
                <option value="Web">Web</option><option value="Game">Game</option><option value="AI">AI</option><option value="Other">Other</option>
              </select>
            </div>
            <Input label="Image URL" name="image" value={values.image} onChange={handleChange} />
            <Input label="Tech Stack" name="techStack" value={values.techStack} onChange={handleChange} />
            <Input label="GitHub Link" name="githubLink" value={values.githubLink} onChange={handleChange} />
            <Input label="Live Demo Link" name="liveDemo" value={values.liveDemo} onChange={handleChange} />
            <div className="col-span-2">
              <label className="block text-sm mb-1">Description</label>
              <textarea name="description" value={values.description} onChange={handleChange} rows="3" className="w-full p-2 border rounded-lg dark:bg-gray-950 dark:border-gray-800"></textarea>
            </div>
          </div>
          <button type="submit" className="px-6 py-2 bg-violet-600 text-white rounded-lg">Save Project</button>
        </form>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {projects?.map(p => (
           <div key={p._id} className="bg-white dark:bg-gray-900 p-4 border rounded-xl flex justify-between items-center">
             <div><div className="font-bold">{p.title}</div><div className="text-sm">{p.category}</div></div>
             <div className="flex gap-4">
                <button onClick={() => handleEdit(p)} className="text-blue-500"><FiEdit2 /></button>
                <button onClick={() => handleDelete(p._id)} className="text-red-500"><FiTrash2 /></button>
             </div>
           </div>
        ))}
      </div>
    </div>
  );
};

const CertificatesTab = ({ certificatesList, refetchCertificatesList }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { values, handleChange, reset, setValues } = useForm({
    title: '', issuer: '', date: '', link: '', imageUrl: '', icon: '📜', description: '', tags: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...values,
        tags: typeof values.tags === 'string' ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : values.tags
      };

      if (editingId) {
        await certService.updateCertificate(editingId, payload);
      } else {
        await certService.createCertificate(payload);
      }

      toast.success('Certificate saved');
      reset(); setIsAdding(false); setEditingId(null); refetchCertificatesList();
    } catch { toast.error('Error saving certificate'); }
  };

  const handleEdit = (cert) => {
    setValues({
      ...cert,
      tags: Array.isArray(cert.tags) ? cert.tags.join(', ') : ''
    });
    setEditingId(cert._id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete certificate?')) {
      try {
        await certService.deleteCertificate(id);
        toast.success('Deleted');
        refetchCertificatesList();
      } catch { toast.error('Delete failed'); }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Certificates</h2>
        <button onClick={() => { setIsAdding(!isAdding); reset(); setEditingId(null); }} className="bg-violet-600 px-4 py-2 text-white rounded-lg"><FiPlus className="inline mr-2" /> Add Certificate</button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Title" name="title" value={values.title} onChange={handleChange} required />
            <Input label="Issuer" name="issuer" value={values.issuer} onChange={handleChange} required />
            <Input label="Date (e.g., Nov 2025)" name="date" value={values.date} onChange={handleChange} required />
            <Input label="Credential Link (URL)" name="link" value={values.link} onChange={handleChange} />
            <Input label="Image URL" name="imageUrl" value={values.imageUrl} onChange={handleChange} />
            <Input label="Icon (Emoji)" name="icon" value={values.icon} onChange={handleChange} />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <input name="tags" value={values.tags} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-950 dark:border-gray-800" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={values.description} onChange={handleChange} rows="2" className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-950 dark:border-gray-800"></textarea>
            </div>
          </div>
          <button type="submit" className="px-6 py-2 bg-violet-600 text-white rounded-lg">
            {editingId ? 'Update' : 'Save'} Certificate
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificatesList?.map((cert) => (
          <div key={cert._id} className="bg-white dark:bg-gray-900 p-4 border rounded-xl flex justify-between items-center">
            <div>
              <div className="font-bold text-gray-900 dark:text-white">{cert.title}</div>
              <div className="text-xs text-gray-500">{cert.issuer} • {cert.date}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(cert)} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors"><FiEdit2 /></button>
              <button onClick={() => handleDelete(cert._id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"><FiTrash2 /></button>
            </div>
          </div>
        ))}
        {(!certificatesList || certificatesList.length === 0) && (
          <div className="col-span-full py-10 text-center text-gray-500 bg-gray-50 dark:bg-gray-950 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            No certificates added to the database yet.
          </div>
        )}
      </div>
    </div>
  );
};
const AchievementsTab = ({ achievements, refetchAchievements }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { values, handleChange, reset, setValues } = useForm({
    title: '', company: '', date: '', icon: '🏆', description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await achievementService.updateAchievement(editingId, values);
      } else {
        await achievementService.createAchievement(values);
      }
      toast.success('Achievement saved successfully!');
      reset(); setIsAdding(false); setEditingId(null); refetchAchievements();
    } catch { toast.error('Error saving achievement'); }
  };

  const handleEdit = (ach) => {
    setValues({
      title: ach.title || '',
      company: ach.company || '',
      date: ach.date || '',
      icon: ach.icon || '🏆',
      description: ach.description || ''
    });
    setEditingId(ach._id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete achievement?')) {
      try {
        await achievementService.deleteAchievement(id);
        toast.success('Deleted');
        refetchAchievements();
      } catch { toast.error('Delete failed'); }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Achievements</h2>
        <button onClick={() => { setIsAdding(!isAdding); reset(); setEditingId(null); }} className="bg-violet-600 px-4 py-2 text-white rounded-lg"><FiPlus className="inline mr-2" /> Add Achievement</button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Title" name="title" value={values.title} onChange={handleChange} required />
            <Input label="Organization / Company" name="company" value={values.company} onChange={handleChange} />
            <Input label="Date (e.g., 2026)" name="date" value={values.date} onChange={handleChange} required />
            <Input label="Icon (Emoji)" name="icon" value={values.icon} onChange={handleChange} />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={values.description} onChange={handleChange} rows="2" className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-950 dark:border-gray-800"></textarea>
            </div>
          </div>
          <button type="submit" className="px-6 py-2 bg-violet-600 text-white rounded-lg">
            {editingId ? 'Update' : 'Save'} Achievement
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements?.map((ach) => (
          <div key={ach._id} className="bg-white dark:bg-gray-900 p-4 border rounded-xl flex justify-between items-center">
            <div>
              <div className="font-bold text-gray-900 dark:text-white">{ach.title}</div>
              <div className="text-xs text-gray-500">{ach.company} • {ach.date}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(ach)} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors"><FiEdit2 /></button>
              <button onClick={() => handleDelete(ach._id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"><FiTrash2 /></button>
            </div>
          </div>
        ))}
        {(!achievements || achievements.length === 0) && (
          <div className="col-span-full py-10 text-center text-gray-500 bg-gray-50 dark:bg-gray-950 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            No achievements added to the database yet.
          </div>
        )}
      </div>
    </div>
  );
};

const ResumeTab = ({ profile, refetchProfile }) => {
  const [resumeUploading, setResumeUploading] = useState(false);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file only');
      return;
    }

    setResumeUploading(true);
    try {
      await profileService.uploadResumePDF(file);
      toast.success('Resume uploaded! ✓');
      refetchProfile();
    } catch (error) {
      toast.error('Upload error: ' + (error.response?.data?.message || error.message));
    } finally {
      setResumeUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Resume Management</h2>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
              Current Resume Status
            </p>
            <p className="text-gray-900 dark:text-white text-md font-medium mt-1">
              {profile?.resumeUrl
                ? 'Resume uploaded ✓'
                : 'No resume uploaded'
              }
            </p>
          </div>
          <div className="flex gap-4">
            {profile?.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm font-bold px-4 py-2 rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
              >
                Preview Link
              </a>
            )}
            <label className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors border border-violet-800">
              {resumeUploading
                ? 'Uploading...'
                : 'Upload New PDF'
              }
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleResumeUpload}
                disabled={resumeUploading}
              />
            </label>
          </div>
        </div>
        {profile?.resumeUrl && (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(profile.resumeUrl)}&embedded=true`}
            className="w-full h-96 mt-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-inner"
            title="Resume Preview"
          />
        )}
      </div>
    </div>
  );
};

const MessagesTab = ({ messages, refetchMessages }) => {
  const handleMarkRead = async (id) => {
    try { await contactService.markAsRead(id); toast.success('Marked as read'); refetchMessages(); } catch {}
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Contact Messages</h2>
      <div className="space-y-4">
        {messages?.map(m => (
          <div key={m._id} className={`p-6 rounded-xl border ${m.isRead ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800 shadow-md border-violet-500'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className={`text-lg ${m.isRead ? 'font-medium' : 'font-bold'}`}>{m.name}</div>
                <a href={`mailto:${m.email}`} className="text-sm text-violet-500">{m.email}</a>
              </div>
              <div className="flex gap-3">
                {!m.isRead && <button onClick={() => handleMarkRead(m._id)} className="text-sm bg-violet-100 text-violet-600 px-3 py-1 rounded-full"><FiCheck className="inline mr-1"/> Mark Read</button>}
              </div>
            </div>
            <div className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-950 p-4 rounded-lg text-sm">{m.message}</div>
            <div className="text-xs text-gray-400 mt-4">{new Date(m.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Reusable Input
const Input = ({ label, name, value, onChange, type='text', disabled=false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} disabled={disabled} className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 dark:border-gray-800 disabled:opacity-50" />
  </div>
);

// Login Screen
const AdminLogin = ({ setToken }) => {
  const { values, handleChange } = useForm({ username: '', password: '' });
  const [err, setErr] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLog = async (e) => {
    e.preventDefault();
    setErr('');
    setIsSubmitting(true);

    try {
      const { data } = await api.post('/auth/login', values);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setToken(data.token);
    } catch (e) {
      setErr('Login failed. Check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 flex items-center justify-center">
      <motion.form
        onSubmit={handleLog}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-violet-500/80 via-fuchsia-500/70 to-blue-500/80 shadow-2xl shadow-violet-900/20">
          <div className="bg-white text-gray-900 rounded-2xl p-8 border border-white/60 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-violet-100 text-violet-700 flex items-center justify-center">
                <FiShield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Admin Access</h2>
              <p className="text-sm text-gray-500">Sign in to manage your portfolio content</p>
            </div>

            {err && (
              <div className="text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg text-sm">
                {err}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    autoComplete="username"
                    placeholder="Enter admin username"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    placeholder="Enter admin password"
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-violet-600 transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 rounded-lg font-bold hover:from-violet-700 hover:to-fuchsia-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? 'Signing In...' : 'Enter Dashboard'}
            </button>

            <p className="text-xs text-center text-gray-500">
              Protected area. Authorized users only.
            </p>
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default AdminDashboard;
