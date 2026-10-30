'use client';

import { useEffect, useRef, useCallback } from 'react';

/* ================================================================
   PARTICLE GLOBE — Canvas 2D with entrance animation
   - Particles burst from center → form sphere on load
   - Scroll-driven Y rotation
   - Mouse parallax tilt
   - Theme-aware brightness (boosted in light mode)
   ================================================================ */

interface Point3D {
  ox: number; oy: number; oz: number;
  type: 'surface' | 'ring';
}

interface Props {
  entranceProgress?: number | null;
  visible?: boolean;
}

export default function ParticleGlobe({ entranceProgress = null, visible = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const pointsRef = useRef<Point3D[]>([]);
  const projectedRef = useRef<Float32Array>(new Float32Array(0));
  const globeRadiusRef = useRef(260);
  const entranceRef = useRef(0);
  const mountedRef = useRef(false);

  const stateRef = useRef({
    rotY: 0, targetRotY: 0,
    mouseX: 0.5, mouseY: 0.5,
    targetMX: 0.5, targetMY: 0.5,
    w: 0, h: 0,
  });

  // Keep entrance ref in sync without re-running the effect
  if (entranceProgress !== null && entranceProgress !== undefined) {
    entranceRef.current = entranceProgress;
  }

  const generateGlobe = useCallback((count: number, radius: number): Point3D[] => {
    const points: Point3D[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      points.push({
        ox: Math.cos(theta) * r * radius,
        oy: y * radius,
        oz: Math.sin(theta) * r * radius,
        type: 'surface',
      });
    }

    // Latitude rings
    for (const latY of [0, 0.3, 0.6, -0.3, -0.6]) {
      const r = Math.sqrt(1 - latY * latY) * radius;
      const cy = latY * radius;
      for (let j = 0; j < 80; j++) {
        const a = (j / 80) * Math.PI * 2;
        points.push({ ox: Math.cos(a) * r, oy: cy, oz: Math.sin(a) * r, type: 'ring' });
      }
    }

    // Longitude rings
    for (let l = 0; l < 10; l++) {
      const a = (l / 10) * Math.PI * 2;
      const cx = Math.cos(a), cz = Math.sin(a);
      for (let j = 0; j < 55; j++) {
        const la = (j / 54) * Math.PI;
        const sr = Math.sin(la) * radius;
        const sy = -Math.cos(la) * radius;
        points.push({ ox: cx * sr, oy: sy, oz: cz * sr, type: 'ring' });
      }
    }

    return points;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const RADIUS = 260;
    globeRadiusRef.current = RADIUS;

    // Only generate points once
    if (!mountedRef.current) {
      pointsRef.current = generateGlobe(1600, RADIUS);
      projectedRef.current = new Float32Array(pointsRef.current.length * 3);
      mountedRef.current = true;
    }

    const points = pointsRef.current;
    const projected = projectedRef.current;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      stateRef.current.w = w;
      stateRef.current.h = h;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const onScroll = () => {
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      stateRef.current.targetRotY = (window.scrollY / maxScroll) * Math.PI * 2;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const onMouse = (e: MouseEvent) => {
      stateRef.current.targetMX = e.clientX / window.innerWidth;
      stateRef.current.targetMY = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    // Accent color cache
    let accentCache: Record<string, string> = {};
    let accentCacheTime = 0;
    const getAccent = (alpha: number): string => {
      const now = performance.now();
      if (now - accentCacheTime > 2000) { accentCache = {}; accentCacheTime = now; }
      const key = alpha.toFixed(3);
      if (!accentCache[key]) {
        const el = document.documentElement;
        const hex = (getComputedStyle(el).getPropertyValue('--globe-color').trim() || '#FF6B35').replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        accentCache[key] = `rgba(${r},${g},${b},${alpha})`;
      }
      return accentCache[key];
    };

    // ── Render loop ──
    const animate = (timestamp: number) => {
      rafRef.current = requestAnimationFrame(animate);

      const elapsed = timestamp - lastFrameRef.current;
      if (elapsed < 14) return; // ~70fps cap
      lastFrameRef.current = timestamp;

      const st = stateRef.current;
      const { w, h } = st;
      const cx = w / 2;
      const cy = h / 2;
      const fl = 480;
      const RAD = globeRadiusRef.current;

      // Entrance progress
      const rawEnt = entranceRef.current;
      const easedEnt = 1 - Math.pow(1 - Math.max(0, Math.min(1, rawEnt)), 3);

      // Post-entrance: enable scroll + mouse rotation
      const active = rawEnt >= 0.95 ? 1 : 0;
      st.rotY += (st.targetRotY - st.rotY) * 0.06 * active;
      st.mouseX += (st.targetMX - st.mouseX) * 0.04;
      st.mouseY += (st.targetMY - st.mouseY) * 0.04;

      const rotY = st.rotY;
      const tiltX = (st.mouseY - 0.5) * 0.5 * active;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);

      const isLight = document.documentElement.classList.contains('light');
      // Light mode renders behind content (see .particle-globe in globals.css), so a mild boost is enough
      const themeBoost = isLight ? 2.0 : 1.0;

      // Globe grows from tiny seed → full size
      const globeScale = 0.06 + easedEnt * 0.94;

      ctx.clearRect(0, 0, w, h);

      // Rotate + project all points
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const sox = p.ox * globeScale;
        const soy = p.oy * globeScale;
        const soz = p.oz * globeScale;

        const rx = sox * cosY - soz * sinY;
        const rz = sox * sinY + soz * cosY;
        const ry = soy * cosX - rz * sinX;
        const rz2 = soy * sinX + rz * cosX;

        const scale = fl / (fl + rz2);
        projected[i * 3] = cx + rx * scale;
        projected[i * 3 + 1] = cy + ry * scale;
        projected[i * 3 + 2] = scale;
      }

      // Draw particles
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const idx = i * 3;
        const sx = projected[idx];
        const sy2 = projected[idx + 1];
        const scale = projected[idx + 2];
        if (scale <= 0.05) continue;

        const scaledRad = RAD * globeScale;
        const nd = p.type === 'ring' ? 0 : (scale * fl - fl + scaledRad) / (2 * scaledRad);
        const dc = Math.max(0.05, Math.min(1, nd));

        if (p.type === 'ring') {
          const alpha = (0.06 + dc * 0.18) * themeBoost * (0.3 + easedEnt * 0.7);
          const r = (0.5 + dc * 0.4) * globeScale;
          ctx.beginPath();
          ctx.arc(sx, sy2, r, 0, Math.PI * 2);
          ctx.fillStyle = getAccent(alpha);
          ctx.fill();
        } else {
          const baseAlpha = (0.06 + dc * 0.24) * themeBoost;
          const alpha = baseAlpha * (0.2 + easedEnt * 0.8);
          const r = (0.7 + dc * 1.0) * globeScale;

          // Glow halo
          ctx.beginPath();
          ctx.arc(sx, sy2, r * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = getAccent(alpha * 0.3);
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(sx, sy2, r, 0, Math.PI * 2);
          ctx.fillStyle = getAccent(Math.min(1, alpha * 2.8));
          ctx.fill();
        }
      }

      // Central ambient glow
      const glowRad = RAD * globeScale;
      const glow = ctx.createRadialGradient(cx, cy, glowRad * 0.15, cx, cy, glowRad * 1.15);
      glow.addColorStop(0, 'transparent');
      glow.addColorStop(0.45, getAccent(0.018 * themeBoost * (0.15 + easedEnt * 0.85)));
      glow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, glowRad * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
    };
  }, [generateGlobe]); // entranceProgress NOT in deps — handled via ref

  return (
    <canvas
      ref={canvasRef}
      className={`particle-globe fixed inset-0 pointer-events-none ${entranceProgress === null ? 'is-settled' : ''}`}
      style={{
        zIndex: 5,
        opacity: visible ? 0.65 : 0,
        willChange: 'transform',
        transition: 'opacity 0.6s ease, filter 0.5s ease',
      }}
    />
  );
}
