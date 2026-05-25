const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication failed: No token provided' });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Authentication failed: Invalid token' });
  }
};
