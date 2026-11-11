import { Link } from 'react-router-dom';
import { cx } from '../../helpers/cx';
import styles from './app.module.css';

/** The wordmark is type-set in Oswald until an SVG arrives (UIMap Assets). */
export function Wordmark({ linked = true, className }: { linked?: boolean; className?: string }) {
  const mark = <span className={cx(styles.wordmark, className)}>Paladin</span>;
  if (!linked) return mark;
  return (
    <Link to="/" aria-label="Paladin, go to the catalog">
      {mark}
    </Link>
  );
}
