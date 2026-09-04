'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface SmartImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  aspectRatio?: string;
  /** how the image sits in its box — 'cover' fills & crops (photo tiles), 'contain' fits whole (product shots) */
  fit?: 'cover' | 'contain';
  objectPosition?: string;
  sizes?: string;
  /**
   * When true, the image is rendered with next/image `fill` and absolutely
   * fills the parent box (which must be `position: relative` and sized).
   * `className` here is applied to a padding wrapper — use it for `p-*`.
   */
  fill?: boolean;
}

const DEFAULT_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

export function SmartImage({
  src,
  alt,
  width = 800,
  height = 600,
  priority = false,
  className = '',
  aspectRatio = '4/3',
  fit = 'cover',
  objectPosition,
  sizes,
  fill = false,
}: SmartImageProps) {
  const [error, setError] = useState(false);

  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="%2317191C"><rect width="800" height="600" fill="%2317191C"/><text x="50%25" y="48%25" dominant-baseline="middle" text-anchor="middle" fill="%238C4A2F" font-family="sans-serif" font-size="26" font-weight="bold">AUSTRALIAN ELECTRIC MOTOR CO</text><text x="50%25" y="55%25" dominant-baseline="middle" text-anchor="middle" fill="%239CA3AF" font-family="sans-serif" font-size="16">Australian Electric Dirt Bikes</text></svg>`;

  const resolvedSrc = error ? fallbackSvg : src;
  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover';
  const imgClass = `${fitClass} transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none`;

  if (fill) {
    // Parent must be position:relative + sized. This wrapper carries optional padding.
    return (
      <div className={`absolute inset-0 ${className}`}>
        <div className="relative h-full w-full">
          <Image
            src={resolvedSrc}
            alt={alt || 'Australian Electric Motor Co electric dirt bike'}
            fill
            priority={priority}
            onError={() => setError(true)}
            style={objectPosition ? { objectPosition } : undefined}
            className={imgClass}
            sizes={sizes || DEFAULT_SIZES}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
      <Image
        src={resolvedSrc}
        alt={alt || 'Australian Electric Motor Co electric dirt bike'}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        onError={() => setError(true)}
        style={objectPosition ? { objectPosition } : undefined}
        className={`h-full w-full ${imgClass}`}
        sizes={sizes || DEFAULT_SIZES}
      />
    </div>
  );
}
