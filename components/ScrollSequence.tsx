'use client';

import { useRef, useEffect, useCallback, useState, type CSSProperties } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
  type MotionValue,
} from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   Config
══════════════════════════════════════════════════════════════ */
// Play only frames 31 → 41 of the sequence
const FRAME_START = 31;
const FRAME_END   = 41;
const TOTAL  = FRAME_END - FRAME_START + 1; // 11 frames
const BG     = '#121212';
const HEIGHT = '500vh';

function framePath(i: number) {
  return `/frames/frame_${String(FRAME_START + i).padStart(2, '0')}.webp`;
}
const PATHS = Array.from({ length: TOTAL }, (_, i) => framePath(i));

/* ═══════════════════════════════════════════════════════════════
   TextLayer — scroll-driven parallax overlay
   Each layer fades in/out over its visibleRange window and drifts
   upward by driftPx over the full visible window (parallax depth).
══════════════════════════════════════════════════════════════ */
function TextLayer({
  scrollYProgress,
  visibleRange,
  driftPx = 70,
  className = '',
  style,
  children,
}: {
  scrollYProgress: MotionValue<number>;
  visibleRange: [number, number];
  driftPx?: number;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}) {
  const [enter, exit] = visibleRange;
  const opacity = useTransform(
    scrollYProgress,
    [enter, enter + 0.07, exit - 0.06, exit],
    [0, 1, 1, 0],
  );
  const y = useTransform(scrollYProgress, [enter, exit], [18, -driftPx]);
  return (
    <motion.div
      className={className}
      style={{ position: 'absolute', zIndex: 10, pointerEvents: 'none', opacity, y, ...style }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ScrollSequence
══════════════════════════════════════════════════════════════ */
export function ScrollSequence() {
  const wrapRef     = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const imagesRef   = useRef<HTMLImageElement[]>([]);
  const lastIdx     = useRef(-1);

  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady]             = useState(false);

  /* ── Framer Motion scroll tracking ── */
  const { scrollYProgress: rawScrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  const scrollYProgress = useSpring(rawScrollYProgress, {
    stiffness: 45,
    damping: 18,
    mass: 0.15,
    restDelta: 0.0002
  });

  const frameIndex    = useTransform(scrollYProgress, [0, 1], [0, TOTAL - 1]);
  const progressH     = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const cueOpacity    = useTransform(scrollYProgress, [0, 0.07], [1, 0]);
  // Canvas fades out as the 500vh scroll approaches its end → smooth reveal of hero
  const stickyOpacity = useTransform(scrollYProgress, [0.87, 0.99], [1, 0]);

  /* ── Hide nav while intro plays; show it once scroll passes 90% ── */
  useEffect(() => {
    document.body.classList.add('intro-on');
    return () => { document.body.classList.remove('intro-on'); };
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    document.body.classList.toggle('intro-on', p < 0.90);
  });

  /* ── Cover-fit canvas draw ── */
  const draw = useCallback((rawIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const idx = Math.max(0, Math.min(TOTAL - 1, Math.round(rawIdx)));
    const img  = imagesRef.current[idx];
    if (!img?.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width: cw, height: ch } = canvas;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const sw = img.naturalWidth  * scale;
    const sh = img.naturalHeight * scale;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
    lastIdx.current = idx;
  }, []);

  /* ── Preload all frames in parallel ── */
  useEffect(() => {
    let count = 0;
    imagesRef.current = PATHS.map((src) => {
      const img = new Image();
      const onSettle = () => {
        count++;
        setLoadedCount(count);
        if (count === TOTAL) setReady(true);
      };
      img.onload  = onSettle;
      img.onerror = onSettle;
      img.src = src;
      return img;
    });
  }, []);

  /* ── Resize canvas to fill viewport ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      if (lastIdx.current >= 0) draw(lastIdx.current);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    return () => window.removeEventListener('resize', resize);
  }, [draw]);

  /* ── Drive canvas from scroll ── */
  useMotionValueEvent(frameIndex, 'change', (v) => {
    if (!ready) return;
    draw(v);
  });

  /* ── Draw frame 0 once preload finishes ── */
  useEffect(() => { if (ready) draw(0); }, [ready, draw]);

  return (
    <section ref={wrapRef} style={{ height: HEIGHT, padding: 0 }} className="relative">

      {/* Sticky viewport — fades out at end of 500vh scroll */}
      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: BG, opacity: stickyOpacity }}
      >
        {/* ── HTML5 Canvas (no <img> tags) ── */}
        <canvas ref={canvasRef} className="absolute inset-0 block" aria-hidden />

        {/* Cinematic vignette — edge darkening + top/bottom gradients */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              'radial-gradient(ellipse 88% 72% at 50% 50%, transparent 32%, rgba(0,0,0,0.60) 100%)',
              'linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, transparent 20%, transparent 66%, rgba(0,0,0,0.58) 100%)',
            ].join(','),
          }}
        />

        {/* Film grain — subtle cinematic texture */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.030,
            mixBlendMode: 'overlay',
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: '180px 180px',
          }}
        />

        {/* ══════════════════════════════════════════════════════
            TEXT LAYERS — three cinematic depth planes
        ══════════════════════════════════════════════════════ */}

        {/* LAYER 0 — Eyebrow: early reveal, top area, left-aligned */}
        <TextLayer
          scrollYProgress={scrollYProgress}
          visibleRange={[0.06, 0.36]}
          driftPx={28}
          style={{ top: '20vh', left: '5vw' }}
        >
          <div className="flex items-center gap-3">
            <span className="block w-7 h-px bg-[#00F5B8]/40 flex-shrink-0" />
            <span
              className="font-mono font-semibold tracking-[0.42em] uppercase text-[#00F5B8]"
              style={{ fontSize: 'clamp(10px, 0.85vw, 12px)' }}
            >
              Performance Marketing
            </span>
            <span
              className="font-mono tracking-[0.22em]"
              style={{ fontSize: 'clamp(9px, 0.75vw, 11px)', color: 'rgba(255,255,255,0.20)' }}
            >
              // 2026
            </span>
          </div>
        </TextLayer>

        {/* LAYER 1 — Left: "I scale brand revenue." */}
        <TextLayer
          scrollYProgress={scrollYProgress}
          visibleRange={[0.28, 0.86]}
          driftPx={56}
          className="seq-text-left"
          style={{ bottom: '34vh', left: '5vw', maxWidth: 'min(42vw, 520px)' }}
        >
          <p
            className="font-extrabold leading-[1.06] text-white"
            style={{
              fontSize: 'clamp(24px, 3.8vw, 54px)',
              letterSpacing: '-0.025em',
              textShadow: '0 2px 32px rgba(0,0,0,0.75)',
            }}
          >
            I scale<br />
            <span style={{ color: '#00F5B8' }}>brand</span>{' '}
            revenue.
          </p>
        </TextLayer>

        {/* LAYER 2 — Center: "Alif Hosain. Affiliate Marketer." */}
        <TextLayer
          scrollYProgress={scrollYProgress}
          visibleRange={[0.42, 0.90]}
          driftPx={94}
          style={{ bottom: '16vh', left: 0, right: 0, textAlign: 'center' }}
        >
          <h1
            className="font-extrabold text-white"
            style={{
              fontSize: 'clamp(46px, 9.5vw, 136px)',
              letterSpacing: '-0.038em',
              lineHeight: 0.90,
              textShadow: '0 4px 44px rgba(0,0,0,0.65)',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(122deg, #00F5B8 0%, #7fffd9 55%, #00cca2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Alif
            </span>{' '}
            Hosain.
          </h1>
          <p
            className="font-mono font-medium tracking-[0.30em] uppercase"
            style={{
              fontSize: 'clamp(11px, 1.35vw, 18px)',
              color: 'rgba(255,255,255,0.36)',
              marginTop: '0.55em',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            Affiliate Marketer.
          </p>
        </TextLayer>

        {/* LAYER 3 — Right: "Turning clicks into customers." */}
        <TextLayer
          scrollYProgress={scrollYProgress}
          visibleRange={[0.62, 0.90]}
          driftPx={126}
          className="seq-text-right"
          style={{
            bottom: '7vh',
            right: '5vw',
            textAlign: 'right',
            maxWidth: 'min(38vw, 420px)',
          }}
        >
          <p
            className="font-extrabold leading-[1.08] text-white"
            style={{
              fontSize: 'clamp(20px, 3vw, 42px)',
              letterSpacing: '-0.022em',
              textShadow: '0 2px 32px rgba(0,0,0,0.75)',
            }}
          >
            Turning clicks<br />
            <span style={{ color: '#FF7A18' }}>into customers.</span>
          </p>
        </TextLayer>

        {/* ── HUD top-left — minimal branding ── */}
        <div className="absolute top-6 left-6 z-10 pointer-events-none select-none">
          <span className="font-mono text-[9px] tracking-[0.32em] uppercase text-white/16">A.H. Portfolio</span>
        </div>

        {/* ── Vertical progress track ── */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-px h-32 rounded overflow-hidden pointer-events-none bg-white/8">
          <motion.div
            className="w-full rounded bg-gradient-to-b from-[#00F5B8] to-[#FF7A18]"
            style={{ height: progressH, boxShadow: '0 0 9px rgba(0,245,184,0.44)' }}
          />
        </div>

        {/* ── Scroll cue — fades within first 7% of scroll ── */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 pointer-events-none select-none"
        >
          <div className="relative w-6 h-9 rounded-[14px] border border-white/22">
            {/* dot driven by cueScroll keyframe defined in globals.css */}
            <span
              className="absolute left-1/2 top-[6px] w-[3px] h-[7px] rounded-full bg-[#00F5B8]"
              style={{ animation: 'cueScroll 1.6s ease-in-out infinite' }}
            />
          </div>
          <span className="font-mono text-[9px] tracking-[0.42em] uppercase text-white/26">Scroll</span>
        </motion.div>

      </motion.div>
    </section>
  );
}
