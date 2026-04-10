import { Router } from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const r = Router();

r.post('/', async (req, res) => {
  const { items, clientQueueId } = req.body;
  const dbProducts = await Product.find({ 
    _id: { $in: items.map(i => i.productId) }
  });
  const map = new Map(dbProducts.map(p => [String(p._id), p]));
  const lineItems = [];
  let total = 0;

  for (const i of items) {
    const p = map.get(String(i.productId));
    if (!p || p.stock < i.quantity)
      return res.status(409).json({ error: 'Out of stock', productId: i.productId });
    lineItems.push({ 
      product: p._id, title: p.title, 
      priceAtPurchase: p.price, quantity: i.quantity 
    });
    total += p.price * i.quantity;
  }

  for (const i of items)
    await Product.updateOne(
      { _id: i.productId, stock: { $gte: i.quantity } }, 
      { $inc: { stock: -i.quantity } }
    );

  const order = await Order.create({ 
    items: lineItems, total, status: 'created', clientQueueId 
  });
  if (res.saveIdempotent) await res.saveIdempotent(order.toJSON());
  res.json(order);
});

export default r;