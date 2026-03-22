import Achievement from '../models/Achievement.js';

export const getAllAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find().sort({ order: 1, createdAt: -1 });
    res.json(achievements);
  } catch (error) {
    next(error);
  }
};

export const createAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.create(req.body);
    res.status(201).json(achievement);
  } catch (error) {
    next(error);
  }
};

export const updateAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
    res.json(achievement);
  } catch (error) {
    next(error);
  }
};

export const deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
    res.json({ message: 'Achievement removed' });
  } catch (error) {
    next(error);
  }
};
