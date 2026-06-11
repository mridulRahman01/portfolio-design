'use client';

import { useState, useEffect } from 'react';

const LINKS = [
  { href: '#home',     label: 'Home' },
  { href: '#about',    label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#cases',    label: 'Portfolio' },
  { href: '#blog',     label: 'Blog' },
  { href: '#footer',   label: 'Contact' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [active, setActive]     = useState('home');

  useEffect(() => {
    const ids = ['home', 'about', 'services', 'cases', 'blog', 'footer'];
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const line = window.innerHeight * 0.42;
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 1024) setOpen(false); };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="nav-inner">
          <a href="#home" className="logo"><span className="s">A</span><span className="a">H</span></a>

          <ul className="nav-links" id="navLinks">
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className={active === href.slice(1) ? 'active' : ''}>
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-cta">
            <a href="#footer" className="btn btn-primary" data-magnetic="">
              Let&apos;s Connect{' '}
              <span className="ico">
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
            <button
              className={`burger${open ? ' x' : ''}`}
              id="burger"
              aria-label="Menu"
              onClick={() => {
                const next = !open;
                setOpen(next);
                document.body.style.overflow = next ? 'hidden' : '';
              }}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu${open ? ' open' : ''}`} id="mobileMenu">
        {LINKS.map(({ href, label }) => (
          <a key={href} href={href} onClick={() => { setOpen(false); document.body.style.overflow = ''; }}>
            {label}
          </a>
        ))}
      </div>
    </>
  );
}
