import { ApiError } from '../api/types';

export const CART_FULL_MESSAGE =
  'Your cart is full (20 apps). Remove one to add another.';

/** Maps documented add-to-cart failures to the visible inline copy (REQ-049). */
export function addErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === 'CART_FULL') return CART_FULL_MESSAGE;
    if (error.code === 'ALREADY_OWNED') return 'You already own this app.';
    if (error.status === 0) return error.message;
    return error.message || 'That app could not be added. Try again.';
  }
  return 'That app could not be added. Try again.';
}
