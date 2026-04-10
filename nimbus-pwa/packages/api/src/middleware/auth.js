import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  const token = req.cookies?.token || 
    (req.headers.authorization || '').replace('Bearer ', '');
  
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};