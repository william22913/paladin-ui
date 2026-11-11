import type { Category } from '../../core/api/types';
import { cx } from '../../helpers/cx';
import styles from './app.module.css';

interface CategoryTabsProps {
  categories: Category[];
  active: string | null;
  onChange: (slug: string | null) => void;
}

/** ALL plus the five seeded categories; unknown values resolve to ALL upstream. */
export function CategoryTabs({ categories, active, onChange }: CategoryTabsProps) {
  return (
    <div className={styles.tabs} role="group" aria-label="Browse by category">
      <button
        type="button"
        className={cx(styles.tab, active === null && styles.tabActive)}
        aria-pressed={active === null}
        onClick={() => onChange(null)}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.slug}
          type="button"
          className={cx(styles.tab, active === category.slug && styles.tabActive)}
          aria-pressed={active === category.slug}
          onClick={() => onChange(category.slug)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
