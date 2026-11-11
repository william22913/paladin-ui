import { useState } from 'react';
import type { AppSummary } from '../../core/api/types';
import { useCart } from '../../core/cart/CartProvider';
import { addErrorMessage, CART_FULL_MESSAGE } from '../../core/cart/messages';
import { Button } from '../ui/Button';
import { InCartTag, OwnedTag } from '../ui/Tag';
import { LinkButton } from '../ui/LinkButton';
import { PriceLabel } from '../ui/PriceLabel';
import { Rating } from '../ui/Rating';
import { WishlistButton } from './WishlistButton';
import styles from './app.module.css';

/** Sticky desktop panel; sticky bottom bar on phones (UIMap App detail). */
export function PurchasePanel({ app }: { app: AppSummary }) {
  const { cart, count, add } = useCart();
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');
  const [wishlistMessage, setWishlistMessage] = useState('');

  const inCart =
    app.isInCart || Boolean(cart?.items.some((item) => item.appId === app.id));

  async function handleAdd() {
    if (adding) return;
    setMessage('');
    if (count >= 20) {
      setMessage(CART_FULL_MESSAGE);
      return;
    }
    setAdding(true);
    try {
      await add(app.id);
    } catch (error) {
      setMessage(addErrorMessage(error));
    } finally {
      setAdding(false);
    }
  }

  return (
    <aside className={styles.panel} aria-label="Purchase">
      <div className={styles.panelHead}>
        <div>
          <p className={styles.panelLabel}>License</p>
          <PriceLabel value={app.priceIdr} large />
        </div>
        <Rating value={app.rating} />
      </div>

      <div className={styles.panelActions}>
        {app.isOwned ? (
          <>
            <OwnedTag label="In your library" />
            <LinkButton to="/library" variant="secondary" block>
              View in my library
            </LinkButton>
          </>
        ) : inCart ? (
          <>
            <InCartTag />
            <LinkButton to="/cart" variant="secondary" block>
              View cart
            </LinkButton>
          </>
        ) : (
          <Button block onClick={() => void handleAdd()} disabled={adding}>
            {adding ? 'Adding' : 'Add to cart'}
          </Button>
        )}

        <WishlistButton
          app={app}
          variant="block"
          className={styles.panelWishlist}
          onError={setWishlistMessage}
        />
      </div>

      {message || wishlistMessage ? (
        <p className={styles.panelError} role="alert">
          {message || wishlistMessage}
        </p>
      ) : null}

      <p className={styles.panelNote}>
        One license key per purchase. Keys appear in My Library.
      </p>
    </aside>
  );
}
