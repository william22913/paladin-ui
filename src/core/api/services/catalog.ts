import { api } from '../client';
import { normalizeAppDetail, normalizeCatalog, normalizeCategories } from '../normalize';
import type { AppDetail, CatalogResponse, Category } from '../types';

export async function getFeatured(signal?: AbortSignal): Promise<CatalogResponse> {
  return normalizeCatalog(await api.get<unknown>('/apps/featured', signal));
}

export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
  return normalizeCategories(await api.get<unknown>('/categories', signal));
}

export interface CatalogQuery {
  category?: string;
  q?: string;
}

export async function getApps(query: CatalogQuery, signal?: AbortSignal): Promise<CatalogResponse> {
  const params = new URLSearchParams();
  if (query.category) params.set('category', query.category);
  if (query.q) params.set('q', query.q);
  const suffix = params.size > 0 ? `?${params.toString()}` : '';
  return normalizeCatalog(await api.get<unknown>(`/apps${suffix}`, signal));
}

export async function getApp(appId: string, signal?: AbortSignal): Promise<AppDetail> {
  const payload = await api.get<unknown>(`/apps/${encodeURIComponent(appId)}`, signal);
  const record = payload as Record<string, unknown>;
  return normalizeAppDetail(
    record && typeof record.app === 'object' && record.app !== null
      ? (record.app as Record<string, unknown>)
      : record,
  );
}
