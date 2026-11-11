import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { AppSummary } from '../../core/api/types';
import { useCart } from '../../core/cart/CartProvider';
import { addErrorMessage, CART_FULL_MESSAGE } from '../../core/cart/messages';
import { ArtImage } from '../ui/ArtImage';
import { Button } from '../ui/Button';
import { OwnedTag, InCartTag } from '../ui/Tag';
import { PriceLabel } from '../ui/PriceLabel';
import { Rating } from '../ui/Rating';
import { cx } from '../../helpers/cx';
import styles from './app.module.css';

interface AppCardProps {
  app: AppSummary;
  /** Only the first featured cover is eager (UIMap Assets). */
  priority?: boolean;
}

type Phase = 'idle' | 'adding' | 'added';

/** Poster card: the whole card opens the detail, the add button stops at the cart. */
export function AppCard({ app, priority }: AppCardProps) {
  const { cart, count, add } = useCart();
  const [phase, setPhase] = useState<Phase>('idle');
  const [message, setMessage] = useState('');
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const inCart =
    app.isInCart || Boolean(cart?.items.some((item) => item.appId === app.id));

  async function handleAdd() {
    if (phase === 'adding') return;
    setMessage('');
    if (count >= 20) {
      setMessage(CART_FULL_MESSAGE);
      return;
    }
    setPhase('adding');
    try {
      await add(app.id);
      setPhase('added');
      timer.current = window.setTimeout(() => setPhase('idle'), 1500);
    } catch (error) {
      setPhase('idle');
      setMessage(addErrorMessage(error));
    }
  }

  return (
    <article className={cx(styles.card, phase === 'adding' && styles.cardBusy)}>
      <Link className={styles.stretch} to={`/apps/${app.id}`} aria-label={`View ${app.name}`} />
      <div className={styles.cover}>
        <ArtImage src={app.coverUrl} alt="" eager={priority} />
      </div>
      <div className={styles.cardBody}>
        <span className={styles.cardCategory}>{app.category}</span>
        <span className={styles.cardTitle}>{app.name}</span>
        <span className={styles.cardPublisher}>{app.publisher}</span>
        <div className={styles.cardMeta}>
          <PriceLabel value={app.priceIdr} />
          <Rating value={app.rating} />
        </div>
        <div className={styles.cardActions}>
          {app.isOwned ? (
            <span className={styles.ownedLine}>
              <OwnedTag /> In your library
            </span>
          ) : inCart && phase !== 'added' ? (
            <span className={styles.inCartLine}>
              <InCartTag /> <Link to="/cart">View cart</Link>
            </span>
          ) : (
            <Button
              variant="secondary"
              className={styles.cardButton}
              onClick={() => void handleAdd()}
              disabled={phase === 'adding'}
              aria-label={`Add ${app.name} to cart`}
            >
              {phase === 'adding' ? 'Adding' : phase === 'added' ? 'Added' : 'Add to cart'}
            </Button>
          )}
          {message ? (
            <p className={styles.cardError} role="alert">
              {message}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
