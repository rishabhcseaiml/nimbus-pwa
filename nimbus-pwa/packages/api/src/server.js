import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './db.js';
import products from './routes/products.js';
import categories from './routes/categories.js';
import orders from './routes/orders.js';
import cart from './routes/cart.js';
import { idempotent } from './middleware/idempotency.js';
import { errorHandler } from './middleware/errorHandler.js';
import auth from './routes/auth.js';

const app = express();

app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'https://localhost:5173'],
  credentials: true
}));
app.use(cors({
  origin: true,
  credentials: true
}));

app.use('/api', idempotent);
app.use('/api/auth', auth);
app.use('/api/products', products);
app.use('/api/categories', categories);
app.use('/api/orders', orders);
app.use('/api/cart', cart);
app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(process.env.PORT, () => 
    console.log(`API running on port ${process.env.PORT}`)
  );
};

start();
