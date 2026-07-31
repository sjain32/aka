'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  num: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    num: '01',
    title: 'Drop Your Footage',
    description:
      'Share your raw files via WeTransfer, Google Drive, or Dropbox. I accept all major formats — MP4, MOV, RAW, LOG, H.264, ProRes.',
  },
  {
    num: '02',
    title: 'We Do Our Magic',
    description:
      'Cutting, trimming, color grading, sound design & motion graphics. Every edit goes through: rough cut → refined edit → color grade → sound mix → motion polish.',
  },
  {
    num: '03',
    title: 'Feedback? Easy.',
    description:
      'Unlimited revision rounds. You get a review link, leave time-stamped comments, and I iterate until you are 100% satisfied.',
  },
  {
    num: '04',
    title: 'Upload & Grow',
    description:
      'Receive your final video optimized for YouTube, Instagram & more — includes master file, platform versions, thumbnail, and captions.',
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [circlePositions, setCirclePositions] = useState<number[]>([]);

  const recalcPositions = useCallback(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    const timelineTop = timeline.getBoundingClientRect().top;

    const positions = stepRefs.current.map((el) => {
      if (!el) return 0;
      const circle = el.querySelector('[data-circle]');
      if (!circle) return 0;
      const rect = circle.getBoundingClientRect();
      return rect.top + rect.height / 2 - timelineTop;
    });
    setCirclePositions(positions);
  }, []);

  useEffect(() => {
    recalcPositions();
    window.addEventListener('resize', recalcPositions);
    return () => window.removeEventListener('resize', recalcPositions);
  }, [recalcPositions]);

  const updateActive = useCallback(() => {
    const viewportMid = window.innerHeight * 0.45;
    let best = -1;
    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportMid) best = i;
    });
    setActiveIndex(best);
  }, []);

  useEffect(() => {
    updateActive();
    recalcPositions();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
    };
  }, [updateActive, recalcPositions]);

  const lineTop = circlePositions.length >= 4 ? circlePositions[0] : 0;
  const lineBottom = circlePositions.length >= 4 ? circlePositions[STEPS.length - 1] : 0;
  const lineHeight = lineBottom - lineTop;
  const arrowY = activeIndex >= 0 && circlePositions[activeIndex] ? circlePositions[activeIndex] : lineTop;
  const fillHeight = Math.max(0, arrowY - lineTop);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="glass-section py-24 md:py-32 px-6 overflow-hidden"
    >
      {/* Ambient orbs */}
      <div className="glass-ambient w-[500px] h-[500px] -top-32 left-1/2 -translate-x-1/2" style={{ background: 'rgba(255,107,53,0.05)' }} />
      <div className="glass-ambient w-[350px] h-[350px] -bottom-16 right-0" style={{ background: 'rgba(255,140,80,0.04)', animationDelay: '-8s' }} />

      {/* 3D floating gem shapes */}
      <div className="absolute top-1/4 left-[10%] w-32 h-32 pointer-events-none opacity-[0.04]"
        style={{
          background: 'linear-gradient(135deg, rgba(255,107,53,0.6) 0%, transparent 70%)',
          clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
          filter: 'blur(25px)',
          animation: 'float3D 9s ease-in-out infinite',
        }} />
      <div className="absolute bottom-1/3 right-[8%] w-40 h-40 pointer-events-none opacity-[0.03]"
        style={{
          background: 'linear-gradient(225deg, rgba(255,180,120,0.5) 0%, transparent 60%)',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          filter: 'blur(30px)',
          animation: 'float3D 7s ease-in-out infinite reverse',
        }} />

      <div className="max-w-[900px] mx-auto relative">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase mb-4"
            style={{ color: 'var(--accent)', fontFamily: 'Inter, system-ui, sans-serif' }}>
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-[-0.02em]"
            style={{ color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}>
            My Creative Process
          </h2>
          <p className="max-w-[500px] mx-auto text-base leading-relaxed"
            style={{ color: 'var(--text-muted)' }}>
            A proven 4-step workflow refined across 180+ projects.
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Center line */}
          {lineTop > 0 && (
            <div
              className="absolute left-[35px] md:left-1/2 md:-translate-x-px w-px pointer-events-none"
              style={{
                top: `${lineTop}px`,
                height: `${lineHeight}px`,
                background: 'var(--border-subtle)',
              }}
            />
          )}

          {/* Filled line */}
          {lineTop > 0 && fillHeight > 0 && (
            <div
              className="absolute left-[35px] md:left-1/2 md:-translate-x-px w-px pointer-events-none"
              style={{
                top: `${lineTop}px`,
                height: `${fillHeight}px`,
                background:
                  'linear-gradient(180deg, rgba(255,107,53,0.7) 0%, rgba(255,107,53,0.4) 70%, rgba(255,107,53,0.15) 100%)',
                boxShadow: '0 0 8px rgba(255,107,53,0.3)',
              }}
            />
          )}

          {/* Arrow indicator */}
          <AnimatePresence>
            {activeIndex >= 0 && arrowY > 0 && (
              <motion.div
                key="arrow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute z-10 pointer-events-none"
                style={{
                  left: '35px',
                  top: `${arrowY}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div
                  className="absolute -inset-3 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255,107,53,0.35) 0%, rgba(255,107,53,0.1) 40%, transparent 70%)',
                    animation: 'arrowPulse 2s ease-in-out infinite',
                  }}
                />
                {/* Desktop: triangle */}
                <div
                  className="hidden md:block"
                  style={{
                    width: 0, height: 0,
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    borderLeft: '16px solid #FF6B35',
                    filter: 'drop-shadow(0 0 6px rgba(255,107,53,0.6))',
                    marginLeft: '-8px',
                  }}
                />
                {/* Mobile: dot */}
                <div
                  className="md:hidden w-3 h-3 rounded-full"
                  style={{
                    background: '#FF6B35',
                    boxShadow: '0 0 10px rgba(255,107,53,0.8), 0 0 20px rgba(255,107,53,0.4)',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Steps */}
          <div className="flex flex-col">
            {STEPS.map((step, i) => {
              const isReached = i <= activeIndex;
              const isCurrent = i === activeIndex;

              return (
                <div
                  key={step.num}
                  ref={(el) => { stepRefs.current[i] = el; }}
                  className="relative flex items-start gap-6 md:gap-0 pb-16 last:pb-0 min-h-[120px]"
                >
                  {/* Number circle */}
                  <div data-circle className="relative z-10 flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                    <motion.div
                      className="w-[36px] h-[36px] rounded-full flex items-center justify-center"
                      animate={{
                        background: isReached
                          ? 'rgba(255,107,53,0.25)'
                          : 'var(--bg-glass)',
                        borderColor: isCurrent
                          ? 'var(--border-accent-strong)'
                          : isReached
                            ? 'var(--border-accent)'
                            : 'var(--border-subtle)',
                        boxShadow: isCurrent
                          ? '0 0 24px rgba(255,107,53,0.3)'
                          : isReached
                            ? '0 0 8px rgba(255,107,53,0.1)'
                            : 'none',
                        scale: isCurrent ? 1.15 : 1,
                      }}
                      transition={{ duration: 0.4, ease: [0.16, 0.04, 0.12, 1] }}
                      style={{ border: '1.5px solid' }}
                    >
                      <motion.span
                        className="text-xs font-bold tracking-[0.05em]"
                        animate={{
                          color: isReached ? '#FF6B35' : 'var(--text-dim)',
                        }}
                        transition={{ duration: 0.3 }}
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                      >
                        {step.num}
                      </motion.span>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 md:w-[42%] md:shrink-0 ${
                      i % 2 === 0
                        ? 'md:ml-[52%] md:pl-6 md:pr-0'
                        : 'md:mr-[52%] md:pr-6 md:pl-0 md:text-right'
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isReached ? { opacity: 1, y: 0 } : { opacity: 0.15, y: 15 }}
                      transition={{ duration: 0.5, ease: [0.16, 0.04, 0.12, 1] }}
                    >
                      <h3
                        className="text-lg md:text-xl font-semibold mb-2 tracking-[-0.01em] transition-colors duration-300"
                        style={{
                          color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                      >
                        {step.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed transition-colors duration-300"
                        style={{
                          color: isReached ? 'var(--text-muted)' : 'var(--text-dim)',
                          fontFamily: 'Inter, system-ui, sans-serif',
                        }}
                      >
                        {step.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
