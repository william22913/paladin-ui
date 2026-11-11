import { useState } from 'react';
import { useCart } from '../core/cart/CartProvider';
import { appCount } from '../core/format/format';
import { CartLine } from '../components/app/CartLine';
import { CartSummary } from '../components/app/CartSummary';
import { LoadError } from '../components/app/LoadError';
import { InlineNotice } from '../components/ui/InlineNotice';
import { LinkButton } from '../components/ui/LinkButton';
import { Skeleton } from '../components/ui/Skeleton';
import { StateBlock } from '../components/ui/StateBlock';
import { cx } from '../helpers/cx';
import styles from './pages.module.css';

function CartSkeleton() {
  return (
    <div className={cx('container', styles.page)} aria-busy="true" aria-label="Loading cart">
      <Skeleton className={styles.pageTitleSkeleton} />
      <div className={styles.cartGrid}>
        <div>
          {[0, 1, 2].map((key) => (
            <div key={key} className={styles.cartSkeletonLine}>
              <Skeleton className={styles.cartSkeletonCover} />
              <Skeleton className={styles.cartSkeletonText} />
            </div>
          ))}
        </div>
        <Skeleton className={styles.cartSkeletonSummary} />
      </div>
    </div>
  );
}

/** Cart: one license per line, remove, IDR total, no tax or fees (REQ-015 to REQ-021). */
export function CartPage() {
  const { cart, loading, error, refresh, remove } = useCart();
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  async function handleRemove(appId: number) {
    if (removingId !== null) return;
    setMessage('');
    setRemovingId(appId);
    try {
      await remove(appId);
    } catch {
      setMessage('That app could not be removed. Try again.');
    } finally {
      setRemovingId(null);
    }
  }

  if (loading && !cart) return <CartSkeleton />;

  if (error) {
    return (
      <div className={cx('container', styles.page)}>
        <LoadError onRetry={() => void refresh()} />
      </div>
    );
  }

  const items = cart?.items ?? [];
  const count = cart?.count ?? items.length;
  const total = cart?.totalIdr ?? 0;

  if (items.length === 0) {
    return (
      <div className={cx('container', styles.page)}>
        <header className={styles.pageHead}>
          <h1 className={styles.pageTitle}>Cart</h1>
          <p className={styles.pageCount}>{appCount(0)}</p>
        </header>
        <StateBlock
          title="Your cart is empty."
          text="Browse the catalog and add a license to get started."
          actions={<LinkButton to="/">Browse the catalog</LinkButton>}
          centered
        />
      </div>
    );
  }

  return (
    <div className={cx('container', styles.page)}>
      <header className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Cart</h1>
        <p className={styles.pageCount}>
          {count >= 20 ? `${count} of 20 apps` : appCount(count)}
        </p>
      </header>

      {count >= 20 ? (
        <InlineNotice tone="warning">
          Your cart is full. Remove an app to add another.
        </InlineNotice>
      ) : null}

      {message ? (
        <div className={styles.inlineMessage}>
          <InlineNotice tone="error">{message}</InlineNotice>
        </div>
      ) : null}

      <div className={styles.cartGrid}>
        <ul className={styles.cartList}>
          {items.map((item) => (
            <CartLine
              key={item.appId}
              item={item}
              removing={removingId === item.appId}
              onRemove={() => void handleRemove(item.appId)}
            />
          ))}
        </ul>
        <div className={styles.cartAside}>
          <CartSummary count={count} totalIdr={total} />
        </div>
      </div>
    </div>
  );
}
