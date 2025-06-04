import jwt from 'jsonwebtoken';

const tokenVerification = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      // Role check
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient role' });
      }

      next(); // Passes both checks
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

export default tokenVerification;
