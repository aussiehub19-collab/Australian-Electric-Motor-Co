'use client';

import { useState, useEffect, useCallback } from 'react';

const KEY = 'aemc_admin_passcode';

/** Session-persisted admin passcode — entered once per browser session, sent as the X-Admin-Passcode header on every admin API call. The actual gate is server-side (lib/adminAuth.ts); this only avoids re-typing it. */
export function useAdminPasscode() {
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(KEY);
      if (stored) {
        setPasscode(stored);
        setUnlocked(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const unlock = useCallback((code: string) => {
    try {
      sessionStorage.setItem(KEY, code);
    } catch {
      // ignore
    }
    setPasscode(code);
    setUnlocked(true);
  }, []);

  const lock = useCallback(() => {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      // ignore
    }
    setUnlocked(false);
    setPasscode('');
  }, []);

  return { unlocked, passcode, unlock, lock };
}
