import { expect, test, type Page } from '@playwright/test';

interface MockApp {
  id: number;
  name: string;
  publisher: string;
  category: string;
  category_slug: string;
  price_idr: number;
  rating: number;
  cover_url: string;
  is_owned: boolean;
  is_in_cart: boolean;
}

const APPS: MockApp[] = [
  {
    id: 1,
    name: 'Cadence',
    publisher: 'Northline Audio',
    category: 'Audio',
    category_slug: 'audio',
    price_idr: 450000,
    rating: 4.8,
    cover_url: 'https://picsum.photos/seed/cadence/600/800',
    is_owned: false,
    is_in_cart: false,
  },
  {
    id: 2,
    name: 'Meridian',
    publisher: 'Field Notes',
    category: 'Design',
    category_slug: 'design',
    price_idr: 0,
    rating: 4.5,
    cover_url: 'https://picsum.photos/seed/meridian/600/800',
    is_owned: false,
    is_in_cart: false,
  },
  {
    id: 3,
    name: 'Kiln',
    publisher: 'Kiln Works',
    category: 'Design',
    category_slug: 'design',
    price_idr: 275000,
    rating: 4.2,
    cover_url: 'https://picsum.photos/seed/kiln/600/800',
    is_owned: true,
    is_in_cart: false,
  },
];

const CATEGORIES = [
  { slug: 'audio', name: 'Audio' },
  { slug: 'design', name: 'Design' },
  { slug: 'utility', name: 'Utility' },
];

interface State {
  authed: boolean;
  cart: number[];
  lastLogin?: { username: string; password: string };
  /** Checkout fails as if an owned app slipped into the cart. */
  ownedAtCheckout?: string[];
  /** Library and Orders respond empty. */
  emptyLists?: boolean;
}

function cartPayload(state: State) {
  const items = state.cart.map((id) => {
    const app = APPS.find((entry) => entry.id === id)!;
    return { app, app_id: app.id };
  });
  return {
    items,
    count: items.length,
    total_idr: items.reduce((sum, item) => sum + item.app.price_idr, 0),
  };
}

function orderPayload(ids: number[]) {
  return {
    order: {
      reference: 'PLD-1042',
      created_at: '2026-11-11T09:00:00Z',
      total_idr: ids.reduce(
        (sum, id) => sum + (APPS.find((app) => app.id === id)?.price_idr ?? 0),
        0,
      ),
      items: ids.map((id) => {
        const app = APPS.find((entry) => entry.id === id)!;
        return {
          app,
          app_id: app.id,
          price_idr: app.price_idr,
          license_key: `PAL-${app.name.toUpperCase()}-KEY`,
        };
      }),
    },
  };
}

const json = (body: unknown, status = 200) => ({
  status,
  contentType: 'application/json',
  body: JSON.stringify(body),
});

async function mockApi(page: Page) {
  const state: State = { authed: false, cart: [] };

  await page.route('https://picsum.photos/**', (route) => route.abort());
  await page.route('**/api/v1/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace('/api/v1', '');
    const method = request.method();

    if (path === '/me') {
      return route.fulfill(
        state.authed ? json({ user: { id: 1, username: 'ada' } }) : json({ error: { code: 'UNAUTHORIZED', message: 'Sign in.' } }, 401),
      );
    }
    if (path === '/auth/login' && method === 'POST') {
      const body = request.postDataJSON() as { username: string; password: string };
      state.lastLogin = body;
      if (body.username !== 'ada' || body.password !== 'correct-horse') {
        return route.fulfill(
          json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password.' } }, 401),
        );
      }
      state.authed = true;
      return route.fulfill(json({ user: { id: 1, username: 'ada' } }));
    }
    if (path === '/auth/logout') {
      state.authed = false;
      return route.fulfill({ status: 204, body: '' });
    }
    if (!state.authed) {
      return route.fulfill(json({ error: { code: 'UNAUTHORIZED', message: 'Sign in.' } }, 401));
    }
    if (path === '/apps/featured') return route.fulfill(json({ apps: APPS.slice(0, 2) }));
    if (path === '/categories') return route.fulfill(json({ categories: CATEGORIES }));
    if (path === '/apps' && method === 'GET') {
      const q = (url.searchParams.get('q') ?? '').toLowerCase();
      const category = url.searchParams.get('category');
      const apps = APPS.filter(
        (app) =>
          (!category || app.category_slug === category) &&
          (!q || app.name.toLowerCase().includes(q)),
      );
      return route.fulfill(json({ apps, count: apps.length }));
    }
    if (/^\/apps\/\d+$/.test(path)) {
      const id = Number(path.split('/').pop());
      const app = APPS.find((entry) => entry.id === id);
      if (!app) return route.fulfill(json({ error: { code: 'NOT_FOUND', message: 'Nope' } }, 404));
      return route.fulfill(
        json({
          app: {
            ...app,
            version: '2.4',
            description: 'A deliberate instrument for people who listen closely.',
            screenshots: [
              'https://picsum.photos/seed/cadence-screen-1/1600/900',
              'https://picsum.photos/seed/cadence-screen-2/1600/900',
            ],
            supported_os: ['macOS', 'Windows'],
          },
        }),
      );
    }
    if (path === '/cart' && method === 'GET') return route.fulfill(json(cartPayload(state)));
    if (path === '/cart/items' && method === 'POST') {
      if (state.cart.length >= 20) {
        return route.fulfill(json({ error: { code: 'CART_FULL' } }, 409));
      }
      const { app_id } = request.postDataJSON() as { app_id: number };
      if (!state.cart.includes(app_id)) state.cart.push(app_id);
      return route.fulfill(json(cartPayload(state)));
    }
    if (path.startsWith('/cart/items/') && method === 'DELETE') {
      const id = Number(path.split('/').pop());
      state.cart = state.cart.filter((entry) => entry !== id);
      return route.fulfill(json(cartPayload(state)));
    }
    if (path === '/checkout' && method === 'POST') {
      if (state.ownedAtCheckout) {
        return route.fulfill(
          json(
            {
              error: {
                code: 'ALREADY_OWNED',
                message: 'An app in your cart is already owned.',
                app_names: state.ownedAtCheckout,
              },
            },
            409,
          ),
        );
      }
      const order = orderPayload(state.cart);
      state.cart = [];
      return route.fulfill(json(order, 201));
    }
    if (path === '/library') {
      if (state.emptyLists) return route.fulfill(json({ apps: [] }));
      return route.fulfill(
        json({
          apps: [
            {
              app: APPS[2],
              license_key: 'PAL-KILN-KEY',
              purchased_at: '2026-10-02T10:00:00Z',
              order_reference: 'PLD-1001',
            },
          ],
        }),
      );
    }
    if (path === '/orders') {
      return route.fulfill(json({ orders: state.emptyLists ? [] : [orderPayload([1]).order] }));
    }
    if (path === '/orders/PLD-1042') return route.fulfill(json(orderPayload([1])));
    return route.fulfill(json({ error: { code: 'NOT_FOUND', message: path } }, 404));
  });

  return state;
}

async function signIn(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Username').fill('ada');
  await page.getByLabel('Password', { exact: true }).fill('correct-horse');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL('/');
}

function watchConsole(page: Page) {
  const errors: string[] = [];
  page.on('console', (message) => {
    // Aborted mock art and the expected /me 401 are network noise, not app errors.
    if (message.type() === 'error' && !message.text().includes('Failed to load resource')) {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

test('anonymous visits are redirected to login with a safe next path', async ({ page }) => {
  await mockApi(page);
  await page.goto('/library');
  await expect(page).toHaveURL('/login?next=%2Flibrary');
});

test('login sends credentials and lands on the catalog', async ({ page }) => {
  const state = await mockApi(page);
  await page.goto('/login');
  await page.getByLabel('Username').fill('ada');
  await page.getByLabel('Password', { exact: true }).fill('correct-horse');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: /Software for/ })).toBeVisible();
  expect(state.lastLogin).toEqual({ username: 'ada', password: 'correct-horse' });
});

test('search debounces into a q request and filters the grid', async ({ page }) => {
  await mockApi(page);
  await signIn(page);

  const request = page.waitForRequest((req) => req.url().includes('/api/v1/apps?q=mer'));
  await page.getByLabel('Search apps by name').fill('mer');
  await request;
  const catalog = page.getByRole('region', { name: 'Find an app' });
  await expect(catalog.getByRole('link', { name: 'View Meridian' })).toBeVisible();
  await expect(page.getByText('1 app for "mer"')).toBeVisible();
});

test('add to cart updates the badge, cart and checkout', async ({ page }) => {
  await mockApi(page);
  await signIn(page);

  await page
    .getByRole('region', { name: 'Find an app' })
    .getByRole('button', { name: 'Add Cadence to cart' })
    .click();
  await expect(page.getByRole('link', { name: 'Cart, 1 app' })).toBeVisible();

  await page.goto('/cart');
  await expect(page.getByRole('link', { name: 'Cadence', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Proceed to checkout' }).click();
  await expect(page).toHaveURL('/checkout');

  await page.getByRole('button', { name: 'Place order' }).click();
  await expect(page).toHaveURL('/orders/PLD-1042?placed=1');
  await expect(page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible();
  await expect(page.getByText('PAL-CADENCE-KEY')).toBeVisible();
});

test('owned apps show their library state instead of add to cart', async ({ page }) => {
  await mockApi(page);
  await signIn(page);

  await expect(page.getByRole('link', { name: 'View Kiln' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Cart', exact: true })).toBeVisible();
  await expect(page.getByText('Owned', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add Kiln to cart' })).toHaveCount(0);
});

test('no console errors across the core pages', async ({ page }) => {
  const errors = watchConsole(page);
  await mockApi(page);
  await signIn(page);
  for (const path of ['/apps/1', '/cart', '/library', '/orders', '/orders/PLD-1042']) {
    await page.goto(path);
    await expect(page.locator('h1')).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('login rejects invalid credentials and field sizes on the page', async ({ page }) => {
  await mockApi(page);
  await page.goto('/login');
  const username = page.getByLabel('Username');
  const password = page.getByLabel('Password', { exact: true });
  const submit = page.getByRole('button', { name: 'Sign in' });

  await username.fill('ada');
  await password.fill('wrong-password');
  await submit.click();
  await expect(page.getByRole('alert')).toHaveText('Invalid username or password.');

  await username.fill('no_such_user');
  await password.fill('wrong-password');
  await submit.click();
  await expect(page.getByRole('alert')).toHaveText('Invalid username or password.');

  await username.fill('');
  await submit.click();
  await expect(page.getByText('Enter your username.')).toBeVisible();
  await expect(page.getByText('Enter your password.')).toBeVisible();

  await username.fill('ab');
  await password.fill('Pass1234');
  await submit.click();
  await expect(page.getByText('Username must be 3 to 50 characters.')).toBeVisible();

  await username.fill('a'.repeat(51));
  await submit.click();
  await expect(page.getByText('Username must be 3 to 50 characters.')).toBeVisible();

  await username.fill('ada');
  await password.fill('Pass123');
  await submit.click();
  await expect(page.getByText('Password must be at least 8 characters.')).toBeVisible();

  await expect(page).toHaveURL('/login');
});

test('deep link returns to the requested page after login', async ({ page }) => {
  await mockApi(page);
  await page.goto('/library');
  await expect(page).toHaveURL('/login?next=%2Flibrary');

  await page.getByLabel('Username').fill('ada');
  await page.getByLabel('Password', { exact: true }).fill('correct-horse');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL('/library');
  await expect(page.getByRole('heading', { name: 'My Library' })).toBeVisible();
});

test('logout clears the session and browser back does not restore it', async ({ page }) => {
  await mockApi(page);
  await signIn(page);

  // A real in-app navigation first, so Back has a history entry to try.
  await page
    .getByRole('navigation', { name: 'Footer' })
    .getByRole('link', { name: 'My Library' })
    .click();
  await expect(page).toHaveURL('/library');

  await page.getByRole('button', { name: 'Menu' }).click();
  await page
    .getByRole('dialog', { name: 'Menu' })
    .getByRole('button', { name: 'Sign out' })
    .click();
  await expect(page).toHaveURL('/login');

  await page.goBack();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});

test('search and category empty states, including an unknown URL category', async ({ page }) => {
  await mockApi(page);
  await signIn(page);
  const catalog = page.getByRole('region', { name: 'Find an app' });

  await page.getByLabel('Search apps by name').fill('zzzznotreal');
  await expect(page.getByText('No apps match "zzzznotreal".')).toBeVisible();
  await page.locator('button', { hasText: 'Clear search' }).click();
  await expect(catalog.getByRole('link', { name: 'View Cadence' })).toBeVisible();

  await page.getByRole('button', { name: 'Utility' }).click();
  await expect(page.getByText('No apps in Utility yet.')).toBeVisible();
  await page.getByRole('button', { name: 'View all apps' }).click();
  await expect(catalog.getByRole('link', { name: 'View Cadence' })).toBeVisible();

  await page.goto('/?category=does-not-exist');
  await expect(catalog.getByRole('link', { name: 'View Cadence' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
});

test('clearing a search keeps the selected category', async ({ page }) => {
  await mockApi(page);
  await signIn(page);
  const catalog = page.getByRole('region', { name: 'Find an app' });

  await page.getByRole('button', { name: 'Design' }).click();
  await page.getByLabel('Search apps by name').fill('mer');
  await expect(catalog.getByRole('link', { name: 'View Meridian' })).toBeVisible();
  await page.getByLabel('Clear search').click();

  await expect(page.getByRole('button', { name: 'Design' })).toHaveAttribute('aria-pressed', 'true');
  await expect(catalog.getByRole('link', { name: 'View Meridian' })).toBeVisible();
  await expect(catalog.getByRole('link', { name: 'View Kiln' })).toBeVisible();
});

test('removing one cart line keeps the other and updates the total', async ({ page }) => {
  await mockApi(page);
  await signIn(page);
  const catalog = page.getByRole('region', { name: 'Find an app' });
  await catalog.getByRole('button', { name: 'Add Cadence to cart' }).click();
  await catalog.getByRole('button', { name: 'Add Meridian to cart' }).click();

  await page.goto('/cart');
  await expect(page.getByRole('link', { name: 'Cadence', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Meridian', exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Remove Cadence from cart' }).click();
  await expect(page.getByRole('link', { name: 'Cadence', exact: true })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Meridian', exact: true })).toBeVisible();
  await expect(page.getByText('FREE', { exact: true }).first()).toBeVisible();
});

test('an empty cart blocks checkout and returns to the cart', async ({ page }) => {
  await mockApi(page);
  await signIn(page);
  await page.goto('/checkout');
  await expect(page).toHaveURL('/cart');
  await expect(page.getByText('Your cart is empty.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Proceed to checkout' })).toHaveCount(0);
});

test('checkout names already-owned apps and does not empty the cart', async ({ page }) => {
  const state = await mockApi(page);
  await signIn(page);
  await page
    .getByRole('region', { name: 'Find an app' })
    .getByRole('button', { name: 'Add Cadence to cart' })
    .click();
  state.ownedAtCheckout = ['Cadence'];

  await page.goto('/checkout');
  await page.getByRole('button', { name: 'Place order' }).click();
  await expect(
    page.getByText('You already own Cadence. Remove them from your cart to continue.'),
  ).toBeVisible();
  await expect(page).toHaveURL('/checkout');

  await page.goto('/cart');
  await expect(page.getByRole('link', { name: 'Cadence', exact: true })).toBeVisible();
});

test('library and orders show empty states with no purchases', async ({ page }) => {
  const state = await mockApi(page);
  await signIn(page);
  state.emptyLists = true;

  await page.goto('/library');
  await expect(page.getByText('Your library is empty.')).toBeVisible();
  await page.goto('/orders');
  await expect(page.getByText('No orders yet.')).toBeVisible();
});

test('unknown app and order ids show not-found states', async ({ page }) => {
  await mockApi(page);
  await signIn(page);

  await page.goto('/apps/99999999');
  await expect(page.getByText('App not found')).toBeVisible();

  await page.goto('/apps/abc');
  await expect(page.getByText('App not found')).toBeVisible();

  await page.goto('/orders/ORD-A');
  await expect(page.getByText('Order not found')).toBeVisible();
});

test('an owned app stays visible and its detail offers the library instead of add to cart', async ({ page }) => {
  await mockApi(page);
  await signIn(page);

  await page.goto('/apps/3');
  await expect(page.getByRole('heading', { name: 'Kiln', level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: 'View in my library' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add to cart' })).toHaveCount(0);
});

test('an expired session redirects to login and keeps the next path', async ({ page }) => {
  const state = await mockApi(page);
  await signIn(page);
  state.authed = false;

  await page
    .getByRole('navigation', { name: 'Footer' })
    .getByRole('link', { name: 'My Library' })
    .click();

  await expect(page).toHaveURL('/login?next=%2Flibrary&reason=expired');
  await expect(page.getByText('Your session expired. Sign in to continue.')).toBeVisible();
});

test('screenshots', async ({ page }, testInfo) => {
  await mockApi(page);
  await page.goto('/login');
  await page.screenshot({ path: testInfo.outputPath('login.png'), fullPage: true, animations: 'disabled' });

  await signIn(page);
  await expect(page.getByRole('heading', { name: 'Find an app' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('home.png'), fullPage: true, animations: 'disabled' });

  await page.goto('/apps/1');
  await expect(page.getByRole('heading', { name: 'Cadence', level: 1 })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('detail.png'), fullPage: true, animations: 'disabled' });

  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.goto('/cart');
  await expect(page.getByRole('heading', { name: 'Cart' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Proceed to checkout' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('cart.png'), fullPage: true, animations: 'disabled' });

  await page.goto('/checkout');
  await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('checkout.png'), fullPage: true, animations: 'disabled' });

  await page.goto('/library');
  await expect(page.getByRole('heading', { name: 'My Library' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('library.png'), fullPage: true, animations: 'disabled' });

  await page.goto('/orders');
  await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('orders.png'), fullPage: true, animations: 'disabled' });
});
