import { openDB } from 'idb';

export const dbPromise = openDB('nimbus', 1, {
  upgrade(db) {
    db.createObjectStore('cart', { keyPath: 'productId' });
    db.createObjectStore('queue', { keyPath: 'id' });
  }
});

export const CartDB = {
  async all() { return (await dbPromise).getAll('cart'); },
  async put(item: any) { return (await dbPromise).put('cart', item); },
  async delete(productId: string) { return (await dbPromise).delete('cart', productId); },
  async clear() { return (await dbPromise).clear('cart'); }
};

export const QueueDB = {
  async add(action: any) { return (await dbPromise).put('queue', action); },
  async all() { return (await dbPromise).getAll('queue'); },
  async delete(id: string) { return (await dbPromise).delete('queue', id); },
  async clear() { return (await dbPromise).clear('queue'); }
};