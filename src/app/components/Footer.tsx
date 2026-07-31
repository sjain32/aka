'use client';

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
          className="text-lg font-bold tracking-[0.15em] transition-colors"
          style={{ color: 'var(--text-primary)', fontFamily: 'Inter, system-ui, sans-serif' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
        >
          AKASH<span style={{ color: 'var(--accent)' }}>.</span>
        </button>

        {/* Links */}
        <div className="flex items-center gap-6">
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
