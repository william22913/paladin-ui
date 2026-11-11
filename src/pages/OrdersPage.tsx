import { useState } from 'react';
import { getOrders } from '../core/api/services/orders';
import { orderCount } from '../core/format/format';
import { useAsync } from '../core/hooks/useAsync';
import { OrderAccordion } from '../components/app/OrderAccordion';
import { LoadError } from '../components/app/LoadError';
import { LinkButton } from '../components/ui/LinkButton';
import { Skeleton } from '../components/ui/Skeleton';
import { StateBlock } from '../components/ui/StateBlock';
import { cx } from '../helpers/cx';
import styles from './pages.module.css';

/** Orders: newest first from the API, each expandable to its apps and keys (REQ-030). */
export function OrdersPage() {
  const state = useAsync((signal) => getOrders(signal), []);
  const [expanded, setExpanded] = useState<string[]>([]);
  const orders = state.data ?? [];

  const toggle = (reference: string) => {
    setExpanded((current) =>
      current.includes(reference)
        ? current.filter((value) => value !== reference)
        : [...current, reference],
    );
  };

  return (
    <div className={cx('container', styles.page, styles.ordersPage)}>
      <header className={styles.pageHead}>
        <h1 className={styles.pageTitle}>Orders</h1>
        {!state.loading && !state.error ? (
          <p className={styles.pageCount}>{orderCount(orders.length)}</p>
        ) : null}
      </header>

      {state.loading ? (
        <div aria-busy="true" aria-label="Loading orders">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} className={styles.orderSkeletonRow} />
          ))}
        </div>
      ) : state.error ? (
        <LoadError onRetry={state.reload} />
      ) : orders.length === 0 ? (
        <StateBlock
          title="No orders yet."
          text="When you check out, your orders and license keys appear here."
          actions={<LinkButton to="/">Browse the catalog</LinkButton>}
          centered
        />
      ) : (
        <div>
          {orders.map((order) => (
            <OrderAccordion
              key={order.reference}
              order={order}
              expanded={expanded.includes(order.reference)}
              onToggle={() => toggle(order.reference)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
