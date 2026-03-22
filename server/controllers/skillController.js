import Skill from '../models/Skill.js';

export const getAllSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort('order');
    res.json(skills);
  } catch (error) {
    next(error);
  }
};

export const createSkill = async (req, res, next) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }
    res.json(skill);
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }
    await skill.deleteOne();
    res.json({ message: 'Skill removed' });
  } catch (error) {
    next(error);
  }
};
