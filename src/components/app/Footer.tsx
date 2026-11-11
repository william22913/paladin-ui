import { Link } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthProvider';
import { cx } from '../../helpers/cx';
import styles from './app.module.css';

export function Footer() {
  const { logout } = useAuth();

  return (
    <footer className={styles.footer}>
      <div className={cx('container', styles.footerInner)}>
        <span className={styles.footerWordmark}>Paladin</span>
        <nav className={styles.footerNav} aria-label="Footer">
          <Link to="/">Catalog</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/library">My Library</Link>
          <Link to="/orders">Orders</Link>
          <button type="button" onClick={() => void logout()}>
            Sign out
          </button>
        </nav>
        <p className={styles.footerCopy}>
          © {new Date().getFullYear()} Paladin. Licenses are tied to your account.
        </p>
      </div>
    </footer>
  );
}
