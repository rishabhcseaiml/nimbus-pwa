import IdempotencyKey from '../models/IdempotencyKey.js';

export const idempotent = async (req, res, next) => {
  const key = req.get('Idempotency-Key');
  if (!key) return next();
  
  const existing = await IdempotencyKey.findOne({ key });
  if (existing) return res.status(200).json(existing.response);
  
  res.saveIdempotent = async (response) => {
    try {
      await IdempotencyKey.create({ 
        key, method: req.method, path: req.path, response 
      });
    } catch {}
  };
  next();
};