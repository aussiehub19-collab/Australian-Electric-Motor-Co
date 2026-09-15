'use client';

import React, { useState } from 'react';

export function PasscodeGate({ title, onUnlock }: { title: string; onUnlock: (code: string) => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      setError('Enter your passcode.');
      return;
    }
    onUnlock(value);
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-24">
      <form onSubmit={handleSubmit} className="bg-[#17191C] border border-[#2B2F36] rounded-2xl p-6 space-y-4">
        <h1 className="text-lg font-bold text-white">{title}</h1>
        <p className="text-xs text-stone-400">Enter your passcode to continue.</p>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Passcode"
          autoFocus
          className="w-full bg-[#1D2024] border border-[#2B2F36] rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
        />
        {error && <p className="text-xs text-rose-400">{error}</p>}
        <button type="submit" className="w-full bg-[#8C4A2F] hover:bg-[#A35839] text-white font-bold py-3 rounded-xl text-sm transition">
          Continue
        </button>
      </form>
    </div>
  );
}
