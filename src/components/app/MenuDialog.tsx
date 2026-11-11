import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { useAuth } from '../../core/auth/AuthProvider';
import { Wordmark } from './Wordmark';
import styles from './app.module.css';

const links = [
  { to: '/', label: 'Catalog' },
  { to: '/library', label: 'My Library' },
  { to: '/orders', label: 'Orders' },
];

/** MO-006/MO-007: native modal dialog, focus trap, Escape, scroll locked. */
export function MenuDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);
  const closeTimer = useRef<number | null>(null);
  const { logout } = useAuth();

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) {
      closingRef.current = false;
      setClosing(false);
      element.showModal();
    } else if (!open && element.open) {
      element.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(
    () => () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    },
    [],
  );

  const requestClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => onClose(), 300);
  };

  return (
    <dialog
      ref={dialog}
      className={`${styles.menu} ${closing ? styles.menuClosing : ''}`}
      aria-label="Menu"
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClose={() => {
        if (open) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div className={styles.menuPanel}>
        <div className={styles.menuTop}>
          <div className={styles.menuHead}>
            <Wordmark linked={false} />
            <button type="button" className={styles.menuClose} onClick={requestClose}>
              <X size={18} strokeWidth={1.5} aria-hidden="true" /> Close
            </button>
          </div>
          <nav className={styles.menuNav} aria-label="Main">
            {links.map((link, index) => (
              <Link
                key={link.to}
                to={link.to}
                className={styles.menuLink}
                style={{ '--stagger': `${index * 50}ms` } as CSSProperties}
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className={styles.menuFoot}>
          <button
            type="button"
            className={styles.signOut}
            onClick={() => void logout()}
          >
            <LogOut size={18} strokeWidth={1.5} aria-hidden="true" /> Sign out
          </button>
          <p>Accounts are issued by Paladin.</p>
        </div>
      </div>
    </dialog>
  );
}
