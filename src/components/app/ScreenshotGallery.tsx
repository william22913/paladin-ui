import { useState } from 'react';
import type { AppDetail } from '../../core/api/types';
import { ArtImage } from '../ui/ArtImage';
import { cx } from '../../helpers/cx';
import styles from './app.module.css';

/** Lead image plus thumbnails; no autoplay, arrow-key operable (REQ-012). */
export function ScreenshotGallery({ app }: { app: AppDetail }) {
  const shots = app.screenshots.length > 0 ? app.screenshots : [app.coverUrl];
  const [index, setIndex] = useState(0);
  const current = Math.min(index, shots.length - 1);

  const move = (direction: 1 | -1) => {
    setIndex((value) => (value + direction + shots.length) % shots.length);
  };

  return (
    <div className={styles.gallery}>
      <div
        className={styles.lead}
        tabIndex={0}
        role="group"
        aria-label={`${app.name} screenshots, use the arrow keys to change`}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            move(1);
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        <ArtImage
          key={shots[current]}
          src={shots[current]}
          alt={`${app.name}, screen ${current + 1} of ${shots.length}`}
          eager
        />
      </div>
      {shots.length > 1 ? (
        <div className={styles.thumbs} role="group" aria-label="Screenshots">
          {shots.map((shot, shotIndex) => (
            <button
              key={shot}
              type="button"
              className={cx(styles.thumb, shotIndex === current && styles.thumbActive)}
              aria-label={`Show screenshot ${shotIndex + 1}`}
              aria-pressed={shotIndex === current}
              onClick={() => setIndex(shotIndex)}
            >
              <ArtImage src={shot} alt="" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
