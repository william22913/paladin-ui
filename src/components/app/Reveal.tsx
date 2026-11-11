import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../helpers/cx';

interface RevealProps {
  children: ReactNode;
  /** Stagger offset in ms, capped by the caller at six children (MO-002). */
  delay?: number;
  className?: string;
}

/** MO-002: one fade-and-rise when the band enters the viewport, then never again. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cx('reveal', className)}
      data-visible={visible}
      style={delay ? { transitionDelay: `${Math.min(delay, 300)}ms` } : undefined}
    >
      {children}
    </div>
  );
}
