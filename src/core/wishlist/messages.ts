import { ApiError } from '../api/types';
import { CART_FULL_MESSAGE } from '../cart/messages';

export const SAVED_MESSAGE = 'Saved to your wishlist.';
export const REMOVED_MESSAGE = 'Removed from your wishlist.';
export const NOT_IN_CATALOG_MESSAGE = 'That app is no longer in the catalog.';
export const ALREADY_OWNED_MESSAGE = 'You already own this app.';

const SAVE_FAILED = 'That app could not be saved. Try again.';
const REMOVE_FAILED = 'That app could not be removed. Try again.';
const MOVE_FAILED = 'That app could not be moved to your cart. Try again.';

/** Maps documented wishlist failures to the visible inline copy (UIMap states). */
function actionErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    if (error.code === 'APP_NOT_FOUND') return NOT_IN_CATALOG_MESSAGE;
    if (error.code === 'CART_FULL') return CART_FULL_MESSAGE;
    if (error.code === 'ALREADY_OWNED') return ALREADY_OWNED_MESSAGE;
    if (error.status === 0) return error.message;
    return error.message || fallback;
  }
  return fallback;
}

export const saveErrorMessage = (error: unknown) => actionErrorMessage(error, SAVE_FAILED);
export const removeErrorMessage = (error: unknown) => actionErrorMessage(error, REMOVE_FAILED);
export const moveErrorMessage = (error: unknown) => actionErrorMessage(error, MOVE_FAILED);
