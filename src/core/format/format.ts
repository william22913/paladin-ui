const idr = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });
const date = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/** REQ-034 / REQ-042: IDR with thousands separators; zero renders as FREE. */
export function formatIdr(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return 'FREE';
  return `Rp ${idr.format(value)}`;
}

/** Absolute order / purchase date, e.g. 11 November 2026. */
export function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return date.format(parsed);
}

export function appCount(count: number): string {
  return `${count} ${count === 1 ? 'app' : 'apps'}`;
}

export function orderCount(count: number): string {
  return `${count} ${count === 1 ? 'order' : 'orders'}`;
}
