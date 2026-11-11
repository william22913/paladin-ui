import { NotFoundState } from '../components/app/NotFoundState';
import { cx } from '../helpers/cx';
import styles from './pages.module.css';

export function NotFoundPage() {
  return (
    <div className={cx('container', styles.statePage)}>
      <NotFoundState />
    </div>
  );
}
