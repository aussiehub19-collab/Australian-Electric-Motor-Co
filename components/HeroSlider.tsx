'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface HeroSliderProps {
  images: { src: string; alt: string }[];
  interval?: number;
}

/**
 * Full-bleed rotating hero background. Renders only the image layer + a light
 * scrim; the headline/CTA content is layered over it by the page. The text
 * stays fixed while the background crossfades, so there is still exactly one
 * <h1> and zero layout shift.
 */
export function HeroSlider({ images, interval = 5500 }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced || images.length < 2) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [reduced, images.length, interval]);

  const goto = (i: number) => {
    setIndex(i);
    if (timer.current) {
      clearInterval(timer.current);
      if (!reduced && images.length > 1) {
        timer.current = setInterval(
          () => setIndex((x) => (x + 1) % images.length),
          interval,
        );
      }
    }
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {images.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i === index ? undefined : true}
        >
          <Image
            src={img.src}
            alt={i === 0 ? img.alt : ''}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}

      {/* Light scrim — weighted to top + bottom so the photo stays bright behind the headline */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1012]/75 via-[#0f1012]/10 to-[#0f1012]/80" />

      {/* Slide indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => goto(i)}
              aria-label={`Show hero image ${i + 1} of ${images.length}`}
              aria-current={i === index ? 'true' : undefined}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-7 bg-[#C87D55]' : 'w-1.5 bg-white/45 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
