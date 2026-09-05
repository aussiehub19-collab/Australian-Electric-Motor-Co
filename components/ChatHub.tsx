'use client';

import React, { useState } from 'react';
import { CONTACT } from '@/config/site';
import { waLink } from '@/lib/whatsapp';

export function ChatHub() {
  const [open, setOpen] = useState(false);

  const whatsappUrl = waLink(
    `Hi, I have a question about your electric dirt bikes and NSW test rides.`,
  );
  const emailUser = CONTACT.email.split('@')[0];
  const emailDomain = CONTACT.email.split('@')[1];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Menu */}
      {open && (
        <div className="mb-3 w-72 bg-[#17191C] border border-[#2B2F36] rounded-2xl shadow-2xl p-4 text-stone-100 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#2B2F36]">
            <div>
              <h4 className="text-sm font-bold text-white">Technician Chat</h4>
              <p className="text-xs text-stone-400">NSW Workshop &amp; Dispatch</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 text-stone-400 hover:text-white"
              aria-label="Close chat options"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="py-3 space-y-2.5">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-white transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center text-black flex-shrink-0 font-bold">
                WA
              </div>
              <div className="text-xs">
                <div className="font-semibold text-emerald-300">WhatsApp Live Chat</div>
                <div className="text-stone-400 text-[11px]">Instant tech &amp; stock check</div>
              </div>
            </a>

            {/* Phone */}
            <a
              href={`tel:${CONTACT.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1D2024] hover:bg-[#24282E] border border-[#2B2F36] text-white transition"
            >
              <div className="w-8 h-8 rounded-lg bg-[#8C4A2F] flex items-center justify-center text-white flex-shrink-0">
                📞
              </div>
              <div className="text-xs">
                <div className="font-semibold text-stone-200">Workshop Phone</div>
                <div className="text-stone-400 font-mono text-[11px]">{CONTACT.phone}</div>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${emailUser}&#64;${emailDomain}?subject=Electric%20Dirt%20Bike%20Inquiry`}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1D2024] hover:bg-[#24282E] border border-[#2B2F36] text-white transition"
            >
              <div className="w-8 h-8 rounded-lg bg-stone-700 flex items-center justify-center text-white flex-shrink-0">
                ✉️
              </div>
              <div className="text-xs">
                <div className="font-semibold text-stone-200">Email Inquiry</div>
                <div className="text-stone-400 font-mono text-[11px]">
                  {emailUser}&#64;{emailDomain}
                </div>
              </div>
            </a>
          </div>

          <p className="text-[10px] text-stone-400 text-center pt-2 border-t border-[#2B2F36]">
            Mon–Sat: 8am – 5pm AEST • Test rides by appointment
          </p>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8C4A2F] to-[#6D3720] hover:from-[#A35839] hover:to-[#8C4A2F] text-white shadow-2xl flex items-center justify-center transition-transform hover:scale-105 border-2 border-[#C87D55]/50 focus-visible:ring-2 focus-visible:ring-amber-400"
        aria-label="Open rider support and technician chat"
        aria-expanded={open}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>
    </div>
  );
}
