'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete?: () => void;
  /** 0→1: loader rings burst outward as globe forms */
  exitProgress?: number;
}

export default function Preloader({ onComplete, exitProgress = 0 }: PreloaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [counter, setCounter] = useState(0);
  const [countDone, setCountDone] = useState(false);

  // Animate counter 0→100
  useEffect(() => {
    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounter(Math.round(eased * 100));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setCountDone(true);
        // Small pause at 100%, then trigger globe entrance
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 300);
      }
    };

    requestAnimationFrame(tick);
  }, [onComplete]);

  // Hide completely once exit animation finishes
  useEffect(() => {
    if (exitProgress >= 0.98 && countDone) {
      const t = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(t);
    }
  }, [exitProgress, countDone]);

  // Rings scale up and fade during exit
  const ringScale = 1 + exitProgress * 3.5;
  const ringOpacity = 1 - exitProgress;
  const contentOpacity = 1 - exitProgress * 1.5;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          style={{ background: 'var(--bg-root)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Central glow that expands during exit */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
            style={{
              width: `${300 + exitProgress * 800}px`,
              height: `${300 + exitProgress * 800}px`,
              background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, rgba(255,107,53,0.04) 40%, transparent 70%)',
              opacity: 1 - exitProgress * 0.7,
            }}
          />

          <div className="relative flex flex-col items-center gap-8">
            {/* Spinning rings — burst outward during exit */}
            <motion.div
              className="relative w-16 h-16"
              animate={{
                scale: ringScale,
                opacity: ringOpacity,
              }}
              transition={{ duration: 0.1 }}
            >
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#FF6B35]"
                style={{ opacity: ringOpacity * 0.8 }}
                animate={countDone ? {} : { rotate: [0, 90, 180, 270, 360] }}
                transition={countDone ? {} : { duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              {/* Inner ring */}
              <motion.div
                className="absolute inset-2 rounded-full border-2 border-transparent border-b-[#FF8C66]"
                style={{ opacity: ringOpacity * 0.6 }}
                animate={countDone ? {} : { rotate: [360, 270, 180, 90, 0] }}
                transition={countDone ? {} : { duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              {/* Third ring — appears during exit, expanding */}
              <motion.div
                className="absolute rounded-full border border-[#FF6B35]/30"
                style={{
                  inset: `${-exitProgress * 40}px`,
                  opacity: exitProgress * 0.5,
                }}
              />
            </motion.div>

            {/* Counter — fades during exit */}
            <motion.div
              className="flex flex-col items-center gap-3"
              style={{ opacity: contentOpacity }}
            >
              <span
                className="text-6xl md:text-8xl font-black tracking-[-0.04em] tabular-nums"
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C66 50%, #FF6B35 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {counter}%
              </span>
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{
                  color: 'var(--text-dim)',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  opacity: contentOpacity,
                }}
              >
                {exitProgress > 0 ? 'Initializing Scene' : 'Loading Portfolio'}
              </span>
            </motion.div>

            {/* Progress bar — fades during exit */}
            <motion.div
              className="w-48 h-[1px] rounded-full overflow-hidden"
              style={{
                background: 'var(--border-subtle)',
                opacity: contentOpacity,
              }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #FF6B35, #FF8C66)',
                  width: `${countDone ? 100 : counter}%`,
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
