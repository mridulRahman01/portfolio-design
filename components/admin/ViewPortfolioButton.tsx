'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Prominent 3D button on the CMS dashboard that navigates to the live
 * portfolio. Uses a React transition so the button shows a loading state
 * while the destination (with its skeleton loader) streams in.
 */
export function ViewPortfolioButton() {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <div className="vpb-wrap">
      <button
        className={`vpb${pending ? ' is-loading' : ''}`}
        onClick={() => start(() => router.push('/'))}
        disabled={pending}
        aria-label="Open the live portfolio site"
      >
        <span className="vpb-face">
          <span className="vpb-icon" aria-hidden="true">
            {pending ? (
              <span className="vpb-spinner" />
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            )}
          </span>
          <span className="vpb-text">
            {pending ? 'Opening Portfolio…' : 'View Live Portfolio'}
          </span>
          <span className="vpb-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="vpb-shine" aria-hidden="true" />
        </span>
      </button>
    </div>
  );
}
