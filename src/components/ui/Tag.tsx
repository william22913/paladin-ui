import { Check, ShoppingBag } from 'lucide-react';
import { cx } from '../../helpers/cx';
import styles from './ui.module.css';

export function OwnedTag({ label = 'Owned' }: { label?: string }) {
  return (
    <span className={cx(styles.tag, styles.tagOwned)}>
      <Check size={11} strokeWidth={2} aria-hidden="true" /> {label}
    </span>
  );
}

export function InCartTag() {
  return (
    <span className={cx(styles.tag, styles.tagCart)}>
      <ShoppingBag size={11} strokeWidth={1.5} aria-hidden="true" /> In cart
    </span>
  );
}
