import { Star } from 'lucide-react';
import styles from './ui.module.css';

interface RatingProps {
  value: number;
  showValue?: boolean;
  size?: number;
}

/** Seeded display rating, never an input (REQ-012). Decorative stars plus accessible value. */
export function Rating({ value, showValue = true, size = 14 }: RatingProps) {
  const clamped = Math.max(0, Math.min(5, value));
  const percent = (clamped / 5) * 100;

  return (
    <span className={styles.rating}>
      <span className={styles.stars} aria-hidden="true">
        <span className={styles.starsBase}>
          {[0, 1, 2, 3, 4].map((star) => (
            <Star key={star} size={size} strokeWidth={1.5} />
          ))}
        </span>
        <span className={styles.starsFill} style={{ width: `${percent}%` }}>
          {[0, 1, 2, 3, 4].map((star) => (
            <Star key={star} size={size} strokeWidth={1.5} fill="currentColor" />
          ))}
        </span>
      </span>
      <span className="visually-hidden">Rated {clamped.toFixed(1)} out of 5</span>
      {showValue ? <span className={styles.ratingValue}>{clamped.toFixed(1)}</span> : null}
    </span>
  );
}
