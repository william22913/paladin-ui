import type { ReactNode } from 'react';
import { cx } from '../../helpers/cx';
import styles from './ui.module.css';

interface StateBlockProps {
  code?: string;
  title: string;
  text?: ReactNode;
  actions?: ReactNode;
  centered?: boolean;
}

export function StateBlock({ code, title, text, actions, centered }: StateBlockProps) {
  return (
    <div className={cx(styles.state, centered && styles.stateCentered)}>
      {code ? <p className={styles.stateCode}>{code}</p> : null}
      <h2 className={styles.stateTitle}>{title}</h2>
      {text ? <p className={styles.stateText}>{text}</p> : null}
      {actions ? <div className={styles.stateActions}>{actions}</div> : null}
    </div>
  );
}
