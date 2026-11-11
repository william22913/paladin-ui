import { api } from '../client';
import { normalizeCatalog, normalizeMoveToCart } from '../normalize';
import type { MoveToCartResult, Wishlist } from '../types';

export async function getWishlist(signal?: AbortSignal): Promise<Wishlist> {
  return normalizeCatalog(await api.get<unknown>('/wishlist', signal));
}

export async function saveApp(appId: number): Promise<Wishlist> {
  return normalizeCatalog(await api.post<unknown>('/wishlist/items', { app_id: appId }));
}

export async function removeApp(appId: number): Promise<Wishlist> {
  return normalizeCatalog(await api.delete<unknown>(`/wishlist/items/${appId}`));
}

export async function moveToCart(appId: number): Promise<MoveToCartResult> {
  return normalizeMoveToCart(
    await api.post<unknown>(`/wishlist/items/${appId}/move-to-cart`),
  );
}
