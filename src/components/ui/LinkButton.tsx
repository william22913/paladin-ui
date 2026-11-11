import { Link, type LinkProps } from 'react-router-dom';
import type { ReactNode } from 'react';
import { cx } from '../../helpers/cx';
import styles from './ui.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';

interface LinkButtonProps extends LinkProps {
  variant?: Variant;
  block?: boolean;
  children: ReactNode;
}

/** A navigation action that must look exactly like a button (REQ-021, REQ-029). */
export function LinkButton({
  variant = 'primary',
  block,
  className,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <Link className={cx(styles.button, styles[variant], block && styles.block, className)} {...rest}>
      <span className={styles.buttonLabel}>{children}</span>
    </Link>
  );
}
