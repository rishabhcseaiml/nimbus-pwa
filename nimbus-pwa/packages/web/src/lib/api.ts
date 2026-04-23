/// <reference types="vite/client" />
import { QueueDB } from './db';
<<<<<<< HEAD

=======
>>>>>>> 14fa730 (fix: redeploy vercel blank page)
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export async function createOrder(
  items: { productId: string; quantity: number }[],
  clientQueueId: string
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Idempotency-Key': clientQueueId
  };
  const body = JSON.stringify({ items, clientQueueId });

  // If offline → save to queue instead
  if (!navigator.onLine) {
    await QueueDB.add({
      id: clientQueueId,
      type: 'checkout',
      payload: body,
      createdAt: Date.now()
    });
    return { queued: true };
  }

  // If online → send to server
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers,
    body,
    credentials: 'include'
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function replayQueue() {
  const all = await QueueDB.all();
  for (const job of all) {
    if (job.type === 'checkout') {
      const h: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      const payload = JSON.parse(job.payload);
      h['Idempotency-Key'] = payload.clientQueueId;
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: h,
        body: job.payload,
        credentials: 'include'
      });
      if (res.ok) await QueueDB.delete(job.id);
    }
  }
}
