import type { SocialItem } from '@/lib/defaults';

const ICONS: Record<string, React.ReactNode> = {
  facebook: (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
      <path d="M14 8.5h2.5V5.2C16.1 5.1 15 5 13.8 5 11.3 5 9.6 6.5 9.6 9.3v2.2H6.5V15h3.1v8h3.6v-8h3l.5-3.5H13.2V9.6c0-1 .3-1.7 1.8-1.7Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="7" r="1.2" fill="currentColor" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
      <path d="M22 8.2c-.2-1.5-.9-2.5-2.5-2.7C17.4 5.2 12 5.2 12 5.2s-5.4 0-7.5.3C2.9 5.7 2.2 6.7 2 8.2 1.8 9.7 1.8 12 1.8 12s0 2.3.2 3.8c.2 1.5.9 2.5 2.5 2.7 2.1.3 7.5.3 7.5.3s5.4 0 7.5-.3c1.6-.2 2.3-1.2 2.5-2.7.2-1.5.2-3.8.2-3.8s0-2.3-.2-3.8ZM10 15V9l5.2 3L10 15Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
      <path d="M6.9 8.5H3.6V21h3.3V8.5ZM5.25 3.5A1.9 1.9 0 1 0 5.3 7.3a1.9 1.9 0 0 0 0-3.8ZM20.4 21h-3.3v-6.1c0-1.5-.5-2.5-1.8-2.5-1 0-1.6.7-1.9 1.4-.1.2-.1.6-.1.9V21H9.9s.05-11.3 0-12.5h3.3v1.8c.45-.7 1.2-1.7 3-1.7 2.2 0 3.9 1.4 3.9 4.6V21Z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M17.7 3H21l-7.3 8.3L22.2 21h-6.8l-5.3-6.2L4 21H.7l7.8-8.9L-.2 3h7l4.8 5.6L17.7 3Zm-1.2 16h1.9L6.2 4.9H4.2L16.5 19Z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.2-.4-1.2.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
    </svg>
  ),
};

export function SocialIconLinks({ socials, className = 'social' }: { socials: SocialItem[]; className?: string }) {
  return (
    <>
      {socials.map(s => (
        <a
          key={s.platform}
          className={className}
          href={s.url}
          aria-label={s.platform}
          {...(s.url !== '#' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {ICONS[s.platform] ?? ICONS.facebook}
        </a>
      ))}
    </>
  );
}
