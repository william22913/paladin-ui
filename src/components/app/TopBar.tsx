import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ShoppingBag } from 'lucide-react';
import { useCart } from '../../core/cart/CartProvider';
import { cx } from '../../helpers/cx';
import { MenuDialog } from './MenuDialog';
import { Wordmark } from './Wordmark';
import styles from './app.module.css';

/** Fixed minimal top bar: transparent over the hero, solid after 40px (UIMap Home). */
export function TopBar() {
  const location = useLocation();
  const onHome = location.pathname === '/';
  const { count } = useCart();
  const [solid, setSolid] = useState(!onHome);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const previousCount = useRef(count);
  const bumpTimer = useRef<number | null>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!onHome) {
      setSolid(true);
      return;
    }
    setSolid(false);
    const sentinel = document.getElementById('top-sentinel');
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSolid(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onHome]);

  useEffect(() => {
    if (count > previousCount.current) {
      setBump(true);
      if (bumpTimer.current !== null) window.clearTimeout(bumpTimer.current);
      bumpTimer.current = window.setTimeout(() => setBump(false), 300);
    }
    previousCount.current = count;
  }, [count]);

  useEffect(
    () => () => {
      if (bumpTimer.current !== null) window.clearTimeout(bumpTimer.current);
    },
    [],
  );

  return (
    <header className={cx(styles.header, solid && styles.headerSolid)}>
      <div className={styles.headerLeft}>
        <button
          type="button"
          className={styles.menuButton}
          aria-label="Menu"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
          <span>Menu</span>
        </button>
      </div>

      <Wordmark />

      <div className={styles.headerRight}>
        <Link
          to="/cart"
          className={styles.cartLink}
          aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? 'app' : 'apps'}` : 'Cart'}
        >
          <ShoppingBag size={20} strokeWidth={1.5} aria-hidden="true" />
          {count > 0 ? (
            <span className={cx(styles.badge, bump && styles.badgeBump)} aria-hidden="true">
              {count}
            </span>
          ) : null}
        </Link>
      </div>

      <MenuDialog open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
