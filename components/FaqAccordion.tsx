'use client';

import React, { useId, useState } from 'react';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  /** Index of an item to open on first render. Default: all closed. */
  defaultOpen?: number;
  /**
   * Distinguishes the `faq-answer-N` ids below when a page renders more than
   * one FaqAccordion (e.g. /faq/'s themed sections) — without it, every
   * instance would emit the same ids and buildFaqSchema()'s speakable
   * selector (or any instance) could point at the wrong section's answer.
   * Leave unset for a page's single/primary FAQ block.
   */
  idPrefix?: string;
}

/** Collapsible FAQ list — answers reveal only when the question is clicked. */
export function FaqAccordion({ items, defaultOpen, idPrefix }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen ?? null);
  const baseId = useId();

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <div
            key={i}
            className={`overflow-hidden rounded-2xl border bg-[#17191C] transition-colors ${
              isOpen ? 'border-[#8C4A2F]' : 'border-[#2B2F36] hover:border-[#8C4A2F]/60'
            }`}
          >
            <h3 className="m-0">
              <button
                type="button"
                id={btnId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
              >
                <span className="flex items-start gap-3 text-sm font-bold text-stone-100 sm:text-base">
                  <span className="font-mono text-[#C87D55]">Q.</span>
                  <span>{item.question}</span>
                </span>
                <svg
                  className={`h-4 w-4 flex-shrink-0 text-[#C87D55] transition-transform duration-200 motion-reduce:transition-none ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="px-5 pb-5 sm:px-6"
            >
              {/* Stable index-based id (not the random useId panelId above) so
                  lib/faq.ts's buildFaqSchema() speakable cssSelector can point
                  at the exact answer it names — the visible DOM and the
                  structured-data claim must reference the same node. */}
              <p id={`${idPrefix ? `${idPrefix}-` : ''}faq-answer-${i}`} className="pl-7 text-sm leading-relaxed text-stone-300">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
