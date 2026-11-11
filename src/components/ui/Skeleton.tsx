import type { CSSProperties } from 'react';
import { cx } from '../../helpers/cx';
import styles from './ui.module.css';

export function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return <div className={cx(styles.skeleton, className)} style={style} aria-hidden="true" />;
}
