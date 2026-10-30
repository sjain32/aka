'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import AkashMark from './AkashMark';
import { useTheme } from '../context/ThemeContext';
import { getWhatsAppUrl } from '../lib/whatsapp';

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // When NOT scrolled (over dark video hero), always use light colors.
  // When scrolled, use theme CSS variables.
  const isHero = !scrolled;
  const textColor = isHero
    ? 'rgba(255,255,255,0.95)'
    : 'var(--text-primary)';
  const textMuted = isHero
    ? 'rgba(255,255,255,0.55)'
    : 'var(--text-muted)';
  const linkHoverBg = isHero
    ? 'rgba(255,255,255,0.1)'
    : 'var(--bg-glass)';
  const hamburgerColor = isHero
    ? '#ffffff'
    : 'var(--text-primary)';

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 0.04, 0.12, 1] }}
      className="fixed top-0 left-0 right-0 z-40 px-6 py-4"
      style={{
        background: scrolled
          ? 'var(--nav-bg)'
          : 'transparent',
        backdropFilter: scrolled ? 'var(--nav-blur)' : 'none',
        WebkitBackdropFilter: scrolled ? 'var(--nav-blur)' : 'none',
        borderBottom: scrolled
          ? '1px solid var(--border-subtle)'
          : '1px solid transparent',
        transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
      }}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollTo('#hero')}
          aria-label="Akash — back to top"
          className="flex items-center gap-3 text-lg font-extrabold tracking-[0.04em] transition-colors"
          style={{
            color: textColor,
            fontFamily: 'var(--font-archivo), Inter, system-ui, sans-serif',
            fontStretch: '125%',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = textColor; }}
        >
          {/* data-logo-target: where the preloader's logo lands on exit */}
          <span data-logo-target="mark" className="flex">
            <AkashMark size={28} />
          </span>
          <span data-logo-target="word" className="leading-none">AKASH</span>
        </button>

        {/* Desktop links + theme toggle */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="relative text-sm font-medium tracking-[0.05em] uppercase px-4 py-2 rounded-lg transition-all duration-300"
              style={{
                color: textMuted,
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = isHero ? '#ffffff' : 'var(--text-primary)';
                e.currentTarget.style.background = linkHoverBg;
                e.currentTarget.style.backdropFilter = 'blur(12px)';
                (e.currentTarget.style as any).WebkitBackdropFilter = 'blur(12px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = textMuted;
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.backdropFilter = 'none';
                (e.currentTarget.style as any).WebkitBackdropFilter = 'none';
              }}
            >
              {link.label}
            </button>
          ))}
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm ml-4"
            style={{ textDecoration: 'none' }}
          >
            Book a Call
          </a>
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            className="flex flex-col gap-[5px] p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 6 : 0 }}
              className="block w-5 h-[1.5px]"
              style={{ background: hamburgerColor }}
            />
            <motion.span
              animate={{ opacity: mobileOpen ? 0 : 1 }}
              className="block w-5 h-[1.5px]"
              style={{ background: hamburgerColor }}
            />
            <motion.span
              animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -6 : 0 }}
              className="block w-5 h-[1.5px]"
              style={{ background: hamburgerColor }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 0.04, 0.12, 1] }}
            className="md:hidden overflow-hidden"
            style={{
              background: 'var(--nav-bg)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '0 0 16px 16px',
            }}
          >
            <div className="flex flex-col gap-4 pt-4 pb-4 px-2">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-sm font-medium tracking-[0.05em] uppercase text-left px-2 transition-colors"
                  style={{
                    color: 'var(--text-secondary)',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  {link.label}
                </button>
              ))}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="btn btn-primary btn-sm self-start mt-2"
                style={{ textDecoration: 'none' }}
              >
                Book a Call
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
