'use client';

import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useEffect, useRef, useState, useCallback } from 'react';

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 180, suffix: '+', label: 'Projects Completed' },
  { value: 96, suffix: '%', label: 'Client Satisfaction' },
  { value: 5, suffix: '+', label: 'Years of Experience' },
];

const TESTIMONIALS = [
  {
    quote:
      'Akash transformed our raw travel footage into a cinematic masterpiece. The engagement on our reels tripled within a week.',
    author: 'Priya M.',
    role: 'Travel Creator, @wanderwithpriya',
  },
  {
    quote:
      'Aakash is a highly creative editor who quickly understands a creator\'s vision and brings it to life perfectly. Some videos on our YouTube channel edited by him have achieved great views and engagement. Highly recommended!',
    author: 'Harshit Beri',
    role: 'CEO, ONLINE BERI',
  },
  {
    quote:
      'The motion graphics he added elevated our product launch video to a whole new level. Booked him for our next 3 campaigns.',
    author: 'Ankit D.',
    role: 'Marketing Lead, TechVibe',
  },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let raf: number;
    const start = performance.now();
    const duration = 2000;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof TESTIMONIALS)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsActive(true);
        } else {
          // Only deactivate if the card has scrolled well past the viewport
          // This prevents flickering when cards are partially visible
          if (entry.boundingClientRect.bottom < -50 || entry.boundingClientRect.top > window.innerHeight + 50) {
            setIsActive(false);
          }
        }
      });
    },
    [],
  );

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    // Higher threshold on mobile so the highlight triggers when the card is more centered
    const isMobile = window.innerWidth < 768;
    const obs = new IntersectionObserver(handleIntersection, {
      threshold: isMobile ? [0, 0.3, 0.5, 0.7, 1] : [0, 0.5, 1],
      rootMargin: isMobile ? '-10% 0px -10% 0px' : '0px',
    });

    obs.observe(el);
    return () => obs.disconnect();
  }, [handleIntersection]);

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card p-5 md:p-6 relative testimonial-card ${isActive ? 'testimonial-active' : ''}`}
      style={{
        transition:
          'all 0.5s cubic-bezier(0.22, 0.05, 0.1, 1), box-shadow 0.5s ease, border-color 0.5s ease',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        e.currentTarget.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
        e.currentTarget.style.borderColor = 'var(--border-accent)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0)';
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.borderColor = isActive ? 'var(--border-accent-strong)' : 'var(--border-subtle)';
      }}
    >
      {/* Active glow indicator for mobile */}
      {isActive && (
        <span className="testimonial-active-dot" aria-hidden="true" />
      )}

      {/* Quote mark */}
      <span
        className="absolute top-3 right-4 md:top-4 md:right-5 text-4xl md:text-5xl leading-none select-none"
        style={{ color: 'rgba(255,107,53,0.15)', fontFamily: 'Georgia, serif' }}
      >
        &ldquo;
      </span>

      <p
        className="text-sm leading-relaxed mb-5 relative z-10"
        style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {testimonial.quote}
      </p>

      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
            color: '#fff',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {testimonial.author.charAt(0)}
        </div>
        <div className="min-w-0">
          <div
            className="text-sm font-semibold truncate"
            style={{ color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {testimonial.author}
          </div>
          <div
            className="text-xs truncate"
            style={{ color: 'var(--text-muted)', fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {testimonial.role}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="glass-section py-20 md:py-32 px-4 sm:px-6 overflow-x-hidden">
      <div className="glass-divider absolute top-0 left-4 sm:left-6 right-4 sm:right-6" />

      <div className="max-w-[1100px] mx-auto" ref={ref}>
        {/* Header */}
        <div
          className="text-center mb-12 md:mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <span
            className="inline-block text-[0.65rem] sm:text-xs font-semibold tracking-[0.15em] uppercase mb-3 md:mb-4"
            style={{ color: 'var(--accent)', fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Testimonials
          </span>
          <h2
            className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 md:mb-4 tracking-[-0.02em]"
            style={{ color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Trusted by Creators &amp; Brands
          </h2>
        </div>

        {/* Stat counters */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-12 md:mb-16 max-w-[500px] sm:max-w-none mx-auto">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease: [0.16, 0.04, 0.12, 1] }}
              className="text-center"
            >
              <div
                className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-1 md:mb-2 tracking-[-0.02em]"
                style={{ color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p
                className="text-[0.6rem] sm:text-xs md:text-sm uppercase tracking-[0.08em]"
                style={{ color: 'var(--text-muted)', fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.author} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
