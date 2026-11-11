import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AppSummary } from '../../core/api/types';
import { AppCard } from './AppCard';
import styles from './app.module.css';

/** MO-002/MO-003 rail: CSS scroll-snap, arrows on desktop, no autoplay. */
export function AppRail({ apps, label }: { apps: AppSummary[]; label: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const updateEdges = useCallback(() => {
    const element = scroller.current;
    if (!element) return;
    setEdges({
      start: element.scrollLeft <= 4,
      end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    const element = scroller.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(element);
    return () => observer.disconnect();
  }, [updateEdges, apps.length]);

  const scrollByPage = (direction: 1 | -1) => {
    const element = scroller.current;
    if (!element) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollBy({
      left: direction * element.clientWidth * 0.85,
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  return (
    <div className={styles.railWrap}>
      <div
        ref={scroller}
        className={styles.rail}
        role="region"
        aria-label={label}
        tabIndex={0}
        onScroll={updateEdges}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            scrollByPage(1);
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            scrollByPage(-1);
          }
        }}
      >
        {apps.map((app, index) => (
          <AppCard key={app.id} app={app} priority={index === 0} />
        ))}
      </div>
      {apps.length > 3 ? (
        <div className={styles.railArrows}>
          <button
            type="button"
            className={styles.railArrow}
            onClick={() => scrollByPage(-1)}
            disabled={edges.start}
            aria-label="Previous apps"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className={styles.railArrow}
            onClick={() => scrollByPage(1)}
            disabled={edges.end}
            aria-label="Next apps"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
