'use client';

import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden"
      style={{
        background: isDark
          ? 'rgba(255,255,255,0.04)'
          : 'rgba(0,0,0,0.04)',
        border: isDark
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid rgba(0,0,0,0.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      whileHover={{
        scale: 1.08,
        background: isDark
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(0,0,0,0.06)',
        borderColor: 'rgba(255,107,53,0.3)',
        boxShadow: isDark
          ? '0 0 24px rgba(255,107,53,0.12)'
          : '0 0 24px rgba(255,107,53,0.08)',
      }}
      whileTap={{ scale: 0.94 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Glow background on hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,107,53,0.15) 0%, transparent 70%)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
      />

      {/* Sun icon */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          opacity: isDark ? 0 : 1,
          rotate: isDark ? 90 : 0,
          scale: isDark ? 0.5 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.16, 0.04, 0.12, 1] }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" style={{ color: '#FF6B35' }} />
          <line x1="12" y1="1" x2="12" y2="3" style={{ color: '#FF6B35' }} />
          <line x1="12" y1="21" x2="12" y2="23" style={{ color: '#FF6B35' }} />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" style={{ color: '#FF6B35' }} />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" style={{ color: '#FF6B35' }} />
          <line x1="1" y1="12" x2="3" y2="12" style={{ color: '#FF6B35' }} />
          <line x1="21" y1="12" x2="23" y2="12" style={{ color: '#FF6B35' }} />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" style={{ color: '#FF6B35' }} />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" style={{ color: '#FF6B35' }} />
        </svg>
      </motion.div>

      {/* Moon icon */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          opacity: isDark ? 1 : 0,
          rotate: isDark ? 0 : -90,
          scale: isDark ? 1 : 0.5,
        }}
        transition={{ duration: 0.4, ease: [0.16, 0.04, 0.12, 1] }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" style={{ color: '#FF6B35' }} />
        </svg>
      </motion.div>
    </motion.button>
  );
}
