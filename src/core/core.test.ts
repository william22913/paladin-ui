import { describe, expect, it } from 'vitest';
import { ApiError } from './api/types';
import { normalizeCart, normalizeOrder, normalizeOrders } from './api/normalize';
import { addErrorMessage, CART_FULL_MESSAGE } from './cart/messages';
import { formatIdr } from './format/format';
import { safeNext } from './auth/AuthProvider';

describe('formatIdr', () => {
  it('renders IDR with separators', () => {
    expect(formatIdr(125000)).toBe('Rp 125.000');
  });

  it('renders zero and invalid values as FREE', () => {
    expect(formatIdr(0)).toBe('FREE');
    expect(formatIdr(Number.NaN)).toBe('FREE');
  });
});

describe('safeNext', () => {
  it('keeps same-origin paths', () => {
    expect(safeNext('/cart?x=1')).toBe('/cart?x=1');
  });

  it('rejects protocol-relative, absolute and empty values', () => {
    expect(safeNext(null)).toBe('/');
    expect(safeNext('//evil.example')).toBe('/');
    expect(safeNext('https://evil.example')).toBe('/');
  });
});

describe('normalizers', () => {
  it('maps a cart payload and its totals', () => {
    const cart = normalizeCart({
      items: [{ app: { id: 3, name: 'Nova', price_idr: 90000 }, app_id: 3 }],
      count: 1,
      total_idr: 90000,
    });
    expect(cart.items[0]).toMatchObject({ appId: 3, name: 'Nova', priceIdr: 90000 });
    expect(cart.count).toBe(1);
    expect(cart.totalIdr).toBe(90000);
  });

  it('unwraps an order envelope and its license keys', () => {
    const order = normalizeOrder({
      order: {
        reference: 'PLD-1',
        created_at: '2026-11-11T10:00:00Z',
        total_idr: 50000,
        items: [{ app_id: 7, name: 'Vela', license_key: 'KEY-7', price_idr: 50000 }],
      },
    });
    expect(order.reference).toBe('PLD-1');
    expect(order.items[0]).toMatchObject({ appId: 7, licenseKey: 'KEY-7' });
    expect(normalizeOrders({ orders: [{ reference: 'PLD-1' }] })).toHaveLength(1);
  });
});

describe('addErrorMessage', () => {
  it('uses the cart-full copy for CART_FULL', () => {
    expect(addErrorMessage(new ApiError(409, 'CART_FULL', 'full'))).toBe(CART_FULL_MESSAGE);
  });

  it('uses the owned copy for ALREADY_OWNED', () => {
    expect(addErrorMessage(new ApiError(409, 'ALREADY_OWNED', 'owned'))).toBe(
      'You already own this app.',
    );
  });

  it('falls back for unknown errors', () => {
    expect(addErrorMessage(new Error('boom'))).toBe('That app could not be added. Try again.');
  });
});
