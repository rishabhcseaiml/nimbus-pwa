import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

const run = async () => {
  await connectDB();
  await Category.deleteMany({});
  await Product.deleteMany({});

  const [shoes, cricket, football, clothing] = await Category.create([
    { name: 'Shoes', slug: 'shoes' },
    { name: 'Cricket', slug: 'cricket' },
    { name: 'Football', slug: 'football' },
    { name: 'Clothing', slug: 'clothing' },
  ]);

  await Product.create([
    // 👟 Shoes
    { title: 'Nike Air Max 270', slug: 'nike-air-max-270', category: shoes._id, price: 12995, stock: 25, imageUrl: 'https://picsum.photos/seed/shoe1/400/300', description: 'Nike Air Max 270 with large Air unit for all-day comfort.' },
    { title: 'Adidas Ultraboost 23', slug: 'adidas-ultraboost-23', category: shoes._id, price: 16999, stock: 20, imageUrl: 'https://picsum.photos/seed/shoe2/400/300', description: 'Adidas Ultraboost 23 with responsive Boost midsole.' },
    { title: 'Puma RS-X Sneakers', slug: 'puma-rsx-sneakers', category: shoes._id, price: 8999, stock: 35, imageUrl: 'https://picsum.photos/seed/shoe3/400/300', description: 'Puma RS-X retro running style with bold colors.' },

    // 🏏 Cricket
    { title: 'SS Ton Reserve Edition Bat', slug: 'ss-ton-reserve-bat', category: cricket._id, price: 14999, stock: 15, imageUrl: 'https://picsum.photos/seed/cricket1/400/300', description: 'SS Ton Reserve Edition English Willow cricket bat.' },
    { title: 'SG Club Cricket Kit', slug: 'sg-club-cricket-kit', category: cricket._id, price: 8499, stock: 10, imageUrl: 'https://picsum.photos/seed/cricket2/400/300', description: 'Complete SG Club cricket kit with pads, gloves and helmet.' },
    { title: 'Kookaburra Pace Cricket Ball', slug: 'kookaburra-pace-ball', category: cricket._id, price: 1299, stock: 50, imageUrl: 'https://picsum.photos/seed/cricket3/400/300', description: 'Kookaburra Pace red leather cricket ball.' },
    { title: 'MRF Genius Grand Bat', slug: 'mrf-genius-grand-bat', category: cricket._id, price: 19999, stock: 8, imageUrl: 'https://picsum.photos/seed/cricket4/400/300', description: 'MRF Genius Grand English Willow bat — endorsed by Virat Kohli.' },

    // ⚽ Football
    { title: 'Nike Strike Football', slug: 'nike-strike-football', category: football._id, price: 2995, stock: 40, imageUrl: 'https://picsum.photos/seed/football1/400/300', description: 'Nike Strike match ball with high visibility graphics.' },
    { title: 'Adidas Predator Boots', slug: 'adidas-predator-boots', category: football._id, price: 11999, stock: 18, imageUrl: 'https://picsum.photos/seed/football2/400/300', description: 'Adidas Predator boots with Control skin for maximum grip.' },
    { title: 'Nike Dri-FIT Football Jersey', slug: 'nike-drifit-football-jersey', category: football._id, price: 2499, stock: 50, imageUrl: 'https://picsum.photos/seed/football3/400/300', description: 'Nike Dri-FIT technology keeps you cool and dry.' },

    // 👕 Clothing
    { title: 'Nike Dri-FIT T-Shirt', slug: 'nike-drifit-tshirt', category: clothing._id, price: 1999, stock: 60, imageUrl: 'https://picsum.photos/seed/cloth1/400/300', description: 'Nike Dri-FIT sports t-shirt with moisture wicking technology.' },
    { title: 'Adidas Tiro Cargo Pants', slug: 'adidas-tiro-cargo-pants', category: clothing._id, price: 3499, stock: 30, imageUrl: 'https://picsum.photos/seed/cloth2/400/300', description: 'Adidas Tiro cargo pants with multiple pockets.' },
    { title: 'Levis 511 Slim Fit Jeans', slug: 'levis-511-slim-jeans', category: clothing._id, price: 3999, stock: 25, imageUrl: 'https://picsum.photos/seed/cloth3/400/300', description: "Levi's 511 slim fit jeans." },
    { title: 'Adidas Tracksuit Set', slug: 'adidas-tracksuit-set', category: clothing._id, price: 5999, stock: 20, imageUrl: 'https://picsum.photos/seed/cloth4/400/300', description: 'Adidas full tracksuit set for training.' },
    { title: 'New Era Classic Cap', slug: 'new-era-classic-cap', category: clothing._id, price: 1799, stock: 80, imageUrl: 'https://picsum.photos/seed/cloth5/400/300', description: 'New Era 9FORTY adjustable cap.' },
  ]);

  console.log('✅ Seeded successfully!');
  await mongoose.disconnect();
};

run();