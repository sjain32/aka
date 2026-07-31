'use client';

import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useRef } from 'react';

/* ── SVG Icons ── */

const IconEdit = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="14" height="16" rx="2" />
    <polygon points="12,9 16,12 12,15" />
    <line x1="18" y1="7" x2="22" y2="7" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="18" y1="17" x2="22" y2="17" />
  </svg>
);

const IconMotion = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
    <polyline points="2,8.5 12,15 22,8.5" />
    <line x1="12" y1="15" x2="12" y2="22" />
  </svg>
);

const IconTravel = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="10" r="3" />
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
  </svg>
);

const IconStrategy = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
  </svg>
);

/* ── Data ── */

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  deliverables: string;
}

const SERVICES: Service[] = [
  {
    icon: <IconEdit />,
    title: 'Video Editing',
    description: 'Precision-cut edits for Reels, Shorts, YouTube, and branded content — paced for maximum retention and engagement.',
    deliverables: 'Social cuts · Long-form · Ad spots · Event recaps',
  },
  {
    icon: <IconMotion />,
    title: 'Motion Graphics',
    description: 'Custom animations, kinetic type, logo reveals, and visual effects that elevate production value without distracting from the story.',
    deliverables: 'Title sequences · LUT packs · Transitions · VFX composites',
  },
  {
    icon: <IconTravel />,
    title: 'Travel & Tourism',
    description: 'Cinematic destination edits, hotel promos, and drone-integrated reels that capture atmosphere and drive bookings.',
    deliverables: 'Destination films · Property tours · Aerial edits · Grading',
  },
  {
    icon: <IconStrategy />,
    title: 'Creative Direction',
    description: 'End-to-end content strategy — from concept and storyboarding through final delivery — built around your brand goals.',
    deliverables: 'Content calendars · Brand kits · Campaign direction · Analytics',
  },
];

/* ── Service Card ── */

function ServiceCard({ svc, index, isVisible }: { svc: Service; index: number; isVisible: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-8px) translateZ(10px)`;
    el.style.background = 'var(--bg-glass-hover)';
    el.style.borderColor = 'var(--border-accent)';
    el.style.boxShadow = 'var(--shadow-card-hover)';
    el.style.zIndex = '5';
  };

  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0) translateZ(0)';
    el.style.background = 'var(--bg-glass)';
    el.style.borderColor = 'var(--border-subtle)';
    el.style.boxShadow = 'none';
    el.style.zIndex = '1';
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.15 + index * 0.1, ease: [0.16, 0.04, 0.12, 1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative p-8 md:p-10 rounded-2xl cursor-default"
      style={{
        background: 'var(--bg-glass)',
        border: '1px solid var(--border-subtle)',
        transition: 'all 0.5s cubic-bezier(0.22, 0.05, 0.1, 1)',
        zIndex: 1,
      }}
    >
      {/* Hover gradient sweep */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, rgba(255,107,53,0.07) 0%, transparent 60%)',
          }} />
      </div>

      {/* Icon container */}
      <div className="relative mb-7">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
          }}>
          <div className="transition-all duration-500 group-hover:scale-110" style={{ color: 'inherit' }}>
            {svc.icon}
          </div>
        </div>
        {/* Icon glow on hover */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,107,53,0.15) 0%, transparent 70%)',
            filter: 'blur(8px)',
            transform: 'scale(1.4)',
          }} />
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold mb-3 tracking-[-0.01em] transition-colors duration-300"
        style={{ color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}>
        {svc.title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-5 max-w-[380px] transition-colors duration-300"
        style={{
          color: 'var(--text-muted)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
        {svc.description}
      </p>

      {/* Deliverables */}
      <p className="text-[11px] tracking-[0.05em] leading-relaxed uppercase transition-colors duration-300"
        style={{
          color: 'var(--text-dim)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
        {svc.deliverables}
      </p>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-6 right-6 h-px transition-all duration-500 scale-x-0 opacity-0 group-hover:opacity-100 group-hover:scale-x-100"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,107,53,0.6), transparent)',
        }}
      />

      {/* Corner bracket (top-left) */}
      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
        <div className="w-5 h-5 border-l border-t rounded-tl-md transition-all duration-500"
          style={{ borderColor: 'var(--border-accent)' }} />
      </div>

      {/* Corner bracket (bottom-right) */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
        <div className="w-5 h-5 border-r border-b rounded-br-md transition-all duration-500"
          style={{ borderColor: 'var(--border-accent)' }} />
      </div>
    </motion.div>
  );
}

/* ── Section ── */

export default function ServicesSection() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      id="services"
      className="relative py-24 md:py-32 px-6"
      style={{ background: 'var(--bg-section)' }}
    >
      {/* Texture */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(128,128,128,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 40%, transparent 80%)',
        }} />

      {/* Ambient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,107,53,0.05) 0%, transparent 70%)' }} />

      {/* 3D floating geometric accent */}
      <div className="absolute top-1/3 right-[8%] w-40 h-40 pointer-events-none opacity-[0.06]"
        style={{
          background: 'linear-gradient(135deg, rgba(255,107,53,0.5) 0%, transparent 60%)',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          filter: 'blur(30px)',
          animation: 'float3D 8s ease-in-out infinite',
        }} />
      <div className="absolute bottom-1/4 left-[5%] w-56 h-56 pointer-events-none opacity-[0.04]"
        style={{
          background: 'linear-gradient(225deg, rgba(255,140,80,0.5) 0%, transparent 60%)',
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
          filter: 'blur(40px)',
          animation: 'float3D 10s ease-in-out infinite reverse',
        }} />

      {/* Divider */}
      <div className="absolute top-0 left-6 right-6 glass-divider" />

      <div className="max-w-[1100px] mx-auto relative" ref={ref}>
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 0.04, 0.12, 1] }}
        >
          <span className="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase mb-5"
            style={{ color: 'var(--accent)', fontFamily: 'Inter, system-ui, sans-serif' }}>
            Capabilities
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.15] max-w-[600px]"
            style={{ color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}>
            End-to-end video production,{' '}
            <span style={{ color: 'var(--text-muted)' }}>from concept to delivery.</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SERVICES.map((svc, i) => (
            <ServiceCard key={svc.title} svc={svc} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}
