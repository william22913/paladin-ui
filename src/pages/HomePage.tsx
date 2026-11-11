import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getApps, getCategories, getFeatured } from '../core/api/services/catalog';
import type { AppSummary, Category } from '../core/api/types';
import { appCount } from '../core/format/format';
import { useAsync } from '../core/hooks/useAsync';
import { useDebouncedValue } from '../core/hooks/useDebouncedValue';
import { AppCard } from '../components/app/AppCard';
import { AppRail } from '../components/app/AppRail';
import { CategoryTabs } from '../components/app/CategoryTabs';
import { LoadError } from '../components/app/LoadError';
import { Reveal } from '../components/app/Reveal';
import { ArtImage } from '../components/ui/ArtImage';
import { Button } from '../components/ui/Button';
import { SearchField } from '../components/ui/SearchField';
import { Skeleton } from '../components/ui/Skeleton';
import { StateBlock } from '../components/ui/StateBlock';
import { cx } from '../helpers/cx';
import styles from './pages.module.css';

const HERO = 'https://picsum.photos/seed/paladin-hero/2400/1350';

function CardSkeleton() {
  return (
    <div className={styles.cardSkeleton}>
      <Skeleton className={styles.skeletonCover} />
      <div className={styles.skeletonBody}>
        <Skeleton className={styles.skeletonLineShort} />
        <Skeleton className={styles.skeletonLine} />
        <Skeleton className={styles.skeletonLineShort} />
      </div>
    </div>
  );
}

function RailSkeleton() {
  return (
    <div className={styles.skeletonRail}>
      {[0, 1, 2].map((key) => (
        <CardSkeleton key={key} />
      ))}
    </div>
  );
}

/** Home: hero, seed-ordered featured rail, then search + category browse (REQ-007). */
export function HomePage() {
  const [params, setParams] = useSearchParams();
  const rawQ = params.get('q') ?? '';
  const rawCategory = params.get('category');

  const [input, setInput] = useState(rawQ);
  const debounced = useDebouncedValue(input, 300);
  const query = debounced.trim();
  const lastPushed = useRef(rawQ);

  const featured = useAsync((signal) => getFeatured(signal), []);
  const categoryState = useAsync((signal) => getCategories(signal), []);
  const categories: Category[] = categoryState.data ?? [];
  const activeCategory =
    rawCategory && categories.some((category) => category.slug === rawCategory)
      ? rawCategory
      : null;
  const activeCategoryName =
    categories.find((category) => category.slug === activeCategory)?.name ?? '';

  const catalog = useAsync(
    (signal) =>
      getApps(
        { category: activeCategory ?? undefined, q: query || undefined },
        signal,
      ),
    [activeCategory, query],
  );

  // Back/forward changes the URL; our own pushes must not overwrite what is being typed.
  useEffect(() => {
    if (rawQ === lastPushed.current) return;
    lastPushed.current = rawQ;
    setInput(rawQ);
  }, [rawQ]);

  // Typing settles into the URL with replaceState (UIMap URL state).
  useEffect(() => {
    if (query === rawQ) return;
    lastPushed.current = query;
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (query) next.set('q', query);
        else next.delete('q');
        return next;
      },
      { replace: true },
    );
  }, [query, rawQ, setParams]);

  const updateQuery = (value: string, replace: boolean) => {
    lastPushed.current = value;
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set('q', value);
        else next.delete('q');
        return next;
      },
      { replace },
    );
  };

  const handleSearch = (value: string) => {
    setInput(value);
    if (value === '') updateQuery('', true);
  };

  const changeCategory = (slug: string | null) => {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (slug) next.set('category', slug);
      else next.delete('category');
      return next;
    });
  };

  const apps: AppSummary[] = catalog.data?.apps ?? [];
  const resultLabel = catalog.loading
    ? 'Loading apps'
    : query
      ? `${appCount(apps.length)} for "${query}"`
      : activeCategoryName
        ? `${appCount(apps.length)} in ${activeCategoryName}`
        : appCount(apps.length);

  return (
    <>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroMedia}>
          <ArtImage
            src={HERO}
            alt="A dark cinematic landscape behind the Paladin storefront."
            eager
            className={styles.heroImage}
          />
        </div>
        <div className={styles.heroScrim} aria-hidden="true" />
        <div className={cx('container', styles.heroContent)}>
          <p className={styles.eyebrow}>Desktop software, curated</p>
          <h1 id="home-title" className={styles.heroTitle}>
            Software for
            <br />
            the serious desk.
          </h1>
          <p className={styles.heroSub}>
            A tight catalog of desktop software, chosen for people who care how
            their tools feel.
          </p>
          <a className={styles.heroCta} href="#catalog">
            Browse the catalog
          </a>
        </div>
      </section>

      <Reveal>
        <section className={styles.featuredBand} aria-labelledby="featured-title">
          <div className={cx('container', styles.sectionHead)}>
            <div>
              <p className={styles.eyebrow}>Featured</p>
              <h2 id="featured-title" className={styles.sectionTitle}>
                Selected this month
              </h2>
            </div>
          </div>
          <div className={cx('container', styles.featuredBody)}>
            {featured.loading ? (
              <RailSkeleton />
            ) : featured.error ? (
              <LoadError onRetry={featured.reload} />
            ) : (featured.data?.apps.length ?? 0) > 0 ? (
              <AppRail apps={featured.data?.apps ?? []} label="Featured apps" />
            ) : null}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section id="catalog" className={styles.catalogBand} aria-labelledby="browse-title">
          <div className="container">
            <div className={styles.catalogHead}>
              <div>
                <p className={styles.eyebrow}>Browse</p>
                <h2 id="browse-title" className={styles.sectionTitle}>
                  Find an app
                </h2>
              </div>
              <div className={styles.searchWrap}>
                <SearchField
                  value={input}
                  onChange={handleSearch}
                  onSubmit={(value) => {
                    updateQuery(value.trim(), true);
                  }}
                  label="Search apps by name"
                  placeholder="Search by name"
                />
              </div>
            </div>

            <div className={styles.toolbar}>
              <CategoryTabs
                categories={categories}
                active={activeCategory}
                onChange={changeCategory}
              />
              <p className={styles.resultCount} aria-live="polite">
                {resultLabel}
              </p>
            </div>

            {catalog.loading ? (
              <div className={styles.catalogGrid} aria-busy="true" aria-label="Loading catalog">
                {Array.from({ length: 9 }, (_, index) => (
                  <CardSkeleton key={index} />
                ))}
              </div>
            ) : catalog.error ? (
              <LoadError onRetry={catalog.reload} />
            ) : apps.length === 0 ? (
              query ? (
                <StateBlock
                  title={`No apps match "${query}".`}
                  text="Try a shorter name, or clear the search to see the whole catalog."
                  actions={<Button onClick={() => handleSearch('')}>Clear search</Button>}
                  centered
                />
              ) : activeCategory ? (
                <StateBlock
                  title={`No apps in ${activeCategoryName} yet.`}
                  text="Everything else in the catalog is still there."
                  actions={<Button onClick={() => changeCategory(null)}>View all apps</Button>}
                  centered
                />
              ) : (
                <StateBlock
                  title="No apps yet."
                  text="The catalog is being prepared. Try again shortly."
                  actions={<Button onClick={catalog.reload}>Try again</Button>}
                  centered
                />
              )
            ) : (
              <div className={styles.catalogGrid}>
                {apps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            )}
          </div>
        </section>
      </Reveal>
    </>
  );
}
