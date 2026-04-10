import { createContext, useContext, useEffect, useState } from 'react';
import { CartDB } from '../lib/db';
import { createOrder, replayQueue } from '../lib/api';
import { v4 as uuid } from 'uuid';

const CartCtx = createContext(null as any);
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState([] as any[]);

  // Load cart from IndexedDB when app starts
  useEffect(() => { CartDB.all().then(setItems); }, []);

  // Add item to cart
  const add = async (product: any, quantity = 1) => {
    const existing = items.find(i => i.productId === product._id);
    const next = existing
      ? items.map(i => i.productId === product._id
          ? { ...i, quantity: i.quantity + quantity }
          : i)
      : [...items, {
          productId: product._id,
          title: product.title,
          price: product.price,
          quantity
        }];
    setItems(next); // update UI immediately
    await CartDB.put(next.find(i => i.productId === product._id)!);
  };

  // Remove item from cart
  const remove = async (productId: string) => {
    setItems(items.filter(i => i.productId !== productId));
    await CartDB.delete(productId);
  };

  // Checkout
  const checkout = async () => {
    const clientQueueId = uuid();
    const payload = items.map(i => ({
      productId: i.productId,
      quantity: i.quantity
    }));
    try {
      const res = await createOrder(payload, clientQueueId);
      if (!res.queued) {
        setItems([]);
        await CartDB.clear();
      }
      return res;
    } catch (e) {
      return { error: String(e) };
    }
  };

  return (
    <CartCtx.Provider value={{ items, add, remove, checkout, replayQueue }}>
      {children}
    </CartCtx.Provider>
  );
}