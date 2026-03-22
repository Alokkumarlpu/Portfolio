import Experience from '../models/Experience.js';

export const getAllExperience = async (req, res, next) => {
  try {
    const experiences = await Experience.find().sort({ order: 1, startDate: -1 });
    res.json(experiences);
  } catch (error) {
    next(error);
  }
};

export const createExperience = async (req, res, next) => {
  try {
    const exp = new Experience(req.body);
    await exp.save();
    res.status(201).json(exp);
  } catch (error) {
    next(error);
  }
};

export const updateExperience = async (req, res, next) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exp) {
      res.status(404);
      throw new Error('Experience not found');
    }
    res.json(exp);
  } catch (error) {
    next(error);
  }
};

export const deleteExperience = async (req, res, next) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) {
      res.status(404);
      throw new Error('Experience not found');
    }
    await exp.deleteOne();
    res.json({ message: 'Experience removed' });
  } catch (error) {
    next(error);
  }
};
