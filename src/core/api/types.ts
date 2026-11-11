/**
 * DTOs for the Paladin `/api/v1` contract (architecture.md, `## Backend — Endpoints`).
 * No OpenAPI document was published for FEAT-001, so the frontend treats these
 * shapes as the agreed contract and normalizes only documented alternatives.
 */

export interface User {
  id: number;
  username: string;
}

export interface Category {
  slug: string;
  name: string;
}

export interface AppSummary {
  id: number;
  name: string;
  publisher: string;
  category: string;
  categorySlug: string;
  priceIdr: number;
  rating: number;
  coverUrl: string;
  isOwned: boolean;
  isInCart: boolean;
}

export interface AppDetail extends AppSummary {
  version: string;
  description: string;
  screenshots: string[];
  supportedOs: string[];
}

export interface CatalogResponse {
  apps: AppSummary[];
  count: number;
}

export interface CartItem {
  appId: number;
  name: string;
  publisher: string;
  category: string;
  priceIdr: number;
  coverUrl: string;
  isOwned: boolean;
}

export interface Cart {
  items: CartItem[];
  count: number;
  totalIdr: number;
}

export interface OrderItem {
  appId: number;
  name: string;
  coverUrl: string;
  priceIdr: number;
  licenseKey: string;
}

export interface Order {
  reference: string;
  createdAt: string;
  totalIdr: number;
  items: OrderItem[];
}

export interface LibraryEntry {
  appId: number;
  name: string;
  publisher: string;
  coverUrl: string;
  priceIdr: number;
  licenseKey: string;
  purchasedAt: string;
  orderReference: string;
}

export interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
    app_names?: string[];
  };
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly appNames: string[];

  constructor(status: number, code: string, message: string, appNames: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.appNames = appNames;
  }
}
