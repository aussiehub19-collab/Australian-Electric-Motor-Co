'use client';

import React, { useState } from 'react';
import { SITE, LEGAL } from '@/config/site';

export function AbnBar() {
  const [copied, setCopied] = useState(false);
  const abnFormatted = LEGAL?.abn || SITE?.abn || '80 943 436 857';
  const abnDigits = LEGAL?.abnRaw || '80943436857';
  const abrUrl = LEGAL?.abrUrl || `https://abr.business.gov.au/ABN/View?id=${abnDigits}`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(abnFormatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id="abn-verification-bar"
      className="bg-[#0B0D10] border-t border-[#23272E] py-1.5 sm:py-2 px-4 sm:px-6 lg:px-8 transition-colors"
      aria-label="Australian Business Verification"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[11px] sm:text-xs font-mono">
        {/* Left Side: Clickable Verify on ABR in front of ABN */}
        <div className="flex items-center flex-wrap gap-2 text-stone-300">
          <span className="inline-flex items-center gap-1.5 text-stone-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span className="text-stone-300 font-medium">Australian Registered Business:</span>
          </span>

          {/* Clickable "Verify on ABR" in front */}
          <a
            id="nav-abr-verification-link"
            href={abrUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-amber-400 hover:text-white bg-[#1A1D22] hover:bg-[#8C4A2F]/40 border border-amber-500/40 hover:border-amber-400 px-2 py-0.5 rounded transition shadow-sm group focus:outline-none focus:ring-1 focus:ring-amber-400"
            title="Verify official registration on the Australian Business Register (abr.business.gov.au)"
          >
            <span>Verify on ABR</span>
            <svg
              className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 opacity-80 group-hover:opacity-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>

          {/* ABN Display with copy option */}
          <div className="inline-flex items-center gap-1.5 bg-[#14161A] border border-[#262A33] px-2 py-0.5 rounded text-stone-200">
            <span className="text-stone-400 font-normal">ABN</span>
            <span className="font-bold text-white tracking-wider">{abnFormatted}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[10px] text-stone-400 hover:text-amber-400 ml-1 transition cursor-pointer p-0.5"
              title="Copy ABN to clipboard"
              aria-label="Copy ABN to clipboard"
            >
              {copied ? (
                <span className="text-emerald-400 font-bold">✓ Copied</span>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Trust signals */}
        <div className="hidden md:flex items-center gap-3 text-[11px] text-stone-400">
          <span className="text-emerald-400 font-medium">✓ Official Dealer &amp; Workshop</span>
          <span>•</span>
          <span>NSW &amp; Nationwide Crate Dispatch</span>
          <span>•</span>
          <span className="text-amber-300/90 font-medium">GST Included In All Prices</span>
        </div>
      </div>
    </div>
  );
}
