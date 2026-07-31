'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface Reel {
  id: string;
  thumbnail: string;
  title: string;
  category: string;
  views: string;
  duration: string;
  featured?: boolean;
}

const CATEGORIES = ['All', 'Travel', 'Product', 'Lifestyle', 'Sports', 'Food'];

const REELS: Reel[] = [
  { id: '1',  thumbnail: 'https://picsum.photos/seed/reel1/400/711',  title: 'Goa Beach Edit',           category: 'Travel',    views: '124K', duration: '0:32' },
  { id: '2',  thumbnail: 'https://picsum.photos/seed/reel2/400/711',  title: 'iPhone Unboxing',          category: 'Product',   views: '89K',  duration: '0:18', featured: true },
  { id: '3',  thumbnail: 'https://picsum.photos/seed/reel3/400/711',  title: 'Morning Routine',          category: 'Lifestyle', views: '256K', duration: '0:24' },
  { id: '4',  thumbnail: 'https://picsum.photos/seed/reel4/400/711',  title: 'Himalayan Trek',           category: 'Travel',    views: '412K', duration: '0:45', featured: true },
  { id: '5',  thumbnail: 'https://picsum.photos/seed/reel5/400/711',  title: 'Cricket Edit',             category: 'Sports',    views: '178K', duration: '0:28' },
  { id: '6',  thumbnail: 'https://picsum.photos/seed/reel6/400/711',  title: 'Street Food Reel',         category: 'Food',      views: '340K', duration: '0:22' },
  { id: '7',  thumbnail: 'https://picsum.photos/seed/reel7/400/711',  title: 'Sneaker Close-up',         category: 'Product',   views: '67K',  duration: '0:15' },
  { id: '8',  thumbnail: 'https://picsum.photos/seed/reel8/400/711',  title: 'Sunset Timelapse',         category: 'Travel',    views: '503K', duration: '0:35', featured: true },
  { id: '9',  thumbnail: 'https://picsum.photos/seed/reel9/400/711',  title: 'Gym Transformation',       category: 'Sports',    views: '198K', duration: '0:40' },
  { id: '10', thumbnail: 'https://picsum.photos/seed/reel10/400/711', title: 'Cafe Aesthetic',           category: 'Lifestyle', views: '92K',  duration: '0:19' },
  { id: '11', thumbnail: 'https://picsum.photos/seed/reel11/400/711', title: 'Biriyani Making',          category: 'Food',      views: '289K', duration: '0:52' },
  { id: '12', thumbnail: 'https://picsum.photos/seed/reel12/400/711', title: 'Perfume Ad',               category: 'Product',   views: '145K', duration: '0:21' },
];

export default function ReelsShowcase() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeReel, setActiveReel] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredReel, setHoveredReel] = useState<string | null>(null);

  const filtered = activeCategory === 'All'
    ? REELS
    : REELS.filter((r) => r.category === activeCategory);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < maxScroll - 4);
    setScrollProgress(maxScroll > 0 ? (el.scrollLeft / maxScroll) * 100 : 0);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll, filtered]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };

  /* Drag */
  const drag = useRef({ down: false, sx: 0, sl: 0 });
  const onMD = (e: React.MouseEvent) => {
    const el = scrollRef.current; if (!el) return;
    drag.current = { down: true, sx: e.pageX - el.offsetLeft, sl: el.scrollLeft };
    el.style.cursor = 'grabbing';
  };
  const onMU = () => { drag.current.down = false; if (scrollRef.current) scrollRef.current.style.cursor = 'grab'; };
  const onMM = (e: React.MouseEvent) => {
    if (!drag.current.down) return; e.preventDefault();
    const el = scrollRef.current; if (!el) return;
    el.scrollLeft = drag.current.sl - (e.pageX - el.offsetLeft - drag.current.sx) * 1.5;
  };

  /* 3D tilt */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, reelId: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.06)`;
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
    setHoveredReel(null);
  };

  /* Keyboard nav */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') scroll('left');
      if (e.key === 'ArrowRight') scroll('right');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section
      className="relative py-24 md:py-32 overflow-x-hidden"
      style={{ background: 'var(--bg-root)' }}
      ref={sectionRef}
    >
      {/* Divider */}
      <div className="absolute top-0 left-6 right-6 glass-divider" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 'min(800px, 95vw)',
          height: 'min(600px, 70vh)',
          background: 'radial-gradient(ellipse, rgba(255,107,53,0.05) 0%, transparent 60%)',
        }} />

      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 0.04, 0.12, 1] }}
        >
          <div>
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase mb-3"
              style={{ color: 'var(--accent)', fontFamily: 'Inter, system-ui, sans-serif' }}>
              My Work
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.02em]"
              style={{ color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}>
              Featured Projects
            </h2>
          </div>

          <a href="https://instagram.com/yourusername" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.08em] uppercase transition-colors duration-300"
            style={{ color: 'var(--text-muted)', fontFamily: 'Inter, system-ui, sans-serif' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}>
            View All
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </motion.div>

        {/* Category pills */}
        <motion.div
          className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none"
          initial={{ opacity: 0, y: 15 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 0.04, 0.12, 1] }}
        >
          {CATEGORIES.map((cat) => {
            const count = cat === 'All' ? REELS.length : REELS.filter(r => r.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-[0.05em] uppercase transition-all duration-300"
                style={{
                  background: isActive ? 'rgba(255,107,53,0.2)' : 'var(--bg-glass)',
                  border: isActive ? '1px solid var(--border-accent)' : '1px solid var(--border-subtle)',
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {cat}
                <span style={{
                  fontSize: '10px',
                  color: isActive ? 'rgba(255,107,53,0.7)' : 'var(--text-dim)',
                  background: isActive ? 'rgba(255,107,53,0.15)' : 'var(--bg-elevated)',
                  padding: '1px 6px',
                  borderRadius: '99px',
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Scroll track */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 0.04, 0.12, 1] }}
        >
          {/* Left arrow */}
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: canScrollLeft ? 'var(--bg-glass)' : 'var(--bg-elevated)',
              backdropFilter: 'blur(12px)',
              border: canScrollLeft ? '1px solid var(--border-strong)' : '1px solid var(--border-subtle)',
              boxShadow: canScrollLeft ? 'var(--shadow-button)' : 'none',
              opacity: canScrollLeft ? 1 : 0.3,
              cursor: canScrollLeft ? 'pointer' : 'default',
            }}
            aria-label="Scroll left"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke={canScrollLeft ? 'var(--text-primary)' : 'var(--text-dim)'} strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: canScrollRight ? 'var(--bg-glass)' : 'var(--bg-elevated)',
              backdropFilter: 'blur(12px)',
              border: canScrollRight ? '1px solid var(--border-strong)' : '1px solid var(--border-subtle)',
              boxShadow: canScrollRight ? 'var(--shadow-button)' : 'none',
              opacity: canScrollRight ? 1 : 0.3,
              cursor: canScrollRight ? 'pointer' : 'default',
            }}
            aria-label="Scroll right"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke={canScrollRight ? 'var(--text-primary)' : 'var(--text-dim)'} strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, var(--bg-root) 0%, transparent 100%)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(270deg, var(--bg-root) 0%, transparent 100%)' }} />

          {/* Reels scroll */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-none cursor-grab select-none pb-6 px-2"
            style={{ scrollSnapType: 'x mandatory' }}
            onMouseDown={onMD} onMouseUp={onMU} onMouseLeave={onMU} onMouseMove={onMM}
          >
            {filtered.map((reel, i) => {
              const isActive = activeReel === reel.id;
              const isHovered = hoveredReel === reel.id;
              return (
                <motion.div
                  key={reel.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, delay: i * 0.03 }}
                  className="flex-shrink-0 relative cursor-pointer"
                  style={{
                    width: 'clamp(220px, 36vw, 280px)',
                    aspectRatio: '9 / 16',
                    scrollSnapAlign: 'center',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseMove={(e) => { setHoveredReel(reel.id); handleMouseMove(e, reel.id); }}
                  onMouseLeave={(e) => { handleMouseLeave(e); }}
                  onClick={() => setActiveReel(isActive ? null : reel.id)}
                >
                  <div
                    className="relative w-full h-full rounded-2xl overflow-hidden transition-shadow duration-500"
                    style={{
                      border: isActive ? '1.5px solid var(--border-accent-strong)' : '1px solid var(--border-subtle)',
                      boxShadow: isActive
                        ? '0 0 50px var(--accent-glow), var(--shadow-card-hover)'
                        : isHovered
                          ? 'var(--shadow-card-hover)'
                          : 'var(--shadow-card)',
                    }}
                  >
                    <img src={reel.thumbnail} alt={reel.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                      style={{ transform: isHovered ? 'scale(1.12)' : 'scale(1)' }}
                      loading="lazy" />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/8 to-black/15" />
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-500"
                      style={{
                        background: 'radial-gradient(ellipse at center, rgba(255,107,53,0.12) 0%, transparent 60%)',
                        opacity: isHovered ? 1 : 0,
                      }} />

                    {/* Play button */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                      style={{
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered
                          ? 'translate(-50%, -50%) scale(1)'
                          : 'translate(-50%, -50%) scale(0.7)',
                      }}>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{
                          background: 'rgba(255,107,53,0.9)',
                          backdropFilter: 'blur(8px)',
                          border: '2px solid rgba(255,255,255,0.35)',
                          boxShadow: '0 0 30px rgba(255,107,53,0.5), var(--shadow-card-hover)',
                        }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                          <polygon points="6,3 21,12 6,21" />
                        </svg>
                      </div>
                    </div>

                    {/* Featured badge */}
                    {reel.featured && (
                      <span className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.1em] uppercase"
                        style={{
                          background: 'rgba(255,107,53,0.9)',
                          color: '#fff',
                          fontFamily: 'Inter, system-ui, sans-serif',
                          boxShadow: '0 2px 12px rgba(255,107,53,0.4)',
                        }}>
                        ★ Featured
                      </span>
                    )}

                    {/* Duration */}
                    <span className="absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-semibold text-white/90"
                      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {reel.duration}
                    </span>

                    {/* Category tag */}
                    {!reel.featured && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase"
                        style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(4px)', color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, system-ui, sans-serif', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {reel.category}
                      </span>
                    )}

                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-sm font-semibold text-white mb-1.5 leading-tight"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        {reel.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)">
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" />
                          </svg>
                          <span className="text-[11px] text-white/45 font-medium"
                            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                            {reel.views}
                          </span>
                        </div>
                        <span className="text-[11px] text-white/30">•</span>
                        <span className="text-[11px] text-white/45 font-medium uppercase tracking-[0.03em]"
                          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                          {reel.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Scroll progress bar */}
        <motion.div
          className="mt-8 max-w-[400px] mx-auto"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="relative h-[2px] rounded-full overflow-hidden"
            style={{ background: 'var(--border-subtle)' }}>
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${scrollProgress}%`,
                background: 'linear-gradient(90deg, rgba(255,107,53,0.6), rgba(255,140,80,0.4))',
                boxShadow: '0 0 6px rgba(255,107,53,0.3)',
              }}
              transition={{ duration: 0.15, ease: 'linear' }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
              style={{
                left: `${scrollProgress}%`,
                marginLeft: '-5px',
                background: '#FF6B35',
                boxShadow: '0 0 10px rgba(255,107,53,0.7)',
              }}
              transition={{ duration: 0.15, ease: 'linear' }}
            />
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
