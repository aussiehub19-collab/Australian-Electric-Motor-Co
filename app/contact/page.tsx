'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CONTACT, FORMS, SITE } from '@/config/site';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const form = e.currentTarget;
    const keyInput = form.querySelector('[name="access_key"]') as HTMLInputElement;
    const key = keyInput?.value;

    // WebForge v9.1 Mandate: Key-pending fallback
    if (!key || key === 'pending' || key.startsWith('YOUR-')) {
      window.location.href = '/thank-you-contact/';
      return;
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          Accept: 'application/json', // Accept ONLY — NO Content-Type
        },
        body: new FormData(form),
      });

      const data = await res.json();
      if (res.status === 200 && data.success) {
        window.location.href = '/thank-you-contact/';
      } else {
        throw new Error(data?.message || 'Submission failed');
      }
    } catch (err: any) {
      console.error('Contact submission error:', err);
      setErrorMessage(
        'Unable to send message automatically. Please contact our NSW workshop directly via WhatsApp or email below.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Breadcrumb nav */}
      <nav aria-label="Breadcrumb" className="text-xs text-stone-400 font-mono flex items-center gap-2">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <span className="text-[#C87D55]">Contact &amp; HQ</span>
      </nav>

      {/* Header with Single H1 */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C87D55] font-mono">
          NSW Technical Facility &bull; ABN 97 628 671 689
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
          Get in Touch with Australian Electric Motor Co
        </h1>
        <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
          Book an electric dirt bike consultation, inquire about nationwide crate delivery, or speak directly with our Australian engineering and support team. All prices are GST inclusive.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form Container */}
        <div className="bg-[#17191C] border border-[#2B2F36] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <h2 className="text-xl font-bold uppercase text-white font-mono">
            Send Technical Inquiry
          </h2>

          {errorMessage && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hidden Inputs Required by WebForge & Web3Forms */}
            <input type="hidden" name="access_key" value={FORMS.web3formsKey || 'pending'} />
            <input type="hidden" name="subject" value="New Electric Dirt Bike Inquiry — Australian Electric Motor Co" />
            <input type="hidden" name="from_name" value={SITE.name} />
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Your Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="e.g. Liam Cooper"
                className="w-full bg-[#1D2024] border border-[#2B2F36] rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="rider@example.com.au"
                  className="w-full bg-[#1D2024] border border-[#2B2F36] rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="0400 000 000"
                  className="w-full bg-[#1D2024] border border-[#2B2F36] rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="interest" className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Area of Interest
              </label>
              <select
                id="interest"
                name="interest"
                className="w-full bg-[#1D2024] border border-[#2B2F36] rounded-xl px-4 py-3 text-sm text-stone-100 focus:ring-1 focus:ring-amber-500"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Apex 72R Pro MX">Apex 72R Pro Motocross (22kW)</option>
                <option value="Terra-X Stealth Trail">Terra-X Stealth Trail Bike</option>
                <option value="Outback Scout Enduro">Outback Scout Station E-Moto</option>
                <option value="Book Test Ride NSW">Book NSW Test Ride / Consultation</option>
                <option value="Finance Pre-Approval">Finance &amp; Pay in 4 Inquiries</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Your Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                placeholder="Tell us about your riding experience, property size, or questions..."
                className="w-full bg-[#1D2024] border border-[#2B2F36] rounded-xl p-4 text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8C4A2F] hover:bg-[#A35839] text-white font-bold py-4 px-6 rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Dispatching Message...</span>
              ) : (
                <span>Send Message to Australian Electric Motor Co &rarr;</span>
              )}
            </button>
          </form>
        </div>

        {/* HQ Details & Direct Channels */}
        <div className="space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="p-6 bg-[#17191C] border border-[#2B2F36] rounded-2xl space-y-3">
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                NSW Technical Headquarters &amp; Dispatch
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                {CONTACT.address}
              </p>
              <p className="text-xs text-stone-400">
                Opening Hours: Monday – Saturday, 8:00 AM – 5:00 PM AEST
              </p>
              <div className="pt-2 text-xs font-mono text-emerald-400">
                • ABN 97 628 671 689 &bull; Registered for GST (10% Inc. in All Prices)
              </div>
            </div>

            <div className="p-6 bg-[#17191C] border border-[#2B2F36] rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                Direct Communication Channels
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#25D366] text-black font-bold flex items-center justify-center flex-shrink-0 text-xs">
                    WA
                  </div>
                  <div>
                    <div className="text-xs text-stone-400">WhatsApp Instant Chat:</div>
                    <a
                      href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline font-mono"
                    >
                      {CONTACT.whatsapp}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#8C4A2F] text-white flex items-center justify-center flex-shrink-0 text-xs">
                    📞
                  </div>
                  <div>
                    <div className="text-xs text-stone-400">Workshop Phone:</div>
                    <a
                      href={`tel:${CONTACT.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-stone-200 hover:underline font-mono"
                    >
                      {CONTACT.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-700 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    ✉️
                  </div>
                  <div>
                    <div className="text-xs text-stone-400">Direct Email:</div>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="text-[#C87D55] hover:underline font-mono"
                    >
                      {CONTACT.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logistics banner */}
          <div className="p-6 bg-[#141619] border border-[#23272E] rounded-2xl space-y-2">
            <h4 className="text-xs font-bold uppercase text-white font-mono">
              Nationwide Crate Logistics
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              We ship crated electric dirt bikes daily to regional and metro transport depots throughout Queensland, NSW, Victoria, SA, WA, Tasmania, and the Northern Territory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
