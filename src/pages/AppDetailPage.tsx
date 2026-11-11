import { useParams } from 'react-router-dom';
import { getApp } from '../core/api/services/catalog';
import { useAsync } from '../core/hooks/useAsync';
import { isNotFound } from '../core/hooks/useApiError';
import { ArtImage } from '../components/ui/ArtImage';
import { LoadError } from '../components/app/LoadError';
import { NotFoundState } from '../components/app/NotFoundState';
import { PurchasePanel } from '../components/app/PurchasePanel';
import { Reveal } from '../components/app/Reveal';
import { ScreenshotGallery } from '../components/app/ScreenshotGallery';
import { Skeleton } from '../components/ui/Skeleton';
import { cx } from '../helpers/cx';
import styles from './pages.module.css';

function DetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading app">
      <Skeleton className={styles.detailHeroSkeleton} />
      <div className={cx('container', styles.detailGrid)}>
        <div className={styles.detailMain}>
          <Skeleton className={styles.detailGallerySkeleton} />
          <Skeleton className={styles.detailTextSkeleton} />
          <Skeleton className={styles.detailTextSkeleton} />
        </div>
        <Skeleton className={styles.detailPanelSkeleton} />
      </div>
    </div>
  );
}

/** App detail: cover hero, gallery, long-form sections, sticky purchase panel (REQ-012). */
export function AppDetailPage() {
  const { appId = '' } = useParams();
  const state = useAsync((signal) => getApp(appId, signal), [appId]);

  if (state.loading) return <DetailSkeleton />;

  if (state.error) {
    if (isNotFound(state.error)) {
      return (
        <div className={cx('container', styles.statePage)}>
          <NotFoundState
            title="App not found"
            text="It may have been removed, or it belongs to another account."
          />
        </div>
      );
    }
    return (
      <div className={cx('container', styles.statePage)}>
        <LoadError onRetry={state.reload} />
      </div>
    );
  }

  const app = state.data;
  if (!app) return null;

  return (
    <div>
      <section className={styles.detailHero} aria-labelledby="app-title">
        <ArtImage
          src={app.coverUrl}
          alt={`${app.name} cover art`}
          eager
          className={styles.detailHeroImage}
        />
        <div className={styles.detailHeroScrim} aria-hidden="true" />
        <div className={cx('container', styles.detailHeroContent)}>
          <p className={styles.eyebrow}>{app.category}</p>
          <h1 id="app-title" className={styles.detailTitle}>
            {app.name}
          </h1>
          <div className={styles.detailMeta}>
            <span className={styles.metaItem}>{app.publisher}</span>
            <span className={styles.metaItem}>{app.category}</span>
            <span className={styles.metaItem}>Version {app.version}</span>
          </div>
        </div>
      </section>

      <div className={cx('container', styles.detailGrid)}>
        <div className={styles.detailMain}>
          <Reveal>
            <ScreenshotGallery app={app} />
          </Reveal>

          {app.description ? (
            <Reveal>
              <section className={styles.detailSection} aria-labelledby="about-title">
                <p className={styles.eyebrow}>About</p>
                <h2 id="about-title" className={styles.sectionTitle}>
                  About this app
                </h2>
                <p className={styles.description}>{app.description}</p>
              </section>
            </Reveal>
          ) : null}

          {app.supportedOs.length > 0 ? (
            <Reveal>
              <section className={styles.detailSection} aria-labelledby="requirements-title">
                <p className={styles.eyebrow}>Requirements</p>
                <h2 id="requirements-title" className={styles.sectionTitle}>
                  System requirements
                </h2>
                <ul className={styles.osList}>
                  {app.supportedOs.map((os) => (
                    <li key={os} className={styles.osItem}>
                      {os}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ) : null}
        </div>

        <div className={styles.detailAside}>
          <PurchasePanel app={app} />
        </div>
      </div>
    </div>
  );
}
