'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import NoSSR from './components/NoSSR';
import Navbar from './components/Navbar';
import VideoHero from './components/VideoHero';
import EditorSection from './components/EditorSection';
import ReelsShowcase from './components/ReelsShowcase';
import ServicesSection from './components/ServicesSection';
import ProcessSection from './components/ProcessSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ScrollReveal from './components/ScrollReveal';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import BackgroundScene from './components/BackgroundScene';
import ParticleGlobe from './components/ParticleGlobe';

type Phase = 'loading' | 'entering' | 'done';

export default function Home() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [entranceProgress, setEntranceProgress] = useState(0);
  const [globeVisible, setGlobeVisible] = useState(true);
  const entranceRafRef = useRef<number>(0);
  const entranceStartRef = useRef<number>(0);
  const DURATION = 1500; // 1.5s entrance animation

  const startEntrance = useCallback(() => {
    setPhase('entering');
    entranceStartRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - entranceStartRef.current;
      const progress = Math.min(1, elapsed / DURATION);
      // Ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setEntranceProgress(eased);

      if (progress < 1) {
        entranceRafRef.current = requestAnimationFrame(tick);
      } else {
        setEntranceProgress(1);
        setPhase('done');
      }
    };

    entranceRafRef.current = requestAnimationFrame(tick);
  }, []);

  // Hide globe when hero or work sections are in view
  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById('hero');
      const workEl = document.getElementById('work');
      const viewHeight = window.innerHeight;

      let hide = false;

      if (heroEl) {
        const heroRect = heroEl.getBoundingClientRect();
        // Hero is still substantially visible
        if (heroRect.bottom > viewHeight * 0.2) hide = true;
      }

      if (!hide && workEl) {
        const workRect = workEl.getBoundingClientRect();
        // Work section is in view
        if (workRect.top < viewHeight * 0.8 && workRect.bottom > 0) hide = true;
      }

      setGlobeVisible(!hide);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(entranceRafRef.current);
  }, []);

  return (
    <NoSSR fallback={
      <div className="min-h-screen" style={{ background: 'var(--bg-root)' }}>
        <section className="hero">
          <div className="container">
            <h1 className="hero-title">Video Editor Portfolio</h1>
            <p className="hero-subtitle">
              Bringing stories to life through creative video editing
            </p>
          </div>
        </section>
      </div>
    }>
      {/* Preloader — visible during loading + entrance */}
      {phase !== 'done' && (
        <Preloader
          onComplete={startEntrance}
          exitProgress={phase === 'entering' ? entranceProgress : 0}
        />
      )}

      {/* Globe — hidden over hero and work sections for content visibility */}
      <ParticleGlobe
        entranceProgress={phase === 'loading' ? 0 : phase === 'entering' ? entranceProgress : null}
        visible={globeVisible}
      />

      <ClientOnlyPortfolio show={phase === 'done'} />
    </NoSSR>
  );
}

function ClientOnlyPortfolio({ show }: { show: boolean }) {
  const scrollToProjects = () => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      className="min-h-screen w-full overflow-x-hidden"
      style={{ background: 'var(--bg-root)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <CustomCursor />
      <BackgroundScene />
      <Navbar />

      <div id="hero">
        <VideoHero
          youtubeId="cAY8UEAGaI4"
          title="Watch My Latest Work"
          subtitle="Professional video editing that brings your vision to life"
          ctaText="Explore My Work"
          onCtaClick={scrollToProjects}
        />
      </div>

      <div id="about">
        <ScrollReveal animation="fade-up" duration={1}>
          <EditorSection
            name="AKASH"
            title="VIDEO EDITOR"
            location="BASED IN YOUR CITY"
            description="I'm a passionate and dedicated freelance video editor with a keen eye for detail and a creative flair. With years of experience in the industry, I specialize in creating compelling visual stories that captivate audiences and elevate brands."
            imageUrl="/profile.png"
            socialLinks={{
              instagram: 'https://instagram.com/yourusername',
              facebook: 'https://facebook.com/yourusername',
              youtube: 'https://youtube.com/@yourusername',
              behance: 'https://behance.net/yourusername',
            }}
          />
        </ScrollReveal>
      </div>

      <div id="work">
        <ReelsShowcase />
      </div>

      <ServicesSection />
      <ProcessSection />
      <TestimonialsSection />
      <FAQSection />

      <div id="contact">
        <section
          className="relative py-24 md:py-32 px-6 text-center"
          style={{ background: 'var(--bg-section)' }}
        >
          <div className="glass-divider absolute top-0 left-6 right-6" />
          <ScrollReveal animation="fade-up" duration={0.8}>
            <span
              className="inline-block text-xs font-semibold tracking-[0.15em] uppercase mb-4"
              style={{ color: 'var(--accent)', fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Let&apos;s Work Together
            </span>
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 tracking-[-0.02em]"
              style={{ color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Ready to create something great?
            </h2>
            <p
              className="text-base leading-relaxed max-w-[450px] mx-auto mb-8"
              style={{ color: 'var(--text-muted)' }}
            >
              Whether it&apos;s a single reel or an ongoing content partnership,
              I&apos;m here to bring your vision to life.
            </p>
            <motion.a
              href="mailto:akash@example.com"
              className="btn btn-primary btn-lg inline-flex items-center gap-2"
              style={{ textDecoration: 'none', transformStyle: 'preserve-3d' }}
              whileHover={{ scale: 1.06, translateZ: 20 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              Book a Free Call
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </motion.a>
          </ScrollReveal>
        </section>
      </div>

      <Footer />
      <BackToTop />
    </motion.div>
  );
}
