import { api } from '../client';
import { normalizeLibrary } from '../normalize';
import type { LibraryEntry } from '../types';

export async function getLibrary(signal?: AbortSignal): Promise<LibraryEntry[]> {
  return normalizeLibrary(await api.get<unknown>('/library', signal));
}
