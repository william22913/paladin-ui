import styles from './app.module.css';

/** Session probe / boot state. No spinner: the wordmark pulses (MO-011 rhythm). */
export function BootScreen() {
  return (
    <div className={styles.boot} role="status" aria-live="polite">
      <span className={styles.bootWordmark}>Paladin</span>
      <span className="visually-hidden">Loading</span>
    </div>
  );
}
