import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Order } from '../../core/api/types';
import { formatDate } from '../../core/format/format';
import { PriceLabel } from '../ui/PriceLabel';
import { LicenseKeyField } from '../ui/LicenseKeyField';
import { cx } from '../../helpers/cx';
import styles from './app.module.css';

interface OrderAccordionProps {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
}

/** MO-010: native disclosure button with a 0fr/1fr height transition. */
export function OrderAccordion({ order, expanded, onToggle }: OrderAccordionProps) {
  const panelId = useId();

  return (
    <div className={cx(styles.order, expanded && styles.orderOpen)}>
      <button
        type="button"
        className={styles.orderHead}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className={styles.orderHeadId}>{order.reference}</span>
        <span className={styles.orderHeadDate}>{formatDate(order.createdAt)}</span>
        <span className={styles.orderHeadTotal}>
          <PriceLabel value={order.totalIdr} />
        </span>
        <span className={styles.chevron}>
          <ChevronDown size={20} strokeWidth={1.5} aria-hidden="true" />
        </span>
      </button>

      <div id={panelId} className={cx(styles.orderBody, expanded && styles.orderBodyOpen)}>
        <div className={styles.orderBodyInner}>
          <div className={styles.orderBodyPad}>
            {order.items.map((item) => (
              <div key={`${order.reference}-${item.appId}`} className={styles.orderItem}>
                <div>
                  <p className={styles.orderItemName}>{item.name}</p>
                  <p className={styles.orderItemPrice}>
                    <PriceLabel value={item.priceIdr} />
                  </p>
                </div>
                <LicenseKeyField value={item.licenseKey} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
