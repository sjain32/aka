'use client';

import { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ================================================================
   BACKGROUND SCENE
   - Large particle globe (centerpiece) — scroll-driven rotation
   - Dot grid overlay — subtle, shifts with scroll
   - Ambient particles — drifting accents
   ================================================================ */

/* ── Dot Grid ── */

function DotGrid({ scrollY, viewportHeight }: { scrollY: any; viewportHeight: number }) {
  const gridY = useTransform(scrollY, [0, viewportHeight * 3], [0, -40]);
  const gridOpacity = useTransform(scrollY, [0, viewportHeight * 0.5], [0.04, 0.09]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: gridOpacity, y: gridY, zIndex: 1 }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, var(--accent) 0.5px, transparent 0.5px)`,
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 15%, transparent 65%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 15%, transparent 65%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, var(--accent) 0.7px, transparent 0.7px)`,
          backgroundSize: '132px 132px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 8%, transparent 50%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 8%, transparent 50%)',
        }}
      />
    </motion.div>
  );
}

/* ── Ambient particles ── */

function AmbientParticles({ count = 15 }: { count?: number }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      duration: 10 + Math.random() * 18,
      delay: Math.random() * 12,
      driftX: (Math.random() - 0.5) * 100,
      driftY: -40 - Math.random() * 120,
    })),
    [count]
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: 'var(--accent)',
            boxShadow: `0 0 ${p.size * 4}px var(--accent-glow)`,
          }}
          animate={{
            x: [0, p.driftX, 0],
            y: [0, p.driftY, 0],
            opacity: [0, 0.55, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

/* ── Main ── */

export default function BackgroundScene() {
  const { scrollY } = useScroll();
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 900;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Dot grid — subtle texture */}
      <DotGrid scrollY={scrollY} viewportHeight={viewportHeight} />

      {/* Ambient drifting particles */}
      <AmbientParticles count={8} />
    </div>
  );
}
