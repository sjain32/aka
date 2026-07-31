'use client';

import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'fade';
  delay?: number;
  duration?: number;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 0.8,
  threshold = 0.1,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, triggerOnce: true });

  const getAnimationStyle = () => {
    const baseStyle = {
      transition: `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
    };

    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return {
            ...baseStyle,
            opacity: 0,
            transform: 'translateY(60px)',
          };
        case 'fade-down':
          return {
            ...baseStyle,
            opacity: 0,
            transform: 'translateY(-60px)',
          };
        case 'fade-left':
          return {
            ...baseStyle,
            opacity: 0,
            transform: 'translateX(60px)',
          };
        case 'fade-right':
          return {
            ...baseStyle,
            opacity: 0,
            transform: 'translateX(-60px)',
          };
        case 'scale':
          return {
            ...baseStyle,
            opacity: 0,
            transform: 'scale(0.8)',
          };
        case 'fade':
          return {
            ...baseStyle,
            opacity: 0,
          };
        default:
          return baseStyle;
      }
    }

    return {
      ...baseStyle,
      opacity: 1,
      transform: 'translateY(0) translateX(0) scale(1)',
    };
  };

  return (
    <div ref={ref} style={getAnimationStyle()}>
      {children}
    </div>
  );
}
