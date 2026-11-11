import { api } from '../client';
import { normalizeOrder, normalizeOrders } from '../normalize';
import type { Order } from '../types';

export async function getOrders(signal?: AbortSignal): Promise<Order[]> {
  return normalizeOrders(await api.get<unknown>('/orders', signal));
}

export async function getOrder(reference: string, signal?: AbortSignal): Promise<Order> {
  const payload = await api.get<unknown>(`/orders/${encodeURIComponent(reference)}`, signal);
  return normalizeOrder(payload);
}
