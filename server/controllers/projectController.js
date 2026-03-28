import Project from '../models/Project.js';
import { transformDriveUrl } from '../utils/googleDrive.js';

export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    if (req.body.image) {
      req.body.image = transformDriveUrl(req.body.image);
    }

    const project = new Project(req.body);
    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      project.title = req.body.title || project.title;
      project.description = req.body.description || project.description;
      project.image = req.body.image ? transformDriveUrl(req.body.image) : project.image;
      project.techStack = req.body.techStack || project.techStack;
      project.githubLink = req.body.githubLink || project.githubLink;
      project.liveDemo = req.body.liveDemo || project.liveDemo;
      project.category = req.body.category || project.category;
      project.featured = req.body.featured !== undefined ? req.body.featured : project.featured;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};
