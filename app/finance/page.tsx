'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS, CONTACT, SITE, FINANCE, SHOP } from '@/config/site';

export default function FinancePage() {
  const bikes = PRODUCTS.filter((p) => !p.category.includes('parts') && !p.category.includes('gear'));

  const [financeMode, setFinanceMode] = useState<'pay-in-4' | 'commercial'>('pay-in-4');
  const [selectedBikePrice, setSelectedBikePrice] = useState<number>(bikes[0]?.price || 11950);
  const [deposit, setDeposit] = useState<number>(1000);
  const [termMonths, setTermMonths] = useState<number>(36);

  // Pay in 4 calculation: 4 equal fortnightly payments (0% interest)
  const payIn4Instalment = Math.round(selectedBikePrice / 4);

  // Commercial / Station Asset Loan math
  const principal = Math.max(0, selectedBikePrice - deposit);
  const interestRate = 8.9; // Indicative commercial rate
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment =
    monthlyRate > 0 && termMonths > 0
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)
      : principal / (termMonths || 1);

  const weeklyPayment = Math.round((monthlyPayment * 12) / 52);
  const totalRepayable = Math.round(monthlyPayment * termMonths) + deposit;
  const totalInterest = Math.max(0, totalRepayable - selectedBikePrice);

  const whatsappUrl = `https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    financeMode === 'pay-in-4'
      ? `G'day Australian Electric Motor Co! I want to order a bike valued at $${selectedBikePrice.toLocaleString()} AUD using the Pay in 4 plan (4x $${payIn4Instalment.toLocaleString()} AUD fortnightly payments). Can you assist with setup and crate delivery to my address?`
      : `G'day Australian Electric Motor Co! I am inquiring about commercial / station asset finance for $${selectedBikePrice.toLocaleString()} AUD with a $${deposit.toLocaleString()} deposit over ${termMonths} months (approx. $${weeklyPayment}/week). Can you connect me with your Australian finance broker?`
  )}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-xs text-stone-400 font-mono flex items-center gap-2">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <span className="text-[#C87D55]">Pay in 4 &amp; Finance</span>
      </nav>

      {/* Header with Single H1 */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C87D55] font-mono">
          Flexible Australian Rider Finance
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight font-sans">
          Pay in 4 &amp; Moto Asset Finance
        </h1>
        <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
          Ride now, pay later with our interest-free <strong>Pay in 4</strong> fortnightly plan, or structure commercial asset finance for farm, station, and fleet utility ebikes across Australia.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex border border-[#2B2F36] bg-[#141619] p-1.5 rounded-2xl max-w-md">
        <button
          type="button"
          onClick={() => setFinanceMode('pay-in-4')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold transition ${
            financeMode === 'pay-in-4'
              ? 'bg-[#8C4A2F] text-white shadow-lg'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          Pay in 4 (0% Interest)
        </button>
        <button
          type="button"
          onClick={() => setFinanceMode('commercial')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-mono font-bold transition ${
            financeMode === 'commercial'
              ? 'bg-[#8C4A2F] text-white shadow-lg'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          Station / Asset Finance
        </button>
      </div>

      {/* PAY IN 4 CALCULATOR SECTION */}
      {financeMode === 'pay-in-4' && (
        <div className="bg-[#17191C] border border-[#2B2F36] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Controls Left */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="bike-select-pay4" className="text-xs font-semibold text-stone-300 uppercase tracking-wider font-mono">
                  Select Bike or Enter Order Value
                </label>
                <select
                  id="bike-select-pay4"
                  value={selectedBikePrice}
                  onChange={(e) => setSelectedBikePrice(Number(e.target.value))}
                  className="w-full bg-[#1D2024] border border-[#2B2F36] rounded-xl px-4 py-3 text-sm text-stone-100 font-mono focus:ring-1 focus:ring-amber-500"
                >
                  {bikes.map((b) => (
                    <option key={b.slug} value={b.price}>
                      {b.name} (${b.price.toLocaleString()} AUD)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="custom-val-input" className="text-xs font-semibold text-stone-300 uppercase tracking-wider font-mono">
                  Or Enter Order Total (AUD)
                </label>
                <input
                  id="custom-val-input"
                  type="number"
                  min="200"
                  step="50"
                  value={selectedBikePrice}
                  onChange={(e) => setSelectedBikePrice(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[#1D2024] border border-[#2B2F36] rounded-xl px-4 py-3 text-sm text-stone-100 font-mono focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#141619] border border-[#2B2F36] space-y-2 text-xs font-mono text-stone-300">
                <div className="text-amber-300 font-bold uppercase tracking-wider">
                  ✓ Pay in 4 Advantages
                </div>
                <ul className="space-y-1.5 text-stone-400">
                  <li>• 0% interest, no hidden merchant administration surcharges</li>
                  <li>• Split into 4 equal fortnightly instalments</li>
                  <li>• Available across all electric dirt bikes, upgrade kits, and gear</li>
                  <li>• First payment processed on order confirmation; bike dispatched immediately</li>
                </ul>
              </div>
            </div>

            {/* Results Right: Schedule Breakdown */}
            <div className="bg-[#121417] border border-[#2B2F36] rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#C87D55] uppercase tracking-wider font-bold">
                    Fortnightly Schedule
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                    0% APR
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#17191C] border border-[#2B2F36] text-center space-y-1">
                  <span className="text-xs text-stone-400 font-mono">4 Equal Fortnightly Payments Of</span>
                  <div className="text-4xl sm:text-5xl font-black text-amber-400 font-mono">
                    ${payIn4Instalment.toLocaleString()}
                    <span className="text-base text-stone-400 font-normal"> AUD</span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">
                    Total order payable: ${selectedBikePrice.toLocaleString()} AUD
                  </span>
                </div>

                {/* 4 Steps timeline */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#17191C] border border-[#2B2F36] text-center space-y-1">
                    <span className="text-[10px] text-stone-400 uppercase">Payment 1</span>
                    <div className="font-bold text-white">${payIn4Instalment}</div>
                    <span className="text-[10px] text-amber-400">Today</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#17191C] border border-[#2B2F36] text-center space-y-1">
                    <span className="text-[10px] text-stone-400 uppercase">Payment 2</span>
                    <div className="font-bold text-white">${payIn4Instalment}</div>
                    <span className="text-[10px] text-stone-400">+2 Weeks</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#17191C] border border-[#2B2F36] text-center space-y-1">
                    <span className="text-[10px] text-stone-400 uppercase">Payment 3</span>
                    <div className="font-bold text-white">${payIn4Instalment}</div>
                    <span className="text-[10px] text-stone-400">+4 Weeks</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#17191C] border border-[#2B2F36] text-center space-y-1">
                    <span className="text-[10px] text-stone-400 uppercase">Payment 4</span>
                    <div className="font-bold text-white">${payIn4Instalment}</div>
                    <span className="text-[10px] text-stone-400">+6 Weeks</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#23272E]">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-lg"
                >
                  <span>Order With Pay in 4 on WhatsApp</span>
                </a>
                <p className="text-[10px] text-stone-400 text-center leading-relaxed">
                  *Pay in 4 available to Australian residents 18+. Subject to standard identity and card verification at checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMMERCIAL ASSET FINANCE SECTION */}
      {financeMode === 'commercial' && (
        <div className="bg-[#17191C] border border-[#2B2F36] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="comm-bike-select" className="text-xs font-semibold text-stone-300 uppercase tracking-wider font-mono">
                  Select Model / Asset
                </label>
                <select
                  id="comm-bike-select"
                  value={selectedBikePrice}
                  onChange={(e) => setSelectedBikePrice(Number(e.target.value))}
                  className="w-full bg-[#1D2024] border border-[#2B2F36] rounded-xl px-4 py-3 text-sm text-stone-100 font-mono focus:ring-1 focus:ring-amber-500"
                >
                  {bikes.map((b) => (
                    <option key={b.slug} value={b.price}>
                      {b.name} (${b.price.toLocaleString()} AUD)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-stone-300 uppercase font-mono">
                  <span>Upfront Deposit (AUD)</span>
                  <span className="text-amber-400 font-mono">${deposit.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={selectedBikePrice}
                  step="250"
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full accent-[#8C4A2F]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider font-mono">
                  Term Duration
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[12, 24, 36, 48].map((months) => (
                    <button
                      key={months}
                      type="button"
                      onClick={() => setTermMonths(months)}
                      className={`py-2.5 text-xs font-mono font-bold rounded-xl border transition ${
                        termMonths === months
                          ? 'bg-[#8C4A2F] border-[#C87D55] text-white shadow'
                          : 'bg-[#1D2024] border-[#2B2F36] text-stone-400 hover:text-white'
                      }`}
                    >
                      {months / 12} Yrs ({months}m)
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#121417] border border-[#2B2F36] rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-mono text-[#C87D55] uppercase tracking-wider font-bold">
                  Commercial Repayment Estimate
                </div>
                <div className="p-4 rounded-xl bg-[#17191C] border border-[#2B2F36] text-center space-y-1">
                  <span className="text-xs text-stone-400 font-mono">Estimated Weekly</span>
                  <div className="text-4xl sm:text-5xl font-black text-amber-400 font-mono">
                    ${weeklyPayment}
                    <span className="text-base text-stone-400 font-normal"> /wk</span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">
                    approx. ${Math.round(monthlyPayment)} / month
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono divide-y divide-[#23272E]">
                  <div className="flex justify-between pt-2 text-stone-400">
                    <span>Asset Cost:</span>
                    <span className="text-stone-200">${selectedBikePrice.toLocaleString()} AUD</span>
                  </div>
                  <div className="flex justify-between pt-2 text-stone-400">
                    <span>Principal Financed:</span>
                    <span className="text-stone-200">${principal.toLocaleString()} AUD</span>
                  </div>
                  <div className="flex justify-between pt-2 text-stone-400">
                    <span>Estimated Interest:</span>
                    <span className="text-stone-200">${totalInterest.toLocaleString()} AUD</span>
                  </div>
                  <div className="flex justify-between pt-2 text-stone-400">
                    <span>Total Repayable:</span>
                    <span className="text-stone-100 font-bold">${totalRepayable.toLocaleString()} AUD</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#23272E]">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-lg"
                >
                  <span>Inquire for Commercial Pre-Approval</span>
                </a>
                <p className="text-[10px] text-stone-400 text-center leading-relaxed">
                  *ABN / Station fleet asset finance. Subject to lender assessment and credit criteria.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
