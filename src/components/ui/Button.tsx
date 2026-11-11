import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../helpers/cx';
import styles from './ui.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  block?: boolean;
  children: ReactNode;
}

export function Button({ variant = 'primary', block, className, children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={cx(styles.button, styles[variant], block && styles.block, className)}
      {...rest}
    >
      <span className={styles.buttonLabel}>{children}</span>
    </button>
  );
}
