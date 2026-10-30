'use client';

import { useState, useEffect, useRef } from 'react';
import { MARK_TOP_PATH, MARK_LEG_PATHS } from './AkashMark';

/* ======================================================================
   JUMP CUT PRELOADER  (Akash logo system — "Loader animation — Jump Cut")

     · Blade      — an accent line slices the A mark at the crossbar
     · Jump cut   — the legs slip sideways and flash to accent
     · Wordmark   — AKASH glitches in, the bar fills in 10% frames
     · Exit       — a hard "cut": the frame splits and slides away,
                    revealing the particle globe forming behind it,
                    while the logo flies into the navbar's logo slot
                    ([data-logo-target] in Navbar)
   Keyframes live in globals.css under "Preloader (jump cut)".
   ====================================================================== */

/** Offset + scale that moves one element's box onto another's */
interface Flight { dx: number; dy: number; scale: number }

function flightTo(src: HTMLElement | null, selector: string): Flight | null {
  const dst = document.querySelector<HTMLElement>(selector);
  if (!src || !dst) return null;
  const a = src.getBoundingClientRect();
  const b = dst.getBoundingClientRect();
  if (!a.width || !b.width) return null;
  return {
    dx: b.left + b.width / 2 - (a.left + a.width / 2),
    dy: b.top + b.height / 2 - (a.top + a.height / 2),
    scale: b.width / a.width,
  };
}

function flightStyle(f: Flight | null, t: number): React.CSSProperties {
  if (!f) return {};
  return {
    transform: `translate(${f.dx * t}px, ${f.dy * t}px) scale(${1 + (f.scale - 1) * t})`,
    transformOrigin: 'center',
    willChange: 'transform',
  };
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

interface PreloaderProps {
  onComplete?: () => void;
  /** 0→1: driven by the page while the globe forms behind the loader */
  exitProgress?: number;
  name?: string;
  role?: string;
}

const DURATION = 2000;        // load length when the page is already loaded
const REDUCED_DURATION = 800;
const MAX_WAIT = 8000;        // never block the site longer than this
const ANIM_SECONDS = 2.8;     // one pass of the jump cut keyframes

const DISPLAY = 'var(--font-archivo), Inter, system-ui, sans-serif';
const MONO = 'var(--font-jetbrains-mono), var(--font-geist-mono), ui-monospace, monospace';

export default function Preloader({
  onComplete,
  exitProgress = 0,
  name = 'AKASH',
  role = 'Video Editor',
}: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const firedRef = useRef(false);
  const markRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const [landing, setLanding] = useState<{ mark: Flight | null; word: Flight | null; color: string | null }>();
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduced ? REDUCED_DURATION : DURATION;
    let loaded = document.readyState === 'complete';
    const onLoad = () => { loaded = true; };
    window.addEventListener('load', onLoad);

    let raf = 0;
    let finishTimer: ReturnType<typeof setTimeout>;
    const start = performance.now();

    const finish = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      setProgress(1);
      // Hold on the final frame briefly before the cut, then measure the
      // flight to the navbar logo while nothing is transformed yet
      finishTimer = setTimeout(() => {
        const target = document.querySelector('[data-logo-target="word"]');
        setLanding({
          mark: flightTo(markRef.current, '[data-logo-target="mark"]'),
          word: flightTo(wordRef.current, '[data-logo-target="word"]'),
          color: target ? getComputedStyle(target).color : null,
        });
        onCompleteRef.current?.();
      }, 350);
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      const timeP = Math.min(1, elapsed / duration);
      // Hold just short of the end until the page has actually loaded
      const p = loaded || elapsed > MAX_WAIT ? timeP : Math.min(timeP, 0.96);
      if (p >= 1) return finish();
      setProgress(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { cancelAnimationFrame(raf); finish(); }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(finishTimer);
      window.removeEventListener('load', onLoad);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // Bar advances in whole 10% frames, like the design's steps(10)
  const barFill = Math.floor(progress * 10) / 10;

  // Exit: frame splits at the horizon, content fades out first
  const e = exitProgress;
  const contentOpacity = Math.max(0, 1 - e * 3);
  const seamOpacity = e > 0 ? Math.max(0, 1 - e * 1.6) : 0;

  // Logo flight: undo the page's ease-out so the flight can ease in AND out
  const raw = 1 - Math.cbrt(1 - clamp01(e));
  const fly = easeInOutCubic(raw);
  const landed = !!landing?.mark && !!landing?.word;
  const logoOpacity = landed ? 1 : contentOpacity;
  const logoColor = landing?.color
    ? `color-mix(in srgb, var(--text-primary), ${landing.color} ${fly * 100}%)`
    : 'var(--text-primary)';

  const anim = { animationDuration: `${ANIM_SECONDS}s` };

  return (
    <div
      className="fixed inset-0 z-10000 overflow-hidden select-none"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-label="Loading portfolio"
      style={{ pointerEvents: e > 0.4 ? 'none' : 'auto' }}
    >
      {/* Split panels — the "cut" */}
      <div
        className="absolute inset-x-0 top-0 h-1/2"
        style={{ background: 'var(--bg-root)', transform: `translateY(${-e * 100}%)` }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: 'var(--bg-root)', transform: `translateY(${e * 100}%)` }}
      />
      {/* Light leak along the seam as it opens */}
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px pointer-events-none"
        style={{
          opacity: seamOpacity,
          background: 'linear-gradient(90deg, transparent, var(--accent) 30%, var(--accent-light) 50%, var(--accent) 70%, transparent)',
          boxShadow: '0 0 24px 4px var(--accent-glow)',
          transform: `translateY(-50%) scaleY(${1 + e * 40})`,
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div
          className="jc-in flex flex-col items-center gap-7 md:gap-8.5 w-full max-w-105"
          style={anim}
        >
          {/* Flight transforms sit on wrappers: CSS animations on the inner
              elements would override an inline transform */}
          <div
            ref={markRef}
            style={{ ...flightStyle(landing?.mark ?? null, fly), color: logoColor, opacity: logoOpacity }}
          >
            <JumpCutMark anim={anim} />
          </div>

          <div
            ref={wordRef}
            className="text-4xl md:text-[52px] leading-none font-extrabold tracking-[0.04em]"
            style={{
              ...flightStyle(landing?.word ?? null, fly),
              color: logoColor,
              opacity: logoOpacity,
              fontFamily: DISPLAY,
              fontStretch: '125%',
            }}
          >
            <div className="jc-word" style={anim}>{name}</div>
          </div>

          <div className="self-stretch flex flex-col gap-3" style={{ opacity: contentOpacity }}>
            <div
              className="relative h-1 rounded-sm overflow-hidden"
              style={{ background: 'color-mix(in srgb, var(--text-primary) 10%, transparent)' }}
            >
              <div
                className="absolute inset-0 origin-left"
                style={{ background: 'var(--accent)', transform: `scaleX(${barFill})` }}
              />
            </div>
            <div
              className="flex justify-between gap-4 text-[11px] md:text-[13px] tracking-[0.16em] uppercase"
              style={{ color: 'var(--text-secondary)', fontFamily: MONO }}
            >
              <span className="flex items-center gap-2.5">
                <span className="jc-blink w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
                {progress >= 1 ? 'Reel ready' : 'Loading reel'}
              </span>
              <span className="truncate">{role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── The A mark, sliced at the crossbar and jump-cut sideways ───
   Its final frame is the static AkashMark the navbar shows. */

function JumpCutMark({ anim }: { anim: React.CSSProperties }) {
  const fill = 'currentColor';
  const legs = (color: string) => (
    <>
      {MARK_LEG_PATHS.map(d => <path key={d} d={d} fill={color} />)}
    </>
  );

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="block w-32 h-32 md:w-44 md:h-44 overflow-visible"
    >
      <g transform="translate(-2.5 0)">
        <path className="jc-top" style={anim} d={MARK_TOP_PATH} fill={fill} />
        <g className="jc-bridge" style={anim}>
          <path d="M53 60 L77 60 L80 66 L56 66 Z" fill={fill} />
          <path d="M23 60 L47 60 L44 66 L20 66 Z" fill={fill} />
        </g>
        <g className="jc-slip" style={anim}>
          {legs('var(--accent)')}
          <g className="jc-whiteout" style={anim}>{legs(fill)}</g>
        </g>
        <rect className="jc-blade" style={anim} x="-4" y="62.3" width="112" height="1.4" fill="var(--accent)" />
      </g>
    </svg>
  );
}
