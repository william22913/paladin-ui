import type {
  AppDetail,
  AppSummary,
  Cart,
  CartItem,
  Category,
  LibraryEntry,
  MoveToCartResult,
  Order,
  OrderItem,
} from './types';

type Raw = Record<string, unknown>;

const asRecord = (value: unknown): Raw => (value && typeof value === 'object' ? (value as Raw) : {});
const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;
const asNumber = (value: unknown, fallback = 0): number => {
  const n = typeof value === 'string' ? Number(value) : value;
  return typeof n === 'number' && Number.isFinite(n) ? n : fallback;
};
const asBool = (value: unknown): boolean => value === true;

function categoryOf(raw: Raw): { name: string; slug: string } {
  const category = raw.category;
  if (category && typeof category === 'object') {
    const record = asRecord(category);
    return {
      name: asString(record.name, asString(record.slug)),
      slug: asString(record.slug),
    };
  }
  // The contract sends category as the slug plus a display category_name.
  const name = asString(raw.category_name, asString(category));
  return { name, slug: asString(raw.category_slug, asString(category).toLowerCase().replace(/\s+/g, '-')) };
}

function screenshotsOf(raw: Raw): string[] {
  const source = Array.isArray(raw.screenshots) ? raw.screenshots : [];
  return source
    .map((entry) =>
      typeof entry === 'string' ? entry : asString(asRecord(entry).url) || asString(entry),
    )
    .filter(Boolean);
}

function platformsOf(raw: Raw): string[] {
  const source = raw.supported_os ?? raw.platforms ?? [];
  return (Array.isArray(source) ? source : [])
    .map((entry) => (typeof entry === 'string' ? entry : asString(asRecord(entry).os)))
    .filter(Boolean);
}

export function normalizeApp(raw: Raw): AppSummary {
  const category = categoryOf(raw);
  return {
    id: asNumber(raw.id ?? raw.app_id),
    name: asString(raw.name),
    publisher: asString(raw.publisher),
    category: category.name,
    categorySlug: category.slug,
    priceIdr: asNumber(raw.price_idr),
    rating: asNumber(raw.rating),
    coverUrl: asString(raw.cover_url),
    isOwned: asBool(raw.is_owned),
    isInCart: asBool(raw.is_in_cart),
    isWishlisted: asBool(raw.is_wishlisted),
  };
}

export function normalizeAppDetail(raw: Raw): AppDetail {
  return {
    ...normalizeApp(raw),
    version: asString(raw.version),
    description: asString(raw.description),
    screenshots: screenshotsOf(raw),
    supportedOs: platformsOf(raw),
  };
}

export function normalizeCatalog(payload: unknown): { apps: AppSummary[]; count: number } {
  if (Array.isArray(payload)) {
    return { apps: payload.map((entry) => normalizeApp(asRecord(entry))), count: payload.length };
  }
  const record = asRecord(payload);
  const source = Array.isArray(record.apps) ? record.apps : [];
  return {
    apps: source.map((entry) => normalizeApp(asRecord(entry))),
    count: asNumber(record.count, source.length),
  };
}

export function normalizeCategories(payload: unknown): Category[] {
  const record = asRecord(payload);
  const source = Array.isArray(payload)
    ? payload
    : Array.isArray(record.categories)
      ? record.categories
      : [];
  return source.map((entry) => {
    const raw = asRecord(entry);
    return { slug: asString(raw.slug), name: asString(raw.name, asString(raw.slug)) };
  });
}

function normalizeCartItem(payload: unknown): CartItem {
  const raw = asRecord(payload);
  const app = raw.app && typeof raw.app === 'object' ? asRecord(raw.app) : raw;
  const category = categoryOf(app);
  return {
    appId: asNumber(app.id ?? app.app_id ?? raw.app_id),
    name: asString(app.name),
    publisher: asString(app.publisher),
    category: category.name,
    priceIdr: asNumber(app.price_idr ?? raw.price_idr),
    coverUrl: asString(app.cover_url ?? raw.cover_url),
    isOwned: asBool(app.is_owned ?? raw.is_owned),
  };
}

export function normalizeCart(payload: unknown): Cart {
  const record = asRecord(payload);
  const items = (Array.isArray(record.items) ? record.items : []).map(normalizeCartItem);
  return {
    items,
    count: asNumber(record.count, items.length),
    totalIdr: asNumber(record.total_idr),
  };
}

function normalizeOrderItem(payload: unknown): OrderItem {
  const raw = asRecord(payload);
  const app = raw.app && typeof raw.app === 'object' ? asRecord(raw.app) : raw;
  return {
    appId: asNumber(app.id ?? app.app_id ?? raw.app_id),
    name: asString(app.name),
    coverUrl: asString(app.cover_url ?? raw.cover_url),
    priceIdr: asNumber(raw.price_idr ?? app.price_idr),
    licenseKey: asString(raw.license_key ?? raw.key),
  };
}

export function normalizeOrder(payload: unknown): Order {
  const record = asRecord(payload);
  const source = record.order && typeof record.order === 'object' ? asRecord(record.order) : record;
  const items = (Array.isArray(source.items) ? source.items : []).map(normalizeOrderItem);
  return {
    reference: asString(source.reference ?? source.order_reference),
    createdAt: asString(source.created_at ?? source.order_date),
    totalIdr: asNumber(source.total_idr),
    items,
  };
}

/** Move returns both resources so one response refreshes the list and the cart badge. */
export function normalizeMoveToCart(payload: unknown): MoveToCartResult {
  const record = asRecord(payload);
  return {
    wishlist: normalizeCatalog(record.wishlist),
    cart: normalizeCart(record.cart),
  };
}

export function normalizeOrders(payload: unknown): Order[] {
  const source = Array.isArray(payload) ? payload : asRecord(payload).orders;
  return (Array.isArray(source) ? source : []).map(normalizeOrder);
}

export function normalizeLibrary(payload: unknown): LibraryEntry[] {
  const record = asRecord(payload);
  const source = Array.isArray(payload)
    ? payload
    : Array.isArray(record.apps)
      ? record.apps
      : Array.isArray(record.items)
        ? record.items
        : [];
  return source.map((entry) => {
    const raw = asRecord(entry);
    const app = raw.app && typeof raw.app === 'object' ? asRecord(raw.app) : raw;
    return {
      appId: asNumber(app.id ?? app.app_id ?? raw.app_id),
      name: asString(app.name),
      publisher: asString(app.publisher),
      coverUrl: asString(app.cover_url ?? raw.cover_url),
      priceIdr: asNumber(raw.price_idr ?? app.price_idr),
      licenseKey: asString(raw.license_key ?? raw.key),
      purchasedAt: asString(raw.purchased_at ?? raw.created_at ?? raw.order_date),
      orderReference: asString(raw.order_reference ?? raw.reference),
    };
  });
}

export function normalizeUser(payload: unknown): { id: number; username: string } {
  const record = asRecord(payload);
  const source = record.user && typeof record.user === 'object' ? asRecord(record.user) : record;
  return { id: asNumber(source.id), username: asString(source.username) };
}
