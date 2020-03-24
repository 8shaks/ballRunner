const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'You need a token!' });
  }

  // Verify token
  try {
    jwt.verify(token, keys.secretOrKey, (error, decoded) => {
      if (error) {
        res.status(401).json({ msg: 'Invalid Token!' });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};