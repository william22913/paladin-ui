import { useParams, useSearchParams } from 'react-router-dom';
import { Check, Copy } from 'lucide-react';
import { getOrder } from '../core/api/services/orders';
import { formatDate } from '../core/format/format';
import { useAsync } from '../core/hooks/useAsync';
import { isNotFound } from '../core/hooks/useApiError';
import { useCopy } from '../core/hooks/useCopy';
import { ArtImage } from '../components/ui/ArtImage';
import { LicenseKeyField } from '../components/ui/LicenseKeyField';
import { LinkButton } from '../components/ui/LinkButton';
import { PriceLabel } from '../components/ui/PriceLabel';
import { Skeleton } from '../components/ui/Skeleton';
import { LoadError } from '../components/app/LoadError';
import { NotFoundState } from '../components/app/NotFoundState';
import { cx } from '../helpers/cx';
import styles from './pages.module.css';

/** Order confirmation; `?placed=1` adds the success framing (REQ-024). */
export function OrderPage() {
  const { orderId = '' } = useParams();
  const [params] = useSearchParams();
  const placed = params.get('placed') === '1';
  const state = useAsync((signal) => getOrder(orderId, signal), [orderId]);
  const { copied, copy } = useCopy();

  if (state.loading) {
    return (
      <div className={cx('container', styles.page, styles.orderPage)} aria-busy="true">
        <Skeleton className={styles.orderSkeletonBand} />
        <Skeleton className={styles.orderSkeletonBlock} />
      </div>
    );
  }

  if (state.error) {
    if (isNotFound(state.error)) {
      return (
        <div className={cx('container', styles.page, styles.orderPage)}>
          <NotFoundState
            title="Order not found"
            text="It may have been removed, or it belongs to another account."
          />
        </div>
      );
    }
    return (
      <div className={cx('container', styles.page, styles.orderPage)}>
        <LoadError onRetry={state.reload} />
      </div>
    );
  }

  const order = state.data;
  if (!order) return null;

  return (
    <div className={cx('container', styles.page, styles.orderPage)}>
      {placed ? (
        <section className={styles.successBand} aria-labelledby="order-title">
          <p className={styles.eyebrow}>Purchase complete</p>
          <h1 id="order-title" className={styles.orderTitle}>
            Order confirmed
          </h1>
          <p className={styles.orderIntro}>
            Your keys are ready and saved in My Library.
          </p>
        </section>
      ) : (
        <header className={styles.pageHead}>
          <h1 className={styles.pageTitle}>Order {order.reference}</h1>
          <p className={styles.pageCount}>{formatDate(order.createdAt)}</p>
        </header>
      )}

      <section className={styles.orderCard} aria-label="Order details">
        <div className={styles.orderFacts}>
          <div className={styles.orderFact}>
            <span className={styles.factLabel}>Order</span>
            <span className={styles.orderRef}>{order.reference}</span>
            <button
              type="button"
              className={styles.copyOrder}
              onClick={() => void copy(order.reference)}
              aria-label="Copy order reference"
            >
              {copied ? (
                <Check size={14} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Copy size={14} strokeWidth={1.5} aria-hidden="true" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className={styles.orderFact}>
            <span className={styles.factLabel}>Date</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className={styles.orderFact}>
            <span className={styles.factLabel}>Total</span>
            <PriceLabel value={order.totalIdr} large />
          </div>
        </div>

        <ul className={styles.orderApps}>
          {order.items.map((item) => (
            <li key={`${order.reference}-${item.appId}`} className={styles.orderAppRow}>
              <div className={styles.orderAppCover}>
                <ArtImage src={item.coverUrl} alt="" />
              </div>
              <div className={styles.orderAppInfo}>
                <span className={styles.orderAppName}>{item.name}</span>
                <PriceLabel value={item.priceIdr} />
              </div>
              <LicenseKeyField value={item.licenseKey} />
            </li>
          ))}
        </ul>
      </section>

      <div className={styles.orderActions}>
        <LinkButton to="/library">Go to my library</LinkButton>
        <LinkButton to="/orders" variant="secondary">
          View all orders
        </LinkButton>
      </div>
    </div>
  );
}
