import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, please login'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token, please login again'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');

    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin user not found, please login again'
      });
    }

    next();
  } catch (error) {
    console.error('JWT Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Session expired, please login again'
    });
  }
};

export const admin = (req, res, next) => {
  if (req.admin) {
    next();
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized as an admin'
    });
  }
};
