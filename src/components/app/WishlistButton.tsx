import { useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import type { AppSummary } from '../../core/api/types';
import { removeApp, saveApp } from '../../core/api/services/wishlist';
import {
  REMOVED_MESSAGE,
  SAVED_MESSAGE,
  removeErrorMessage,
  saveErrorMessage,
} from '../../core/wishlist/messages';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { cx } from '../../helpers/cx';
import styles from './app.module.css';

interface WishlistButtonProps {
  app: AppSummary;
  variant?: 'overlay' | 'block';
  className?: string;
  /** Empty string clears the surface's error slot on a new attempt. */
  onError: (message: string) => void;
}

/**
 * One toggle for both placements (UIMap): `overlay` is the 44x44 card control,
 * `block` the full-width button under the detail page's add-to-cart action.
 */
export function WishlistButton({
  app,
  variant = 'overlay',
  className,
  onError,
}: WishlistButtonProps) {
  const [saved, setSaved] = useState(app.isWishlisted);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  async function toggle() {
    if (busy) return;
    const next = !saved;
    const previous = saved;
    setSaved(next);
    setBusy(true);
    setStatus('');
    onError('');
    try {
      if (next) await saveApp(app.id);
      else await removeApp(app.id);
      setStatus(next ? SAVED_MESSAGE : REMOVED_MESSAGE);
    } catch (error) {
      setSaved(previous);
      onError(next ? saveErrorMessage(error) : removeErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  const label = saved
    ? `Remove ${app.name} from your wishlist`
    : `Save ${app.name} to your wishlist`;
  const icon = saved ? (
    <BookmarkCheck
      size={18}
      strokeWidth={1.5}
      fill="currentColor"
      style={{ stroke: 'var(--canvas)' }}
      aria-hidden="true"
    />
  ) : (
    <Bookmark size={18} strokeWidth={1.5} aria-hidden="true" />
  );

  // A changed key remounts the icon so MO-101 replays on each resolved toggle.
  const animatedIcon = (
    <span key={saved ? 'saved' : 'unsaved'} className={styles.wishlistIcon}>
      {icon}
    </span>
  );

  return (
    <>
      {variant === 'overlay' ? (
        <IconButton
          label={label}
          className={cx(
            styles.wishlistOverlay,
            saved && styles.wishlistOverlaySaved,
            className,
          )}
          aria-pressed={saved}
          aria-busy={busy}
          onClick={() => void toggle()}
        >
          {animatedIcon}
        </IconButton>
      ) : (
        <Button
          variant="secondary"
          block
          className={cx(styles.wishlistBlock, className)}
          aria-pressed={saved}
          aria-busy={busy}
          onClick={() => void toggle()}
        >
          <span className={styles.wishlistBlockLabel}>
            {animatedIcon}
            {saved ? 'Saved to wishlist' : 'Save to wishlist'}
          </span>
        </Button>
      )}
      <span className="visually-hidden" role="status">
        {status}
      </span>
    </>
  );
}
