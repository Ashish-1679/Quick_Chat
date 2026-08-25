const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized: invalid token' });
  }
};

const checkAuth = async (req, res) => {
  return res.json({ success: true, message: 'User is authenticated', user: req.user });
};

module.exports = { protectRoute, checkAuth };