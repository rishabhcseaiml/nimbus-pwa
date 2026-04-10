import { Router } from 'express';
import Category from '../models/Category.js';

const r = Router();

r.get('/', async (req, res) => {
  const items = await Category.find({}).sort({ name: 1 });
  res.json(items);
});

export default r;