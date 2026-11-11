import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { cx } from '../../helpers/cx';
import styles from './ui.module.css';

type Tone = 'info' | 'success' | 'warning' | 'error';

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: AlertCircle,
} as const;

const toneClass = {
  info: styles.noticeInfo,
  success: styles.noticeSuccess,
  warning: styles.noticeWarning,
  error: styles.noticeError,
} as const;

export function InlineNotice({
  tone = 'info',
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  const Icon = icons[tone];
  return (
    <div
      className={cx(styles.notice, toneClass[tone])}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
      <div className={styles.noticeText}>{children}</div>
    </div>
  );
}
