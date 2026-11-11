import { formatIdr } from '../../core/format/format';
import { cx } from '../../helpers/cx';
import styles from './ui.module.css';

export function PriceLabel({
  value,
  large,
  className,
}: {
  value: number;
  large?: boolean;
  className?: string;
}) {
  return (
    <span className={cx(styles.price, large && styles.priceLarge, className)}>{formatIdr(value)}</span>
  );
}
