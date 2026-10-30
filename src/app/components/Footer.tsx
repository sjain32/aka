'use client';

import AkashMark from './AkashMark';

export default function Footer() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 px-6" style={{ background: 'var(--bg-root)' }}>
      <div className="absolute top-0 left-6 right-6 h-px" style={{ background: 'var(--border-subtle)' }} />

      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <button
          onClick={() => scrollTo('#hero')}
          aria-label="Akash — back to top"
          className="flex items-center gap-3 text-lg font-extrabold tracking-[0.04em] transition-colors"
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-archivo), Inter, system-ui, sans-serif',
            fontStretch: '125%',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
        >
          <AkashMark size={28} />
          AKASH
        </button>

        {/* Links */}
        <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center">
          {[
            { label: 'Work', href: '#work' },
            { label: 'About', href: '#about' },
            { label: 'Services', href: '#services' },
            { label: 'Process', href: '#process' },
            { label: 'FAQ', href: '#faq' },
          ].map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-xs font-medium tracking-[0.05em] uppercase transition-colors"
              style={{ color: 'var(--text-dim)', fontFamily: 'Inter, system-ui, sans-serif' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Copyright */}
        <p
          className="text-xs"
          style={{ color: 'var(--text-dim)', fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          &copy; {new Date().getFullYear()} Akash. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
