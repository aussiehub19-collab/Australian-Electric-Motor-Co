'use client';

import React, { useState } from 'react';

export default function OrderReferenceCopy({ orderNumber }: { orderNumber: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex items-center gap-4 bg-[#17191C] border border-[#2B2F36] rounded-xl pl-5 pr-3 py-3">
      <div className="text-left">
        <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400">Order Reference</div>
        <div className="text-lg font-mono font-black text-amber-400">{orderNumber}</div>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="text-amber-400 hover:underline font-mono text-[11px] font-bold shrink-0 border border-amber-500/30 hover:border-amber-500/60 rounded-lg px-3 py-2 transition"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}
