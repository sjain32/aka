'use client';

import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useEffect, useRef, useState } from 'react';

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
      'Incredible turnaround time and attention to detail. He understood exactly what our brand needed without lengthy briefs.',
    author: 'Rahul S.',
    role: 'Founder, Urban Eats Media',
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

export default function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="glass-section py-24 md:py-32 px-6">
      <div className="glass-divider absolute top-0 left-6 right-6" />

      <div className="max-w-[1100px] mx-auto" ref={ref}>
        {/* Header */}
        <div
          className="text-center mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <span
            className="inline-block text-xs font-semibold tracking-[0.15em] uppercase mb-4"
            style={{ color: 'var(--accent)', fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Testimonials
          </span>
          <h2
            className="text-3xl md:text-5xl font-bold mb-4 tracking-[-0.02em]"
            style={{ color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Trusted by Creators & Brands
          </h2>
        </div>

        {/* Stat counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease: [0.16, 0.04, 0.12, 1] }}
              className="text-center"
            >
              <div
                className="text-4xl md:text-5xl font-extrabold mb-2 tracking-[-0.02em]"
                style={{ color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p
                className="text-sm uppercase tracking-[0.08em]"
                style={{ color: 'var(--text-muted)', fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 + i * 0.12, ease: [0.16, 0.04, 0.12, 1] }}
              className="glass-card p-6"
              style={{ transition: 'all 0.5s cubic-bezier(0.22, 0.05, 0.1, 1)', transformStyle: 'preserve-3d' }}
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
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              {/* Quote mark */}
              <span
                className="absolute top-4 right-5 text-5xl leading-none select-none"
                style={{ color: 'rgba(255,107,53,0.15)', fontFamily: 'Georgia, serif' }}
              >
                &ldquo;
              </span>

              <p
                className="text-sm leading-relaxed mb-5 relative z-10"
                style={{ color: 'var(--text-secondary)', fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {t.quote}
              </p>

              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
                    color: '#fff',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {t.author}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: 'var(--text-muted)', fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
