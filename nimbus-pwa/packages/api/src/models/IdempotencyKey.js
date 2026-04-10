import mongoose from 'mongoose';

const IdempotencyKeySchema = new mongoose.Schema({
  key: { type: String, unique: true, index: true },
  method: String,
  path: String,
  response: {},
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 }
});

export default mongoose.model('IdempotencyKey', IdempotencyKeySchema);