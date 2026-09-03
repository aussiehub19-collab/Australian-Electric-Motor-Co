'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import { TRUSTPILOT_DATA, REVIEWS } from '@/config/site';

export function ReviewSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [itemsPerView, setItemsPerView] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Filter reviews by tag
  const filteredReviews = selectedTag === 'All'
    ? REVIEWS
    : REVIEWS.filter((r) => r.tag === selectedTag);

  const totalSlides = filteredReviews.length;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectTag = (tag: string) => {
    setSelectedTag(tag);
    setCurrentIndex(0);
  };

  const maxIndex = Math.max(0, totalSlides - itemsPerView);

  // Autoplay interval with pause on hover
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, totalSlides, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch handlers for mobile swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const tags = ['All', 'Build & Durability', 'Customer Support', 'Fast Delivery', 'Trail Tested'];

  return (
    <section
      id="verified-rider-reviews"
      aria-labelledby="reviews-heading"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Outer Card Container */}
      <div className="bg-[#17191C] border border-[#2B2F36] rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl">
        {/* Subtle Ambient Background Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00B67A]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8C4A2F]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header: TrustScore Summary Banner (Non-clickable) */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#23272E] relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121417] border border-[#2B2F36] text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-[#00B67A] animate-pulse" />
              <span className="font-bold">VERIFIED REVIEWS PROFILE</span>
              <span className="text-stone-500">&bull;</span>
              <span className="text-stone-300">AUSTRALIAN HERITAGE</span>
            </div>

            <h2
              id="reviews-heading"
              className="text-2xl sm:text-4xl font-extrabold uppercase text-white tracking-tight"
            >
              What Australian Riders Say
            </h2>

            <p className="text-sm text-stone-400 max-w-2xl leading-relaxed">
              Real feedback from Australian trail riders and powersports owners. Backed by an{' '}
              <strong className="text-white font-semibold">{TRUSTPILOT_DATA.ratingText} {TRUSTPILOT_DATA.score} out of 5</strong>{' '}
              reputation from over <strong className="text-white font-semibold">{TRUSTPILOT_DATA.totalReviews}</strong> customer reviews across our Australian engineering operations.
            </p>
          </div>

          {/* TrustScore Static Badge Widget (Non-clickable by design) */}
          <div className="flex-shrink-0 bg-[#121417] border border-[#2B2F36] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 shadow-inner">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {TRUSTPILOT_DATA.score}
                </span>
                <span className="text-xs font-mono text-stone-400 self-end pb-1">/ 5.0</span>
                <span className="ml-1 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#00B67A]/20 text-[#00B67A] border border-[#00B67A]/30">
                  {TRUSTPILOT_DATA.ratingText}
                </span>
              </div>
              <div className="text-[11px] font-mono text-stone-400 mt-1">
                Based on <strong className="text-stone-200 font-semibold">{TRUSTPILOT_DATA.totalReviews}</strong> verified ratings
              </div>
            </div>

            {/* 5 Green Trustpilot-Style Stars */}
            <div className="flex items-center gap-1 bg-[#1A1D21] px-3 py-2 rounded-xl border border-[#2B2F36]">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded bg-[#00B67A] flex items-center justify-center text-white text-xs shadow-sm"
                  aria-hidden="true"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Chips Bar & Navigation Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 relative z-10">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-stone-500 mr-1 hidden sm:inline">Filter:</span>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                id={`filter-${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => handleSelectTag(tag)}
                className={`text-xs font-mono px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-[#8C4A2F] text-white font-bold shadow-md shadow-[#8C4A2F]/20'
                    : 'bg-[#121417] text-stone-400 hover:text-white border border-[#2B2F36] hover:border-stone-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Prev / Next Controls & Slide Indicator */}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs font-mono text-stone-400 mr-2">
              <span className="text-white font-bold">{currentIndex + 1}</span> / {totalSlides}
            </span>

            <button
              type="button"
              id="slider-prev-btn"
              onClick={handlePrev}
              aria-label="Previous review"
              className="w-10 h-10 rounded-xl bg-[#121417] hover:bg-[#23272E] text-stone-200 hover:text-white border border-[#2B2F36] flex items-center justify-center transition cursor-pointer shadow-sm active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              id="slider-next-btn"
              onClick={handleNext}
              aria-label="Next review"
              className="w-10 h-10 rounded-xl bg-[#8C4A2F] hover:bg-[#A35839] text-white flex items-center justify-center transition cursor-pointer shadow-md shadow-[#8C4A2F]/20 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel Viewport Container */}
        <div
          className="relative overflow-hidden pt-2 pb-4 z-10"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Sliding Track */}
          <div
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{
              transform: `translateX(-${currentIndex * (100 / Math.max(1, itemsPerView))}%)`,
            }}
          >
            {filteredReviews.map((review, idx) => {
              const initials = review.author
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase();

              return (
                <div
                  key={review.id}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0"
                >
                  <div className="h-full bg-[#121417] border border-[#2B2F36] hover:border-[#8C4A2F]/70 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-black/60 group">
                    <div className="space-y-4">
                      {/* Card Top: 5 Stars + Tag */}
                      <div className="flex items-center justify-between gap-2">
                        {/* 5 Green Trustpilot Stars */}
                        <div className="flex items-center gap-1" aria-label={`${review.rating} out of 5 stars`}>
                          {[...Array(review.rating)].map((_, starI) => (
                            <div
                              key={starI}
                              className="w-4 h-4 rounded bg-[#00B67A] flex items-center justify-center text-white"
                            >
                              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            </div>
                          ))}
                        </div>

                        {/* Category Tag */}
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#1D2024] text-[#C87D55] border border-[#2B2F36]">
                          {review.tag}
                        </span>
                      </div>

                      {/* Review Title */}
                      <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition leading-snug">
                        &ldquo;{review.title}&rdquo;
                      </h3>

                      {/* Review Body */}
                      <p className="text-xs sm:text-sm text-stone-300 leading-relaxed italic">
                        {review.body}
                      </p>
                    </div>

                    {/* Review Author & Verification Footer */}
                    <div className="pt-4 border-t border-[#23272E] mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Author Initials Avatar */}
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8C4A2F] to-[#5C2E1B] text-white font-bold font-mono text-xs flex items-center justify-center flex-shrink-0 shadow">
                          {initials}
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {review.author}
                          </div>
                          <div className="text-[10px] font-mono text-stone-400 truncate">
                            {review.location} &bull; {review.date}
                          </div>
                        </div>
                      </div>

                      {/* Verified Badge */}
                      <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex-shrink-0">
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Slider Bottom Progress & Indicators */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#23272E] relative z-10">
          {/* Dot Indicators */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Review slider pagination">
            {[...Array(maxIndex + 1)].map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                id={`dot-indicator-${dotIdx}`}
                role="tab"
                aria-selected={currentIndex === dotIdx}
                aria-label={`Go to slide ${dotIdx + 1}`}
                onClick={() => setCurrentIndex(dotIdx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === dotIdx
                    ? 'w-8 bg-[#8C4A2F]'
                    : 'w-2 bg-[#2B2F36] hover:bg-stone-500'
                }`}
              />
            ))}
          </div>

          {/* Trust Stat Points */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-6 text-[11px] font-mono text-stone-400">
            <span className="flex items-center gap-1">
              <span className="text-emerald-400">✓</span> 100% Genuine Australian Reviews
            </span>
            <span className="flex items-center gap-1">
              <span className="text-emerald-400">✓</span> High-Tensile Alloy &amp; Electric Moto Build
            </span>
            <span className="flex items-center gap-1">
              <span className="text-emerald-400">✓</span> Fast Nationwide Dispatch
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
