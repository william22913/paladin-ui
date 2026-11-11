import { Link } from 'react-router-dom';
import { getLibrary } from '../core/api/services/library';
import { formatDate } from '../core/format/format';
import { useAsync } from '../core/hooks/useAsync';
import { ArtImage } from '../components/ui/ArtImage';
import { LicenseKeyField } from '../components/ui/LicenseKeyField';
import { LinkButton } from '../components/ui/LinkButton';
import { Skeleton } from '../components/ui/Skeleton';
import { StateBlock } from '../components/ui/StateBlock';
import { LoadError } from '../components/app/LoadError';
import { appCount } from '../core/format/format';
import { cx } from '../helpers/cx';
import styles from './pages.module.css';

/** My Library: owned apps, keys, purchase dates and order links (REQ-029). */
export function LibraryPage() {
  const state = useAsync((signal) => getLibrary(signal), []);
  const entries = state.data ?? [];

  return (
    <div className={cx('container', styles.page)}>
      <header className={styles.pageHead}>
        <h1 className={styles.pageTitle}>My Library</h1>
        {!state.loading && !state.error ? (
          <p className={styles.pageCount}>{appCount(entries.length)}</p>
        ) : null}
      </header>

      {state.loading ? (
        <div className={styles.libraryGrid} aria-busy="true" aria-label="Loading library">
          {[0, 1, 2, 3].map((key) => (
            <Skeleton key={key} className={styles.librarySkeleton} />
          ))}
        </div>
      ) : state.error ? (
        <LoadError onRetry={state.reload} />
      ) : entries.length === 0 ? (
        <StateBlock
          title="Your library is empty."
          text="Apps you buy appear here with their license keys."
          actions={<LinkButton to="/">Browse the catalog</LinkButton>}
          centered
        />
      ) : (
        <div className={styles.libraryGrid}>
          {entries.map((entry) => (
            <article key={`${entry.appId}-${entry.licenseKey}`} className={styles.libraryCard}>
              <div className={styles.libraryCover}>
                <ArtImage src={entry.coverUrl} alt="" />
              </div>
              <div className={styles.libraryBody}>
                <span className={styles.cardKicker}>{entry.publisher}</span>
                <h2 className={styles.libraryName}>{entry.name}</h2>
                <LicenseKeyField value={entry.licenseKey} />
                <div className={styles.libraryFoot}>
                  <span>Purchased {formatDate(entry.purchasedAt)}</span>
                  <Link to={`/orders/${entry.orderReference}`} className={styles.orderLink}>
                    Order {entry.orderReference}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
