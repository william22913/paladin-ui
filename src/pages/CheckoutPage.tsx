import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ApiError } from '../core/api/types';
import { checkout } from '../core/api/services/cart';
import { appCount } from '../core/format/format';
import { useCart } from '../core/cart/CartProvider';
import { ArtImage } from '../components/ui/ArtImage';
import { Button } from '../components/ui/Button';
import { InlineNotice } from '../components/ui/InlineNotice';
import { PriceLabel } from '../components/ui/PriceLabel';
import { Skeleton } from '../components/ui/Skeleton';
import { LoadError } from '../components/app/LoadError';
import { cx } from '../helpers/cx';
import appStyles from '../components/app/app.module.css';
import styles from './pages.module.css';

function joinNames(names: string[]): string {
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

/** Checkout: simulated payment, one order, idempotent submit (REQ-022 to REQ-026). */
export function CheckoutPage() {
  const { cart, loading, error, refresh, clear } = useCart();
  const navigate = useNavigate();
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [failure, setFailure] = useState<{ appNames: string[]; message: string } | null>(null);

  async function placeOrder() {
    if (submitting) return;
    setFailure(null);
    setSubmitting(true);
    try {
      const order = await checkout(idempotencyKey);
      setPlaced(true);
      clear();
      navigate(`/orders/${order.reference}?placed=1`, { replace: true });
    } catch (caught) {
      if (caught instanceof ApiError && caught.code === 'EMPTY_CART') {
        await refresh();
        navigate('/cart', { replace: true });
        return;
      }
      if (caught instanceof ApiError && caught.code === 'ALREADY_OWNED') {
        setFailure({
          appNames: caught.appNames,
          message: caught.message || 'An app in your cart is already owned.',
        });
      } else {
        setFailure({
          appNames: [],
          message:
            caught instanceof ApiError && caught.status === 0
              ? caught.message
              : 'The order could not be placed. Try again.',
        });
      }
      setSubmitting(false);
    }
  }

  if (loading && !cart) {
    return (
      <div className={cx('container', styles.page)} aria-busy="true" aria-label="Loading checkout">
        <Skeleton className={styles.pageTitleSkeleton} />
        <div className={styles.checkoutGrid}>
          <Skeleton className={styles.checkoutSkeletonLines} />
          <Skeleton className={styles.checkoutSkeletonSummary} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cx('container', styles.page)}>
        <LoadError onRetry={() => void refresh()} />
      </div>
    );
  }

  const items = cart?.items ?? [];
  if (placed) return null;
  if (!cart || items.length === 0) return <Navigate to="/cart" replace />;

  return (
    <div className={cx('container', styles.page)}>
      <Link to="/cart" className={styles.backLink}>
        Back to cart
      </Link>

      <header className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Checkout</h1>
        <p className={styles.pageCount}>{appCount(cart.count)}</p>
      </header>

      <div className={styles.checkoutGrid}>
        <section aria-labelledby="checkout-lines">
          <h2 id="checkout-lines" className="visually-hidden">
            Order lines
          </h2>
          <ul className={styles.checkoutLines}>
            {items.map((item) => (
              <li key={item.appId} className={styles.checkoutLine}>
                <div className={styles.checkoutCover}>
                  <ArtImage src={item.coverUrl} alt="" />
                </div>
                <div className={styles.checkoutName}>
                  <p>{item.name}</p>
                  <span>
                    {item.publisher} · {item.category} · 1 license
                  </span>
                </div>
                <PriceLabel value={item.priceIdr} />
              </li>
            ))}
          </ul>
        </section>

        <aside className={styles.checkoutSummary} aria-label="Order summary">
          <div className={appStyles.summaryRow}>
            <span>Subtotal</span>
            <PriceLabel value={cart.totalIdr} />
          </div>
          <div className={styles.checkoutTotal}>
            <span className={appStyles.summaryTotalLabel}>Total</span>
            <PriceLabel value={cart.totalIdr} large />
          </div>
          <p className={appStyles.summaryNote}>No tax or fees are added.</p>

          <InlineNotice tone="info">
            Payment is simulated in this version. No card details are collected.
          </InlineNotice>

          {failure ? (
            <InlineNotice tone="error">
              {failure.appNames.length > 0
                ? `You already own ${joinNames(failure.appNames)}. Remove them from your cart to continue.`
                : failure.message}
            </InlineNotice>
          ) : null}

          <Button block onClick={() => void placeOrder()} disabled={submitting}>
            {submitting ? 'Placing order' : 'Place order'}
          </Button>
        </aside>
      </div>
    </div>
  );
}
