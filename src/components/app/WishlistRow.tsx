import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import type { AppSummary } from '../../core/api/types';
import { ArtImage } from '../ui/ArtImage';
import { Button } from '../ui/Button';
import { PriceLabel } from '../ui/PriceLabel';
import { Rating } from '../ui/Rating';
import { InCartTag, OwnedTag } from '../ui/Tag';
import { cx } from '../../helpers/cx';
import styles from './app.module.css';

interface WishlistRowProps {
  app: AppSummary;
  busyAction: 'move' | 'remove' | null;
  message: string;
  onMove: () => void;
  onRemove: () => void;
}

/** Cart-line anatomy plus rating, owned/in-cart tags and its own message slot. */
export function WishlistRow({
  app,
  busyAction,
  message,
  onMove,
  onRemove,
}: WishlistRowProps) {
  const moving = busyAction === 'move';
  const removing = busyAction === 'remove';
  const busy = moving || removing;

  return (
    <li className={cx(styles.wishlistRow, busy && styles.wishlistRowBusy)}>
      <Link
        to={`/apps/${app.id}`}
        className={styles.wishlistCover}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ArtImage src={app.coverUrl} alt="" />
      </Link>

      <div className={styles.wishlistInfo}>
        <span className={styles.wishlistName}>
          <Link to={`/apps/${app.id}`}>{app.name}</Link>
        </span>
        <span className={styles.wishlistMeta}>
          {app.publisher} · {app.category}
        </span>
        <span className={styles.wishlistRating}>
          <Rating value={app.rating} />
        </span>
      </div>

      <div className={styles.wishlistSide}>
        <PriceLabel value={app.priceIdr} />
        {app.isOwned || app.isInCart ? (
          <div className={styles.wishlistTags}>
            {app.isOwned ? <OwnedTag /> : null}
            {app.isInCart ? <InCartTag /> : null}
          </div>
        ) : null}
        <div className={styles.wishlistActions}>
          <Button
            variant="secondary"
            className={styles.wishlistMove}
            onClick={onMove}
            disabled={busy}
            aria-label={`Move ${app.name} to cart`}
          >
            {moving ? 'Moving' : 'Move to cart'}
          </Button>
          <button
            type="button"
            className={styles.wishlistRemove}
            onClick={onRemove}
            disabled={busy}
            aria-label={`Remove ${app.name} from your wishlist`}
          >
            <Trash2 size={15} strokeWidth={1.5} aria-hidden="true" />
            {removing ? 'Removing' : 'Remove'}
          </button>
        </div>
      </div>

      {message ? (
        <p className={styles.wishlistMessage} role="alert">
          {message}
        </p>
      ) : null}
    </li>
  );
}
