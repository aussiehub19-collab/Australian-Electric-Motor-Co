'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CONTACT, FORMS, SITE } from '@/config/site';

export default function WholesalePage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const form = e.currentTarget;
    const keyInput = form.querySelector('[name="access_key"]') as HTMLInputElement;
    const key = keyInput?.value;

    if (!key || key === 'pending' || key.startsWith('YOUR-')) {
      window.location.href = '/thank-you-wholesale/';
      return;
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: new FormData(form),
      });

      const data = await res.json();
      if (res.status === 200 && data.success) {
        window.location.href = '/thank-you-wholesale/';
      } else {
        throw new Error(data?.message || 'Submission failed');
      }
    } catch (err: any) {
      console.error('Wholesale form submission error:', err);
      setErrorMessage('Unable to submit inquiry automatically. Please contact our commercial director via WhatsApp or phone.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Breadcrumb nav */}
      <nav aria-label="Breadcrumb" className="text-xs text-stone-400 font-mono flex items-center gap-2">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <span className="text-[#C87D55]">Commercial &amp; Wholesale</span>
      </nav>

      {/* Header with Single H1 */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C87D55] font-mono">
          B2B Fleet &amp; Dealership Network
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
          Commercial Fleets &amp; Wholesale
        </h1>
        <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
          Supplying heavy-duty electric dirt bikes to pastoral cattle stations, ecotourism operators, forestry contractors, and regional Australian powersport dealerships.
        </p>
      </div>

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#17191C] border border-[#2B2F36] rounded-2xl p-6 space-y-3">
          <div className="text-2xl">🐂</div>
          <h3 className="text-base font-bold text-white font-mono uppercase">Station &amp; Ag Muster Fleets</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Silent operation prevents livestock agitation during boundary inspections and yard mustering. Zero petrol storage risks on remote outback stations.
          </p>
        </div>

        <div className="bg-[#17191C] border border-[#2B2F36] rounded-2xl p-6 space-y-3">
          <div className="text-2xl">🏕️</div>
          <h3 className="text-base font-bold text-white font-mono uppercase">Ecotourism &amp; Hire Tours</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Zero exhaust fumes and whisper-quiet motors open national park eco-tours and private farm ride parks without noise compliance friction.
          </p>
        </div>

        <div className="bg-[#17191C] border border-[#2B2F36] rounded-2xl p-6 space-y-3">
          <div className="text-2xl">🔧</div>
          <h3 className="text-base font-bold text-white font-mono uppercase">Dealer Stocking Tiers</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Generous dealer margin structures, full spare parts consignments, and technical training for Australian motorcycle repair workshops.
          </p>
        </div>
      </div>

      {/* Inquiry Form & Wholesale Terms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <div className="bg-[#17191C] border border-[#2B2F36] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <h2 className="text-xl font-bold uppercase text-white font-mono">
            Wholesale / Fleet Application
          </h2>

          {errorMessage && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="access_key" value={FORMS.web3formsKey || 'pending'} />
            <input type="hidden" name="subject" value="Commercial / Wholesale Fleet Inquiry — Dirt & Co" />
            <input type="hidden" name="from_name" value={SITE.name} />
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

            <div>
              <label htmlFor="company" className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Business / Station Name &amp; ABN *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                placeholder="e.g. Outback Pastoral Co (ABN 12 345 678)"
                className="w-full bg-[#1D2024] border border-[#2B2F36] rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Contact Person *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="e.g. Darcy Miller"
                  className="w-full bg-[#1D2024] border border-[#2B2F36] rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Corporate Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="fleet@company.com.au"
                  className="w-full bg-[#1D2024] border border-[#2B2F36] rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="units" className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Estimated Unit Requirement
                </label>
                <select
                  id="units"
                  name="units"
                  className="w-full bg-[#1D2024] border border-[#2B2F36] rounded-xl px-4 py-3 text-sm text-stone-100 focus:ring-1 focus:ring-amber-500"
                >
                  <option value="2-4 Units">2 – 4 Units (Small Fleet)</option>
                  <option value="5-9 Units">5 – 9 Units (Commercial Fleet)</option>
                  <option value="10+ Units">10+ Units (Regional Dealer Tier)</option>
                </select>
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  placeholder="0400 000 000"
                  className="w-full bg-[#1D2024] border border-[#2B2F36] rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Application Details / Operational Requirements
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Describe your location, terrain, charging setup (e.g. station solar), and required timeline..."
                className="w-full bg-[#1D2024] border border-[#2B2F36] rounded-xl p-4 text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8C4A2F] hover:bg-[#A35839] text-white font-bold py-4 px-6 rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? <span>Submitting Application...</span> : <span>Submit Commercial Inquiry &rarr;</span>}
            </button>
          </form>
        </div>

        {/* Pricing & Terms */}
        <div className="space-y-6">
          <div className="bg-[#17191C] border border-[#2B2F36] rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-white font-mono uppercase">
              Wholesale Volume Benefits
            </h3>
            <ul className="space-y-3 text-xs text-stone-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold font-mono">✓</span>
                <span><strong>Tiered B2B Margins:</strong> Competitive discounts starting at 2+ crated bikes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold font-mono">✓</span>
                <span><strong>Priority Spare Parts:</strong> Dedicated Sunshine Coast inventory reserved exclusively for commercial fleets.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold font-mono">✓</span>
                <span><strong>Custom Station Racks:</strong> Optional heavy-duty front luggage racks, gun scabbards, and muster whips.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold font-mono">✓</span>
                <span><strong>Australian Direct Warranty:</strong> Technicians on call with overnight express parts dispatch across regional Australia.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-[#141619] border border-[#2B2F36] rounded-2xl space-y-2">
            <div className="text-xs font-mono text-[#C87D55] uppercase font-bold">
              Fast-Track Direct Contact
            </div>
            <p className="text-xs text-stone-300">
              Need immediate pricing for tender documents or government grants? Reach out directly to our commercial manager on WhatsApp at{' '}
              <a href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}`} className="text-emerald-400 font-mono underline">
                {CONTACT.whatsapp}
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
