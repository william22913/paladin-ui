import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AppSummary } from '../../core/api/types';
import { ApiError } from '../../core/api/types';
import { removeApp, saveApp } from '../../core/api/services/wishlist';
import { NOT_IN_CATALOG_MESSAGE } from '../../core/wishlist/messages';
import { WishlistButton } from './WishlistButton';

vi.mock('../../core/api/services/wishlist', () => ({
  saveApp: vi.fn(),
  removeApp: vi.fn(),
}));

const app: AppSummary = {
  id: 6,
  name: 'Terminus',
  publisher: 'Hinterland Dev',
  category: 'Developer Tools',
  categorySlug: 'developer-tools',
  priceIdr: 250000,
  rating: 4.6,
  coverUrl: '',
  isOwned: false,
  isInCart: false,
  isWishlisted: false,
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const emptyWishlist = { apps: [], count: 0 };

describe('WishlistButton', () => {
  beforeEach(() => {
    vi.mocked(saveApp).mockReset();
    vi.mocked(removeApp).mockReset();
  });

  it('toggles to saved before the request resolves', async () => {
    const request = deferred<typeof emptyWishlist>();
    vi.mocked(saveApp).mockReturnValue(request.promise);
    const onError = vi.fn();
    render(<WishlistButton app={app} onError={onError} />);

    const button = screen.getByRole('button', { name: 'Save Terminus to your wishlist' });
    await userEvent.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('button', { name: 'Remove Terminus from your wishlist' })).toBe(
      button,
    );

    request.resolve(emptyWishlist);
    expect(await screen.findByText('Saved to your wishlist.')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-busy', 'false');
    expect(onError).toHaveBeenLastCalledWith('');
  });

  it('reverts a failed save and reports the readable reason', async () => {
    vi.mocked(saveApp).mockRejectedValue(new ApiError(404, 'APP_NOT_FOUND', 'gone'));
    const onError = vi.fn();
    render(<WishlistButton app={app} onError={onError} />);

    const button = screen.getByRole('button', { name: 'Save Terminus to your wishlist' });
    await userEvent.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(onError).toHaveBeenLastCalledWith(NOT_IN_CATALOG_MESSAGE);
  });

  it('removes a saved app and uses the block labels', async () => {
    vi.mocked(removeApp).mockResolvedValue(emptyWishlist);
    render(
      <WishlistButton app={{ ...app, isWishlisted: true }} variant="block" onError={vi.fn()} />,
    );

    const button = screen.getByRole('button', { name: 'Saved to wishlist' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveTextContent('Save to wishlist');
    expect(await screen.findByText('Removed from your wishlist.')).toBeInTheDocument();
  });

  it('ignores repeat presses while the request runs', async () => {
    const request = deferred<typeof emptyWishlist>();
    vi.mocked(saveApp).mockReturnValue(request.promise);
    render(<WishlistButton app={app} onError={vi.fn()} />);

    const button = screen.getByRole('button', { name: 'Save Terminus to your wishlist' });
    await userEvent.click(button);
    await userEvent.click(button);

    expect(saveApp).toHaveBeenCalledTimes(1);
    request.resolve(emptyWishlist);
    expect(await screen.findByText('Saved to your wishlist.')).toBeInTheDocument();
  });
});
