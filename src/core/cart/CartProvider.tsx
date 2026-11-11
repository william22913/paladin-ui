import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  addToCart as addRequest,
  getCart,
  removeFromCart as removeRequest,
} from '../api/services/cart';
import type { Cart } from '../api/types';
import { useAuth } from '../auth/AuthProvider';

interface CartContextValue {
  cart: Cart | null;
  count: number;
  loading: boolean;
  error: unknown;
  refresh: () => Promise<void>;
  add: (appId: number) => Promise<void>;
  remove: (appId: number) => Promise<void>;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  // No cart exists until the first fetch lands; starting at "not loading" lets
  // /checkout redirect to /cart before that fetch resolves.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCart(await getCart());
    } catch (caught) {
      setError(caught);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      void refresh();
    } else if (status === 'anonymous') {
      setCart(null);
    }
  }, [status, refresh]);

  const add = useCallback(async (appId: number) => {
    setCart(await addRequest(appId));
  }, []);

  const remove = useCallback(async (appId: number) => {
    setCart(await removeRequest(appId));
  }, []);

  const clear = useCallback(() => setCart(null), []);

  const value = useMemo(
    () => ({ cart, count: cart?.count ?? 0, loading, error, refresh, add, remove, clear }),
    [cart, loading, error, refresh, add, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
