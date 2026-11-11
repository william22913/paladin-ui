import { api } from '../client';
import { normalizeCart, normalizeOrder } from '../normalize';
import type { Cart, Order } from '../types';

export async function getCart(signal?: AbortSignal): Promise<Cart> {
  return normalizeCart(await api.get<unknown>('/cart', signal));
}

export async function addToCart(appId: number): Promise<Cart> {
  return normalizeCart(await api.post<unknown>('/cart/items', { app_id: appId }));
}

export async function removeFromCart(appId: number): Promise<Cart> {
  return normalizeCart(await api.delete<unknown>(`/cart/items/${appId}`));
}

export async function checkout(idempotencyKey: string): Promise<Order> {
  return normalizeOrder(await api.post<unknown>('/checkout', { idempotency_key: idempotencyKey }));
}
