import { api } from '../client';
import { normalizeUser } from '../normalize';
import type { User } from '../types';

export async function login(username: string, password: string): Promise<User> {
  // A rejected login is not a session expiry: do not let 401 trigger the global redirect.
  const payload = await api.post<unknown>('/auth/login', { username, password }, undefined, true);
  return normalizeUser(payload);
}

export async function logout(): Promise<void> {
  await api.post<void>('/auth/logout', undefined, undefined, true);
}

export async function getMe(signal?: AbortSignal): Promise<User> {
  const payload = await api.get<unknown>('/me', signal, true);
  return normalizeUser(payload);
}
