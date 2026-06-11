'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Internal page-view tracking for the admin dashboard charts. */
export function TrackView() {
  const pathname = usePathname();
  useEffect(() => {
    // sendBeacon survives navigation; falls back to fetch
    const body = JSON.stringify({ path: pathname });
    if (!navigator.sendBeacon?.('/api/track', new Blob([body], { type: 'application/json' }))) {
      fetch('/api/track', { method: 'POST', body, keepalive: true }).catch(() => {});
    }
  }, [pathname]);
  return null;
}
