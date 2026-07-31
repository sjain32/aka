'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface LenisScrollValues {
  scrollY: number;
  velocity: number;
  direction: 'up' | 'down';
  progress: number; // 0 to 1 across the full page
  isScrolling: boolean;
}

export function useLenisScroll(): LenisScrollValues {
  const [values, setValues] = useState<LenisScrollValues>({
    scrollY: 0,
    velocity: 0,
    direction: 'down',
    progress: 0,
    isScrolling: false,
  });

  const lastY = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = useCallback((e: Event) => {
    const detail = (e as CustomEvent<{ scroll: number; velocity: number }>).detail;
    if (!detail) return;

    const { scroll, velocity } = detail;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scroll / maxScroll : 0;
    const direction = scroll > lastY.current ? 'down' : 'up';
    lastY.current = scroll;

    setValues({
      scrollY: scroll,
      velocity: Math.abs(velocity),
      direction,
      progress: Math.min(1, Math.max(0, progress)),
      isScrolling: true,
    });

    // Clear previous idle timer
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setValues((prev) => ({ ...prev, isScrolling: false, velocity: 0 }));
    }, 150);
  }, []);

  useEffect(() => {
    // Listen for Lenis scroll events
    window.addEventListener('lenis-scroll', handleScroll as EventListener);

    // Also listen for native scroll as fallback
    const onNativeScroll = () => {
      const scroll = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scroll / maxScroll : 0;
      const direction = scroll > lastY.current ? 'down' : 'up';
      lastY.current = scroll;

      setValues({
        scrollY: scroll,
        velocity: 0,
        direction,
        progress: Math.min(1, Math.max(0, progress)),
        isScrolling: true,
      });

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setValues((prev) => ({ ...prev, isScrolling: false }));
      }, 150);
    };

    window.addEventListener('scroll', onNativeScroll, { passive: true });

    return () => {
      window.removeEventListener('lenis-scroll', handleScroll as EventListener);
      window.removeEventListener('scroll', onNativeScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [handleScroll]);

  return values;
}
