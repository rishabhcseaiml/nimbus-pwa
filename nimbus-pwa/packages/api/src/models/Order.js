import mongoose from 'mongoose';

const LineItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  title: String,
  priceAtPurchase: Number,
  quantity: Number,
});

const OrderSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  items: [LineItemSchema],
  total: Number,
  status: { type: String, default: 'created', index: true },
  clientQueueId: { type: String, index: true },
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);