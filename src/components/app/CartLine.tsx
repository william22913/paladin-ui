import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import type { CartItem } from '../../core/api/types';
import { ArtImage } from '../ui/ArtImage';
import { PriceLabel } from '../ui/PriceLabel';
import { cx } from '../../helpers/cx';
import styles from './app.module.css';

interface CartLineProps {
  item: CartItem;
  removing: boolean;
  onRemove: () => void;
}

/** One license per line, no stepper (REQ-015, TC-040). */
export function CartLine({ item, removing, onRemove }: CartLineProps) {
  return (
    <li className={cx(styles.cartLine, removing && styles.cartLineRemoving)}>
      <Link to={`/apps/${item.appId}`} className={styles.cartCover} tabIndex={-1} aria-hidden="true">
        <ArtImage src={item.coverUrl} alt="" />
      </Link>
      <div className={styles.cartInfo}>
        <span className={styles.cartName}>
          <Link to={`/apps/${item.appId}`}>{item.name}</Link>
        </span>
        <span className={styles.cartMeta}>
          {item.publisher} · {item.category}
        </span>
        <span className={styles.cartQty}>1 license</span>
      </div>
      <div className={styles.cartSide}>
        <PriceLabel value={item.priceIdr} />
        <button
          type="button"
          className={styles.lineRemove}
          onClick={onRemove}
          disabled={removing}
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 size={15} strokeWidth={1.5} aria-hidden="true" />
          {removing ? 'Removing' : 'Remove'}
        </button>
      </div>
    </li>
  );
}
