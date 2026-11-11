import { Outlet, useLocation } from 'react-router-dom';
import { cx } from '../../helpers/cx';
import { Footer } from './Footer';
import { TopBar } from './TopBar';
import styles from './app.module.css';

/** Authenticated chrome: skip link, fixed top bar, main landmark, slim footer. */
export function AppShell() {
  const { pathname } = useLocation();
  const overlay = pathname === '/';
  const hideFooter = pathname === '/checkout' || /^\/orders\/[^/]+$/.test(pathname);

  return (
    <div className={styles.shell}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {overlay ? <div id="top-sentinel" className={styles.sentinel} aria-hidden="true" /> : null}

      <TopBar />

      <main
        id="main"
        tabIndex={-1}
        className={cx(styles.main, overlay && styles.mainOverlay)}
      >
        <div key={pathname} className="page-fade">
          <Outlet />
        </div>
      </main>

      {hideFooter ? null : <Footer />}
    </div>
  );
}
