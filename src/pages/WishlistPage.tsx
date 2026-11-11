import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, moveToCart, removeApp } from '../core/api/services/wishlist';
import type { AppSummary, Wishlist } from '../core/api/types';
import { useCart } from '../core/cart/CartProvider';
import { CART_FULL_MESSAGE } from '../core/cart/messages';
import { appCount } from '../core/format/format';
import { useAsync } from '../core/hooks/useAsync';
import {
  ALREADY_OWNED_MESSAGE,
  moveErrorMessage,
  removeErrorMessage,
} from '../core/wishlist/messages';
import { LoadError } from '../components/app/LoadError';
import { WishlistRow } from '../components/app/WishlistRow';
import { InlineNotice } from '../components/ui/InlineNotice';
import { LinkButton } from '../components/ui/LinkButton';
import { Skeleton } from '../components/ui/Skeleton';
import { StateBlock } from '../components/ui/StateBlock';
import { cx } from '../helpers/cx';
import styles from './pages.module.css';

type BusyAction = { appId: number; action: 'move' | 'remove' };
type RowMessage = { appId: number; text: string };
type Notice = { tone: 'success' | 'error'; text: string; showCart?: boolean };

function WishlistSkeleton() {
  return (
    <div className={cx('container', styles.page)}>
      <div className={styles.wishlistColumn}>
        <header className={styles.pageHead}>
          <h1 className={styles.pageTitle}>Wishlist</h1>
          <Skeleton className={styles.wishlistCountSkeleton} />
        </header>
        <div aria-busy="true" aria-label="Loading wishlist">
          {[0, 1, 2].map((key) => (
            <div key={key} className={styles.wishlistSkeletonRow}>
              <Skeleton className={styles.wishlistSkeletonCover} />
              <div className={styles.wishlistSkeletonText}>
                <Skeleton className={styles.wishlistSkeletonLine} />
                <Skeleton className={styles.wishlistSkeletonLineShort} />
              </div>
              <div className={styles.wishlistSkeletonSide}>
                <Skeleton className={styles.wishlistSkeletonPrice} />
                <Skeleton className={styles.wishlistSkeletonAction} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Wishlist: one 720px column, newest first as the API returns it, no sorting (REQ-008-REQ-016). */
export function WishlistPage() {
  const state = useAsync((signal) => getWishlist(signal), []);
  const { count: cartCount, replace } = useCart();
  const [list, setList] = useState<Wishlist | null>(null);
  const [busy, setBusy] = useState<BusyAction | null>(null);
  const [rowMessage, setRowMessage] = useState<RowMessage | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const apps = list?.apps ?? state.data?.apps ?? [];
  const count = list?.count ?? state.data?.count ?? apps.length;

  async function handleMove(app: AppSummary) {
    if (busy?.appId === app.id) return;
    setRowMessage(null);
    setNotice(null);
    if (app.isOwned) {
      setRowMessage({ appId: app.id, text: ALREADY_OWNED_MESSAGE });
      return;
    }
    if (cartCount >= 20) {
      setRowMessage({ appId: app.id, text: CART_FULL_MESSAGE });
      return;
    }
    setBusy({ appId: app.id, action: 'move' });
    try {
      const result = await moveToCart(app.id);
      setList(result.wishlist);
      replace(result.cart);
      setNotice({ tone: 'success', text: 'Moved to your cart.', showCart: true });
    } catch (error) {
      const text = moveErrorMessage(error);
      setRowMessage({ appId: app.id, text });
      setNotice({ tone: 'error', text });
    } finally {
      setBusy(null);
    }
  }

  async function handleRemove(app: AppSummary) {
    if (busy?.appId === app.id) return;
    setRowMessage(null);
    setNotice(null);
    setBusy({ appId: app.id, action: 'remove' });
    try {
      setList(await removeApp(app.id));
      setNotice({ tone: 'success', text: 'Removed from your wishlist.' });
    } catch (error) {
      const text = removeErrorMessage(error);
      setRowMessage({ appId: app.id, text });
      setNotice({ tone: 'error', text });
    } finally {
      setBusy(null);
    }
  }

  if (state.loading && !state.data) return <WishlistSkeleton />;

  if (state.error && !list) {
    return (
      <div className={cx('container', styles.page)}>
        <div className={styles.wishlistColumn}>
          <header className={styles.pageHead}>
            <h1 className={styles.pageTitle}>Wishlist</h1>
          </header>
          <LoadError onRetry={state.reload} />
        </div>
      </div>
    );
  }

  const cartFull = cartCount >= 20;
  const activeNotice = notice ?? (cartFull ? { tone: 'warning' as const, text: CART_FULL_MESSAGE } : null);

  return (
    <div className={cx('container', styles.page)}>
      <div className={styles.wishlistColumn}>
        <header className={styles.pageHead}>
          <h1 className={styles.pageTitle}>Wishlist</h1>
          <p className={styles.pageCount}>{appCount(count)}</p>
        </header>

        {activeNotice ? (
          <div className={cx(styles.inlineMessage, styles.wishlistNotice)}>
            <InlineNotice tone={activeNotice.tone}>
              {activeNotice.text}
              {'showCart' in activeNotice && activeNotice.showCart ? (
                <>
                  {' '}
                  <Link to="/cart" className={styles.noticeLink}>
                    View cart
                  </Link>
                </>
              ) : null}
            </InlineNotice>
          </div>
        ) : null}

        {apps.length === 0 ? (
          <StateBlock
            title="Your wishlist is empty."
            text="Save apps you want to come back to and they will appear here."
            actions={<LinkButton to="/">Browse the catalog</LinkButton>}
            centered
          />
        ) : (
          <ul className={styles.wishlistList}>
            {apps.map((app) => (
              <WishlistRow
                key={app.id}
                app={app}
                busyAction={busy?.appId === app.id ? busy.action : null}
                message={rowMessage?.appId === app.id ? rowMessage.text : ''}
                onMove={() => void handleMove(app)}
                onRemove={() => void handleRemove(app)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
