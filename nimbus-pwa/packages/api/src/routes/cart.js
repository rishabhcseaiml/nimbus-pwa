import { Router } from 'express';
import Product from '../models/Product.js';

const r = Router();

r.post('/price-check', async (req, res) => {
  const { items } = req.body;
  const products = await Product.find({ 
    _id: { $in: items.map(i => i.productId) } 
  });
  const map = new Map(products.map(p => [String(p._id), p]));
  const result = items.map(i => {
    const p = map.get(String(i.productId));
    return { 
      productId: i.productId, 
      ok: !!p && p.stock >= i.quantity, 
      price: p?.price ?? null, 
      available: p?.stock ?? 0 
    };
  });
  res.json({ items: result });
});

export default r;