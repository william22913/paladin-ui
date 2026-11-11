import { appCount } from '../../core/format/format';
import { LinkButton } from '../ui/LinkButton';
import { PriceLabel } from '../ui/PriceLabel';
import styles from './app.module.css';

export function CartSummary({ count, totalIdr }: { count: number; totalIdr: number }) {
  return (
    <aside className={styles.summary} aria-label="Cart summary">
      <p className={styles.summaryCount}>{appCount(count)}</p>
      <div className={styles.summaryRow}>
        <span>Subtotal</span>
        <PriceLabel value={totalIdr} />
      </div>
      <div className={styles.summaryTotal}>
        <span className={styles.summaryTotalLabel}>Total</span>
        <PriceLabel value={totalIdr} large />
      </div>
      <p className={styles.summaryNote}>No tax or fees are added.</p>
      <LinkButton to="/checkout" block>
        Proceed to checkout
      </LinkButton>
    </aside>
  );
}
