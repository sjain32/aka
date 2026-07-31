'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';

/* ======================================================================
   THE ARCHITECT'S SIGIL  —  Premium Loading Screen

   Design Philosophy:
     A full-stack engineer bridges abstract systems with concrete
     products. This loader visualizes that through geometric architecture
     constructed layer by layer — blueprint becoming reality.

   Sequence:
     atmosphere  (0–300ms)   dot grid, vignette, ambient motes
     framework   (300–700ms)  guide crosshair + 4 diagonals draw in
     construct   (500–1200ms) central hexagon + inner diamond are drawn
     orbit       (800–2000ms) two tilted orbital rings appear, dots orbit
     complete    (1800–2600ms) name letter-by-letter, progress line fills
     dissolve    (2600–3200ms) central form brightens, everything fades
   ====================================================================== */

/* ─── Types ─── */

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  /** The name / brand text revealed below the geometric mark */
  logoText?: string;
  /** Optional subtitle (e.g. "Full-Stack Engineer") shown beneath the name */
  subtitle?: string;
}

type Phase = 'atmosphere' | 'framework' | 'construct' | 'orbit' | 'complete' | 'dissolve';

/* ─── Constants ─── */

const BG = '#05050A';
const ACCENT = '#FF6B35';
const ACCENT_BLUE = '#60A5FA';
const WHITE_08 = 'rgba(255,255,255,0.08)';
const WHITE_12 = 'rgba(255,255,255,0.12)';
const WHITE_20 = 'rgba(255,255,255,0.20)';
const WHITE_40 = 'rgba(255,255,255,0.40)';
const WHITE_70 = 'rgba(255,255,255,0.70)';
const WHITE_90 = 'rgba(255,255,255,0.90)';

/* SVG viewBox geometry (100×100 coordinate space, center at 50,50) */

// Flat-top hexagon, radius 19
const HEX_PATH = (() => {
  const cx = 50, cy = 50, r = 19;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 30); // -30° so top is flat
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  });
  return `M${pts.join(' L')} Z`;
})();

// Inner diamond (rotated square), radius 10.5
const DIAMOND_PATH = 'M50,39.5 L60.5,50 L50,60.5 L39.5,50 Z';

// Guide lines
const GUIDE_CROSS = 'M50,12 L50,88 M12,50 L88,50';
const GUIDE_DIAG  = 'M19,19 L81,81 M81,19 L19,81';

// Line lengths for stroke-dasharray animation
const HEX_LENGTH    = 6 * 19 * 1.05;   // ≈ 120
const DIAMOND_LENGTH = 4 * 10.5 * 1.414; // ≈ 59
const CROSS_LENGTH  = 2 * 76;           // ≈ 152
const DIAG_LENGTH   = 2 * 87.7;         // ≈ 175

/* ─── Helpers ─── */

const easeOut = [0.16, 0.04, 0.12, 1] as const;
const easeInOut = [0.45, 0, 0.15, 1] as const;
const easeSharp = [0.33, 0, 0.05, 1] as const;

/* ══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════ */

export default function LoadingScreen({
  onLoadingComplete,
  logoText = 'PORTFOLIO',
  subtitle = 'FULL-STACK ENGINEER',
}: LoadingScreenProps) {
  const [phase, setPhase] = useState<Phase>('atmosphere');
  const [visible, setVisible]   = useState(true);
  const [progress, setProgress] = useState(0);
  const progressTarget          = useRef(5);

  /* ── Phase sequencing ── */
  const complete = useCallback(() => onLoadingComplete?.(), [onLoadingComplete]);

  useEffect(() => {
    const T: Record<string, number> = {
      framework: 350,
      construct: 750,
      orbit: 1400,
      complete: 2100,
      dissolve: 2800,
    };

    const id1 = setTimeout(() => setPhase('framework'),  T.framework);
    const id2 = setTimeout(() => setPhase('construct'),  T.construct);
    const id3 = setTimeout(() => setPhase('orbit'),      T.orbit);
    const id4 = setTimeout(() => { setPhase('complete'); complete(); }, T.complete);
    const id5 = setTimeout(() => setPhase('dissolve'),   T.dissolve);
    const id6 = setTimeout(() => setVisible(false),      T.dissolve + 400);

    return () => [id1,id2,id3,id4,id5,id6].forEach(clearTimeout);
  }, [complete]);

  /* ── Listen for real page load ── */
  useEffect(() => {
    const jump = () => { progressTarget.current = 100; };
    if (document.readyState === 'complete') jump();
    else window.addEventListener('load', jump);
    return () => window.removeEventListener('load', jump);
  }, []);

  /* ── Smooth progress counter ── */
  useEffect(() => {
    const targets: [number, number][] = [
      [0, 5], [400, 15], [800, 35], [1200, 55],
      [1600, 72], [2000, 88], [2500, 96],
    ];
    const now = performance.now();
    // Determine current target based on elapsed time
    let target = 5;
    for (const [t, v] of targets) {
      if (now > t) target = v;
    }
    progressTarget.current = target;

    let raf: number;
    const tick = () => {
      setProgress(prev => {
        const diff = progressTarget.current - prev;
        if (Math.abs(diff) < 0.05) return progressTarget.current;
        return prev + diff * 0.08; // smooth approach
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ── Accessibility: Escape to skip ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setPhase('dissolve'); complete(); progressTarget.current = 100; }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [complete]);

  /* ── Static assets (pre-computed) ── */
  const motes = useMemo(() =>
    Array.from({ length: 22 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: 0.5 + Math.random() * 1.8,
      o: 0.08 + Math.random() * 0.2,
      d: 6 + Math.random() * 8,
      delay: Math.random() * 7,
    })), []);

  const orbitalDots = useMemo(() => [
    { ring: 0, offset: 0 },
    { ring: 0, offset: 180 },
    { ring: 1, offset: 60 },
    { ring: 1, offset: 240 },
  ], []);

  /* ── Phase booleans ── */
  const showFramework  = phase !== 'atmosphere';
  const showConstruct  = phase === 'construct' || phase === 'orbit' || phase === 'complete' || phase === 'dissolve';
  const showOrbit      = phase === 'orbit' || phase === 'complete' || phase === 'dissolve';
  const showText       = phase === 'complete' || phase === 'dissolve';
  const isDissolving   = phase === 'dissolve';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: easeInOut }}
          className="fixed inset-0 z-50 overflow-hidden select-none"
          style={{ background: BG }}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Loading — ${Math.round(progress)}%`}
        >
          {/* ═══════════════════════════════════════════════════════════
              LAYER 0 · BACKGROUND TEXTURE
              ═══════════════════════════════════════════════════════════ */}

          {/* Subtle dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, ${WHITE_08} 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
              opacity: 0.6,
              maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 20%, rgba(5,5,10,0.8) 100%)',
            }}
          />

          {/* ═══════════════════════════════════════════════════════════
              LAYER 1 · AMBIENT FLOATING MOTES
              ═══════════════════════════════════════════════════════════ */}
          {motes.map((m, i) => (
            <motion.div
              key={`m-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: m.s, height: m.s,
                left: `${m.x}%`, top: `${m.y}%`,
                background: 'rgba(255,255,255,0.5)',
                boxShadow: '0 0 3px rgba(255,255,255,0.3)',
              }}
              animate={{
                y: [0, -35],
                x: [0, (i % 2 === 0 ? 12 : -12)],
                opacity: [0, m.o, 0],
              }}
              transition={{
                duration: m.d,
                repeat: Infinity,
                delay: m.delay,
                ease: 'linear',
              }}
            />
          ))}

          {/* ═══════════════════════════════════════════════════════════
              LAYER 2 · SCAN LINE (subtle technical accent)
              ═══════════════════════════════════════════════════════════ */}
          <motion.div
            className="absolute left-0 right-0 pointer-events-none"
            style={{ height: '1px', top: 0, background: WHITE_08 }}
            animate={{ top: ['-1px', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />

          {/* ═══════════════════════════════════════════════════════════
              LAYER 3 · SVG GEOMETRIC ARCHITECTURE
              ═══════════════════════════════════════════════════════════ */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-[min(85vw,500px)] h-[min(85vw,500px)]"
              style={{ filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.15))' }}
            >
              <defs>
                {/* Warm gradient for the completed mark */}
                <linearGradient id="markGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                  <stop offset="40%" stopColor="rgba(255,180,130,0.8)" />
                  <stop offset="100%" stopColor="rgba(255,107,53,0.6)" />
                </linearGradient>

                {/* Blue-cool gradient for orbitals */}
                <linearGradient id="orbitGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                  <stop offset="50%" stopColor="rgba(150,200,255,0.3)" />
                  <stop offset="100%" stopColor="rgba(96,165,250,0.15)" />
                </linearGradient>

                {/* Glow filter */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="0.4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="glowStrong" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* ── Guide framework ── */}
              <AnimatePresence>
                {showFramework && (
                  <g filter="url(#glow)">
                    {/* Crosshair */}
                    <motion.path
                      d={GUIDE_CROSS}
                      fill="none"
                      stroke={WHITE_12}
                      strokeWidth="0.5"
                      strokeDasharray={CROSS_LENGTH}
                      initial={{ strokeDashoffset: CROSS_LENGTH }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 0.9, ease: easeSharp }}
                    />
                    {/* Diagonals */}
                    <motion.path
                      d={GUIDE_DIAG}
                      fill="none"
                      stroke={WHITE_08}
                      strokeWidth="0.4"
                      strokeDasharray={DIAG_LENGTH}
                      initial={{ strokeDashoffset: DIAG_LENGTH }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 0.7, delay: 0.15, ease: easeSharp }}
                    />
                    {/* Small ticks at guide endpoints */}
                    <EndTicks phase={phase} />
                  </g>
                )}
              </AnimatePresence>

              {/* ── Central hexagon ── */}
              <AnimatePresence>
                {showConstruct && (
                  <motion.path
                    d={HEX_PATH}
                    fill="none"
                    stroke={isDissolving ? 'url(#markGrad)' : WHITE_40}
                    strokeWidth={isDissolving ? '0.7' : '0.55'}
                    filter={isDissolving ? 'url(#glowStrong)' : 'url(#glow)'}
                    strokeDasharray={HEX_LENGTH}
                    initial={{ strokeDashoffset: HEX_LENGTH }}
                    animate={{
                      strokeDashoffset: 0,
                      stroke: isDissolving ? 'url(#markGrad)' : WHITE_40,
                    }}
                    transition={{
                      strokeDashoffset: { duration: 1.1, ease: easeOut },
                      stroke: { duration: 0.3 },
                    }}
                  />
                )}
              </AnimatePresence>

              {/* ── Inner diamond ── */}
              <AnimatePresence>
                {showConstruct && (
                  <motion.path
                    d={DIAMOND_PATH}
                    fill="none"
                    stroke={isDissolving ? WHITE_90 : WHITE_20}
                    strokeWidth={isDissolving ? '0.6' : '0.45'}
                    filter={isDissolving ? 'url(#glowStrong)' : 'url(#glow)'}
                    strokeDasharray={DIAMOND_LENGTH}
                    initial={{ strokeDashoffset: DIAMOND_LENGTH }}
                    animate={{
                      strokeDashoffset: 0,
                      stroke: isDissolving ? WHITE_90 : WHITE_20,
                    }}
                    transition={{
                      strokeDashoffset: { duration: 0.6, delay: 0.45, ease: easeOut },
                      stroke: { duration: 0.3 },
                    }}
                  />
                )}
              </AnimatePresence>

              {/* ── Center point dot ── */}
              <AnimatePresence>
                {showConstruct && (
                  <motion.circle
                    cx="50" cy="50" r="1.2"
                    fill={isDissolving ? ACCENT : WHITE_40}
                    filter="url(#glowStrong)"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: isDissolving ? [0.8, 1, 0.9] : [0, 0.8],
                      scale: isDissolving ? [1, 1.5] : [0, 1],
                    }}
                    transition={{
                      opacity: { duration: isDissolving ? 0.8 : 0.3, delay: isDissolving ? 0 : 0.8 },
                      scale: { duration: isDissolving ? 0.8 : 0.3, delay: isDissolving ? 0 : 0.8 },
                    }}
                  />
                )}
              </AnimatePresence>
            </svg>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              LAYER 4 · ORBITAL RINGS (CSS 3D)
              ═══════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {showOrbit && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Ring 1 — 150px, tilted back */}
                <motion.div
                  className="absolute rounded-full border"
                  style={{
                    width: '150px', height: '150px',
                    borderColor: isDissolving ? 'rgba(255,107,53,0.25)' : WHITE_12,
                    borderWidth: '0.8px',
                    transform: 'rotateX(72deg)',
                  }}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{
                    opacity: isDissolving ? [0.5, 0.7] : [0, 0.5],
                    scale: isDissolving ? [1, 1.08] : [0.3, 1],
                    rotate: isDissolving ? [0, 360] : [0, 360],
                  }}
                  transition={{
                    opacity: { duration: 0.5 },
                    scale: { duration: 0.7, ease: easeOut },
                    rotate: { duration: 12, repeat: Infinity, ease: 'linear' },
                  }}
                />

                {/* Ring 2 — 210px, tilted differently */}
                <motion.div
                  className="absolute rounded-full border"
                  style={{
                    width: '210px', height: '210px',
                    borderColor: isDissolving ? 'rgba(255,107,53,0.15)' : WHITE_08,
                    borderWidth: '0.6px',
                    transform: 'rotateX(68deg) rotateY(20deg)',
                  }}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{
                    opacity: isDissolving ? [0.35, 0.5] : [0, 0.35],
                    scale: isDissolving ? [1, 1.05] : [0.3, 1],
                    rotate: isDissolving ? [-360, 0] : [-360, 0],
                  }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.15 },
                    scale: { duration: 0.7, delay: 0.15, ease: easeOut },
                    rotate: { duration: 18, repeat: Infinity, ease: 'linear' },
                  }}
                />

                {/* Orbital luminous dots */}
                {orbitalDots.map((dot, i) => {
                  const isRing0 = dot.ring === 0;
                  const ringSize = isRing0 ? 150 : 210;
                  const tilt = isRing0 ? 'rotateX(72deg)' : 'rotateX(68deg) rotateY(20deg)';
                  const orbitDuration = isRing0 ? 4 : 6;
                  return (
                    <motion.div
                      key={`od-${i}`}
                      className="absolute rounded-full"
                      style={{
                        width: '3px', height: '3px',
                        background: i % 2 === 0 ? '#fff' : ACCENT,
                        boxShadow:
                          i % 2 === 0
                            ? '0 0 6px #fff, 0 0 12px rgba(255,255,255,0.5)'
                            : '0 0 6px rgba(255,107,53,0.8), 0 0 14px rgba(255,107,53,0.4)',
                        willChange: 'transform',
                      }}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: isDissolving ? [0.7, 0.9] : [0, 0.7],
                        // Orbit via circular motion
                        x: [
                          0,
                          Math.cos((dot.offset * Math.PI) / 180) * (ringSize / 2),
                          Math.cos(((dot.offset + 360) * Math.PI) / 180) * (ringSize / 2),
                        ],
                        y: [
                          -ringSize / 2,
                          Math.sin((dot.offset * Math.PI) / 180) * (ringSize / 2) * Math.cos(72 * Math.PI / 180),
                          Math.sin(((dot.offset + 360) * Math.PI) / 180) * (ringSize / 2) * Math.cos(72 * Math.PI / 180),
                        ],
                      }}
                      transition={{
                        opacity: { duration: 0.4, delay: 0.3 + i * 0.05 },
                        x: { duration: orbitDuration, repeat: Infinity, ease: 'linear' },
                        y: { duration: orbitDuration, repeat: Infinity, ease: 'linear' },
                      }}
                    />
                  );
                })}
              </div>
            )}
          </AnimatePresence>

          {/* ═══════════════════════════════════════════════════════════
              LAYER 5 · PROGRESS + TYPOGRAPHY
              ═══════════════════════════════════════════════════════════ */}
          <div className="absolute bottom-[12vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-8 w-full max-w-[300px] px-6">
            {/* ── Name letter-by-letter ── */}
            <AnimatePresence>
              {showText && (
                <div className="flex flex-col items-center gap-2">
                  {/* Logo name */}
                  <div className="flex gap-[0.15em]">
                    {logoText.split('').map((char, i) => (
                      <motion.span
                        key={`char-${i}`}
                        className="inline-block"
                        style={{
                          fontSize: 'clamp(1rem, 2.2vw, 1.5rem)',
                          fontWeight: 700,
                          color: '#fff',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          letterSpacing: '0.12em',
                          textShadow: '0 0 20px rgba(255,255,255,0.3)',
                        }}
                        initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                        animate={{
                          opacity: isDissolving ? [0.9, 0] : [0, 0.9],
                          y: isDissolving ? [0, -8] : [12, 0],
                          filter: isDissolving ? ['blur(0px)', 'blur(6px)'] : ['blur(4px)', 'blur(0px)'],
                        }}
                        transition={{
                          duration: isDissolving ? 0.4 : 0.4,
                          delay: isDissolving ? i * 0.02 : 0.1 + i * 0.06,
                          ease: easeOut,
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>

                  {/* Subtitle */}
                  <motion.span
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 500,
                      color: 'rgba(255,255,255,0.4)',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                    }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{
                      opacity: isDissolving ? [0.5, 0] : [0, 0.5],
                      y: isDissolving ? [0, -4] : [6, 0],
                    }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {subtitle}
                  </motion.span>
                </div>
              )}
            </AnimatePresence>

            {/* ── Progress indicator ── */}
            <div className="relative w-full" style={{ height: '2px' }}>
              {/* Track */}
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: WHITE_08 }}
              />
              {/* Fill */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: `linear-gradient(90deg, ${WHITE_40}, ${ACCENT})`, width: `${progress}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
              {/* Leading dot */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: '5px', height: '5px',
                  background: ACCENT,
                  boxShadow: `0 0 8px ${ACCENT}, 0 0 16px rgba(255,107,53,0.5)`,
                  left: `calc(${progress}% - 2.5px)`,
                }}
                animate={{ left: `calc(${progress}% - 2.5px)` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>

            {/* ── Percentage number ── */}
            <AnimatePresence>
              {showText && (
                <motion.span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: WHITE_40,
                    fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                    letterSpacing: '0.05em',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isDissolving ? [0.6, 0] : [0, 0.6] }}
                  transition={{ duration: 0.4 }}
                >
                  {Math.round(progress)}%
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              LAYER 6 · DISSOLVE OVERLAY
              ═══════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {isDissolving && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.06, 0] }}
                transition={{ duration: 0.5, times: [0, 0.4, 1] }}
                className="absolute inset-0 bg-white pointer-events-none"
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SUB-COMPONENT · End-point ticks
   Small perpendicular marks at guide-line endpoints (architectural feel)
   ══════════════════════════════════════════════════════════════════════ */

function EndTicks({ phase }: { phase: Phase }) {
  const show = phase === 'construct' || phase === 'orbit' || phase === 'complete' || phase === 'dissolve';

  // Ticks at the 8 endpoints of the crosshair + diagonals
  const ticks = [
    // Vertical ends: top, bottom
    { x1: 49, y1: 12, x2: 51, y2: 12 },
    { x1: 49, y1: 88, x2: 51, y2: 88 },
    // Horizontal ends: left, right
    { x1: 12, y1: 49, x2: 12, y2: 51 },
    { x1: 88, y1: 49, x2: 88, y2: 51 },
    // Diagonal ends
    { x1: 18, y1: 18, x2: 20, y2: 20 },
    { x1: 80, y1: 80, x2: 82, y2: 82 },
    { x1: 80, y1: 18, x2: 82, y2: 20 },
    { x1: 18, y1: 80, x2: 20, y2: 82 },
  ];

  return (
    <AnimatePresence>
      {show && ticks.map((t, i) => (
        <motion.line
          key={`tick-${i}`}
          x1={t.x1} y1={t.y1}
          x2={t.x2} y2={t.y2}
          stroke={WHITE_20}
          strokeWidth="0.4"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.6 + i * 0.04, ease: easeOut }}
        />
      ))}
    </AnimatePresence>
  );
}
