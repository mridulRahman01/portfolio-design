'use client';

import { useEffect } from 'react';

export function RevealObserver() {
  useEffect(() => {
    const html   = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hover  = window.matchMedia('(hover: hover)').matches;

    html.classList.add('reveal-armed');

    function inView(el: Element, ratio = 0.10) {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * (1 - ratio) && r.bottom > 0;
    }

    function animateCount(el: HTMLElement) {
      if ((el as any)._done) return;
      (el as any)._done = true;
      const target = parseFloat(el.dataset.count!);
      const suffix = el.dataset.suffix ?? '';
      const prefix = el.dataset.prefix ?? '';
      if (reduce) { el.textContent = prefix + target + suffix; return; }
      const dur = 1600, t0 = performance.now();
      const isFloat = target % 1 !== 0;
      const frame = (now: number) => {
        const t = Math.min(1, (now - t0) / dur);
        const val = target * (1 - Math.pow(1 - t, 3));
        el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
        if (t < 1) requestAnimationFrame(frame);
        else el.textContent = prefix + target + suffix;
      };
      requestAnimationFrame(frame);
    }

    function checkAll() {
      const revealEls = document.querySelectorAll<HTMLElement>('.reveal');
      const countEls  = document.querySelectorAll<HTMLElement>('[data-count]');
      const fillEls   = document.querySelectorAll<HTMLElement>('.skill-fill, .case-bar i');

      revealEls.forEach(el => { if (!el.classList.contains('in') && inView(el)) el.classList.add('in'); });
      countEls.forEach(el  => { if (!(el as any)._done && inView(el, 0.08)) animateCount(el); });
      fillEls.forEach(el   => {
        if (!(el as any)._filled && inView(el, 0.25)) {
          (el as any)._filled = true;
          const v = el.dataset.skill ?? el.dataset.fill ?? '0';
          el.style.setProperty('--w', v + '%');
          el.classList.add('go');
        }
      });
    }

    function armMagnetic() {
      if (!hover) return;
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(btn => {
        const onMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          btn.style.transition = 'none';
          btn.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.34}px,${(e.clientY - (r.top + r.height / 2)) * 0.34}px)`;
        };
        btn.addEventListener('mousemove', onMove);
        btn.addEventListener('mouseleave', () => {
          btn.style.transition = 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)';
          btn.style.transform = '';
        });
      });
    }

    function armTilt() {
      if (reduce || !hover) return;
      document.querySelectorAll<HTMLElement>('.tilt').forEach(card => {
        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width  - 0.5;
          const py = (e.clientY - r.top)  / r.height - 0.5;
          card.style.transition = 'none';
          card.style.transform = `perspective(900px) rotateY(${px * 9}deg) rotateX(${-py * 9}deg) translateY(-6px)`;
        };
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', () => {
          card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
          card.style.transform = '';
        });
      });
    }

    /* Frozen-timeline guard */
    (function frozenGuard() {
      let t0: number;
      try { t0 = (document.timeline.currentTime as number) ?? 0; } catch { t0 = performance.now(); }
      setTimeout(() => {
        let t1: number;
        try { t1 = (document.timeline.currentTime as number) ?? 0; } catch { t1 = performance.now(); }
        if (t1 - t0 < 5) {
          const revealEls = document.querySelectorAll<HTMLElement>('.reveal');
          const countEls  = document.querySelectorAll<HTMLElement>('[data-count]');
          const fillEls   = document.querySelectorAll<HTMLElement>('.skill-fill, .case-bar i');

          html.classList.add('force-shown');
          revealEls.forEach(el => el.classList.add('in'));
          fillEls.forEach(el => {
            const v = el.dataset.skill ?? el.dataset.fill ?? '0';
            el.style.setProperty('--w', v + '%'); el.classList.add('go'); (el as any)._filled = true;
          });
          countEls.forEach(el => {
            if (!(el as any)._done) { (el as any)._done = true; el.textContent = (el.dataset.prefix ?? '') + el.dataset.count + (el.dataset.suffix ?? ''); }
          });
        }
      }, 500);
    })();

    armMagnetic(); armTilt();
    window.addEventListener('scroll', checkAll, { passive: true });
    window.addEventListener('resize', checkAll, { passive: true });
    checkAll(); requestAnimationFrame(checkAll);
    window.addEventListener('load', checkAll);
    setTimeout(checkAll, 300); setTimeout(checkAll, 900);

    return () => {
      window.removeEventListener('scroll', checkAll);
      window.removeEventListener('resize', checkAll);
    };
  }, []);

  return null;
}
