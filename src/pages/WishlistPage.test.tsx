import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { AppSummary } from '../core/api/types';
import { CART_FULL_MESSAGE } from '../core/cart/messages';
import { getWishlist, moveToCart, removeApp } from '../core/api/services/wishlist';
import { WishlistPage } from './WishlistPage';

const cart = vi.hoisted(() => ({ count: 0, replace: vi.fn() }));

vi.mock('../core/cart/CartProvider', () => ({
  useCart: () => cart,
}));

vi.mock('../core/api/services/wishlist', () => ({
  getWishlist: vi.fn(),
  moveToCart: vi.fn(),
  removeApp: vi.fn(),
}));

function app(overrides: Partial<AppSummary> = {}): AppSummary {
  return {
    id: 1,
    name: 'Cadence',
    publisher: 'Northline Audio',
    category: 'Audio',
    categorySlug: 'audio',
    priceIdr: 450000,
    rating: 4.8,
    coverUrl: '',
    isOwned: false,
    isInCart: false,
    isWishlisted: true,
    ...overrides,
  };
}

const cadence = app();
const meridian = app({
  id: 2,
  name: 'Meridian',
  publisher: 'Field Notes',
  category: 'Design',
  priceIdr: 0,
  isInCart: true,
});

const cartPayload = {
  items: [
    {
      appId: 2,
      name: 'Meridian',
      publisher: 'Field Notes',
      category: 'Design',
      priceIdr: 0,
      coverUrl: '',
      isOwned: false,
    },
  ],
  count: 1,
  totalIdr: 0,
};

function renderPage() {
  return render(
    <MemoryRouter>
      <WishlistPage />
    </MemoryRouter>,
  );
}

describe('WishlistPage', () => {
  beforeEach(() => {
    cart.count = 0;
    cart.replace.mockReset();
    vi.mocked(getWishlist).mockReset();
    vi.mocked(moveToCart).mockReset();
    vi.mocked(removeApp).mockReset();
    vi.mocked(getWishlist).mockResolvedValue({ apps: [cadence, meridian], count: 2 });
  });

  it('lists the apps and count in server order', async () => {
    renderPage();
    // Wait for the loaded list, not the skeleton, so the queried nodes survive.
    expect(await screen.findByText('2 apps')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Wishlist' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Cadence' })).toBeInTheDocument();
    expect(screen.getByText('Audio', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('FREE', { exact: true })).toBeInTheDocument();
  });

  it('blocks a move for an owned app without calling the API', async () => {
    vi.mocked(getWishlist).mockResolvedValue({ apps: [app({ isOwned: true })], count: 1 });
    renderPage();

    await userEvent.click(await screen.findByRole('button', { name: 'Move Cadence to cart' }));

    expect(screen.getByRole('alert')).toHaveTextContent('You already own this app.');
    expect(moveToCart).not.toHaveBeenCalled();
  });

  it('blocks a move when the cart already holds 20 apps', async () => {
    cart.count = 20;
    renderPage();

    await userEvent.click(await screen.findByRole('button', { name: 'Move Cadence to cart' }));

    expect(screen.getAllByText(CART_FULL_MESSAGE).length).toBeGreaterThan(0);
    expect(moveToCart).not.toHaveBeenCalled();
  });

  it('moves a row into the cart, replaces the cart state and offers the cart', async () => {
    vi.mocked(moveToCart).mockResolvedValue({
      wishlist: { apps: [meridian], count: 1 },
      cart: cartPayload,
    });
    renderPage();

    await userEvent.click(await screen.findByRole('button', { name: 'Move Cadence to cart' }));

    expect(moveToCart).toHaveBeenCalledWith(1);
    expect(cart.replace).toHaveBeenCalledWith(cartPayload);
    expect(screen.queryByRole('link', { name: 'Cadence' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Meridian' })).toBeInTheDocument();
    expect(screen.getByText('Moved to your cart.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View cart' })).toHaveAttribute('href', '/cart');
  });

  it('removes a row and keeps the rest of the list', async () => {
    vi.mocked(removeApp).mockResolvedValue({ apps: [meridian], count: 1 });
    renderPage();

    await userEvent.click(
      await screen.findByRole('button', { name: 'Remove Cadence from your wishlist' }),
    );

    expect(removeApp).toHaveBeenCalledWith(1);
    expect(screen.queryByRole('link', { name: 'Cadence' })).not.toBeInTheDocument();
    expect(screen.getByText('Removed from your wishlist.')).toBeInTheDocument();
    expect(screen.getByText('1 app')).toBeInTheDocument();
  });

  it('shows the empty state when nothing is saved', async () => {
    vi.mocked(getWishlist).mockResolvedValue({ apps: [], count: 0 });
    renderPage();

    expect(await screen.findByText('Your wishlist is empty.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse the catalog' })).toHaveAttribute('href', '/');
    expect(screen.getByText('0 apps')).toBeInTheDocument();
  });

  it('shows a readable load error with a retry', async () => {
    vi.mocked(getWishlist)
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ apps: [cadence], count: 1 });
    renderPage();

    expect(await screen.findByText('Could not load this.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('link', { name: 'Cadence' })).toBeInTheDocument();
    expect(getWishlist).toHaveBeenCalledTimes(2);
  });
});
