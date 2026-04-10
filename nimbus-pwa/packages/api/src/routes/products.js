import { Router } from 'express';
import Product from '../models/Product.js';

const r = Router();

// GET /api/products?q=&category=&page=1&limit=20
r.get('/', async (req, res) => {
  const { q, category, page=1, limit=20 } = req.query;
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  const skip = (parseInt(page)-1) * parseInt(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Product.countDocuments(filter)
  ]);
  res.json({ items, total, page: +page, limit: +limit });
});

// GET /api/products/:slug
r.get('/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

export default r;