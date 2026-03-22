import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid username or password');
    }
  } catch (error) {
    next(error);
  }
};
