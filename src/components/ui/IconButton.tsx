import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../helpers/cx';
import styles from './ui.module.css';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

export function IconButton({ label, className, children, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx(styles.iconButton, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
