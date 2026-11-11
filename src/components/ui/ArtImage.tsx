import { useEffect, useState, type ImgHTMLAttributes } from 'react';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'onError' | 'loading'> & {
  eager?: boolean;
};

/** Shared artwork image: lazy by default and degrades to a local dark placeholder. */
export function ArtImage({ src, alt, eager, ...rest }: Props) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return (
    <img
      {...rest}
      src={failed || !src ? '/art-fallback.svg' : src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
