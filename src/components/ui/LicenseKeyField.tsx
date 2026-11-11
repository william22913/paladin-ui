import { Check, Copy } from 'lucide-react';
import { useCopy } from '../../core/hooks/useCopy';
import { cx } from '../../helpers/cx';
import styles from './ui.module.css';

/** MO-009: the label confirms inline for 1.5s; keys are shown in full to the owner. */
export function LicenseKeyField({ value }: { value: string }) {
  const { copied, copy } = useCopy();

  return (
    <div className={styles.license}>
      <span className={styles.licenseLabel}>License key</span>
      <div className={styles.licenseRow}>
        <code className={styles.licenseKey}>{value}</code>
        <button
          type="button"
          className={cx(styles.copyButton, copied && styles.copyDone)}
          onClick={() => void copy(value)}
        >
          {copied ? (
            <Check size={14} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Copy size={14} strokeWidth={1.5} aria-hidden="true" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
