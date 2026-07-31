'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useMousePosition } from '../hooks/useMousePosition';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition();
  const rafRef = useRef<number>(0);
  const posRef = useRef({ x: 0, y: 0 });

  const animate = useCallback(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    // Smooth follow for the ring
    posRef.current.x += (x - posRef.current.x) * 0.12;
    posRef.current.y += (y - posRef.current.y) * 0.12;

    cursor.style.transform = `translate3d(${posRef.current.x - 20}px, ${posRef.current.y - 20}px, 0)`;
    dot.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`;

    rafRef.current = requestAnimationFrame(animate);
  }, [x, y]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  // Handle hover states on interactive elements
  useEffect(() => {
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursor = cursorRef.current;
      if (!cursor) return;

      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor-hover]')
      ) {
        cursor.style.width = '64px';
        cursor.style.height = '64px';
        cursor.style.marginLeft = '-12px';
        cursor.style.marginTop = '-12px';
        cursor.style.background = 'var(--accent-glow)';
        cursor.style.borderColor = 'var(--border-accent-strong)';
        cursor.style.mixBlendMode = 'normal';
      }

      if (target.closest('[data-cursor-text]')) {
        cursor.style.width = '100px';
        cursor.style.height = '100px';
        cursor.style.marginLeft = '-30px';
        cursor.style.marginTop = '-30px';
        cursor.style.background = 'var(--accent-glow)';
        cursor.style.borderColor = 'var(--border-accent-strong)';
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursor = cursorRef.current;
      if (!cursor) return;

      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor-hover]') ||
        target.closest('[data-cursor-text]')
      ) {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
        cursor.style.marginLeft = '0px';
        cursor.style.marginTop = '0px';
        cursor.style.background = 'transparent';
        cursor.style.borderColor = 'var(--border-strong)';
        cursor.style.mixBlendMode = 'difference';
      }
    };

    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className="hidden lg:block fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          width: '40px',
          height: '40px',
          border: '1.5px solid var(--border-strong)',
          mixBlendMode: 'difference',
          transition:
            'width 0.3s cubic-bezier(0.17, 0.67, 0.16, 1), height 0.3s cubic-bezier(0.17, 0.67, 0.16, 1), margin 0.3s cubic-bezier(0.17, 0.67, 0.16, 1), background 0.3s cubic-bezier(0.17, 0.67, 0.16, 1), border-color 0.3s cubic-bezier(0.17, 0.67, 0.16, 1)',
        }}
      />

      {/* Center dot */}
      <div
        ref={dotRef}
        className="hidden lg:block fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          width: '6px',
          height: '6px',
          background: '#FF6B35',
          boxShadow: '0 0 10px rgba(255, 107, 53, 0.8), 0 0 20px rgba(255, 107, 53, 0.4)',
        }}
      />
    </>
  );
}
