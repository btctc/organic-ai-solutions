"use client";

import { useEffect, useMemo, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSize: number;
  baseColor: string;
  // Flash state
  flashStart: number; // timestamp when flash started, 0 if not flashing
  flashDuration: number; // ms
}

const PARTICLE_COUNT = 100;
const COLORS = ["#E8420A", "#FF6B2C", "#FF8A4C", "#D63704"];
const VIEWBOX_SIZE = 100;
const CENTER = 50;

// Flash event timing
const FLASH_INTERVAL_MIN = 900; // ms — minimum time between cluster flashes
const FLASH_INTERVAL_MAX = 2200; // ms — maximum time between cluster flashes
const CLUSTER_RADIUS = 9; // viewBox units — particles within this distance are eligible for the same cluster
const CLUSTER_SIZE_MIN = 3;
const CLUSTER_SIZE_MAX = 5;

function createParticles(): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 20 + Math.random() * 32;
    const x = CENTER + Math.cos(angle) * radius;
    const y = CENTER + Math.sin(angle) * radius;

    const driftSpeed = 0.025 + Math.random() * 0.045;
    const driftAngle = Math.random() * Math.PI * 2;
    const vx = Math.cos(driftAngle) * driftSpeed;
    const vy = Math.sin(driftAngle) * driftSpeed;

    particles.push({
      x,
      y,
      vx,
      vy,
      baseSize: 0.4 + Math.random() * 0.7,
      baseColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      flashStart: 0,
      flashDuration: 0,
    });
  }
  return particles;
}

export default function HeroParticles() {
  const svgRef = useRef<SVGSVGElement>(null);
  const particlesRef = useRef<Particle[]>(useMemo(() => createParticles(), []));
  const rafRef = useRef<number | null>(null);
  const nextFlashAtRef = useRef<number>(0);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const dotsGroup = svg.querySelector<SVGGElement>("#particles-dots");
    if (!dotsGroup) return;

    // Each dot has its own circle and a glow circle behind it (for flash effect)
    const dots: SVGCircleElement[] = [];
    const glows: SVGCircleElement[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particlesRef.current[i];

      // Glow circle (rendered behind, larger, shown only when flashing)
      const glow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      glow.setAttribute("r", (p.baseSize * 4).toFixed(2));
      glow.setAttribute("fill", p.baseColor);
      glow.setAttribute("opacity", "0");
      glow.setAttribute("filter", "blur(0.6px)");
      dotsGroup.appendChild(glow);
      glows.push(glow);

      // Dot circle (always visible)
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("r", p.baseSize.toString());
      c.setAttribute("fill", p.baseColor);
      c.setAttribute("opacity", "0.85");
      dotsGroup.appendChild(c);
      dots.push(c);
    }

    nextFlashAtRef.current = performance.now() + FLASH_INTERVAL_MIN;

    const triggerClusterFlash = (now: number) => {
      const ps = particlesRef.current;

      // Pick a random seed particle
      const seedIdx = Math.floor(Math.random() * ps.length);
      const seed = ps[seedIdx];

      // Find particles within CLUSTER_RADIUS of seed
      const candidates: number[] = [];
      for (let i = 0; i < ps.length; i++) {
        if (i === seedIdx) continue;
        const dx = ps[i].x - seed.x;
        const dy = ps[i].y - seed.y;
        if (dx * dx + dy * dy <= CLUSTER_RADIUS * CLUSTER_RADIUS) {
          candidates.push(i);
        }
      }

      // Decide cluster size (3-5)
      const targetSize = CLUSTER_SIZE_MIN + Math.floor(Math.random() * (CLUSTER_SIZE_MAX - CLUSTER_SIZE_MIN + 1));
      const clusterIndices = [seedIdx];

      // Shuffle candidates and pick the first (targetSize - 1)
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
      }
      for (let i = 0; i < Math.min(targetSize - 1, candidates.length); i++) {
        clusterIndices.push(candidates[i]);
      }

      // Decide flash speed for this cluster (snappy or slow)
      const isSnappy = Math.random() < 0.6; // 60% snappy, 40% slow
      const duration = isSnappy ? 280 + Math.random() * 80 : 540 + Math.random() * 160;

      // Apply flash to all members of cluster
      for (const idx of clusterIndices) {
        ps[idx].flashStart = now;
        ps[idx].flashDuration = duration;
      }
    };

    const animate = (now: number) => {
      const ps = particlesRef.current;

      // Trigger a new cluster flash if it's time
      if (now >= nextFlashAtRef.current) {
        triggerClusterFlash(now);
        nextFlashAtRef.current = now + FLASH_INTERVAL_MIN + Math.random() * (FLASH_INTERVAL_MAX - FLASH_INTERVAL_MIN);
      }

      // Update positions and flash states
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];

        // Movement
        p.x += p.vx;
        p.y += p.vy;


        if (p.x < -5) p.x = 105;
        if (p.x > 105) p.x = -5;
        if (p.y < -5) p.y = 105;
        if (p.y > 105) p.y = -5;
        dots[i].setAttribute("cx", p.x.toFixed(2));
        dots[i].setAttribute("cy", p.y.toFixed(2));
        glows[i].setAttribute("cx", p.x.toFixed(2));
        glows[i].setAttribute("cy", p.y.toFixed(2));

        // Flash state
        if (p.flashStart > 0) {
          const elapsed = now - p.flashStart;
          if (elapsed >= p.flashDuration) {
            // Flash done
            p.flashStart = 0;
            p.flashDuration = 0;
            dots[i].setAttribute("r", p.baseSize.toString());
            dots[i].setAttribute("opacity", "0.85");
            glows[i].setAttribute("opacity", "0");
          } else {
            // Flash curve: ramp up to 50% then ramp down
            const progress = elapsed / p.flashDuration;
            const intensity = progress < 0.5
              ? progress * 2 // 0 to 1 over first half
              : (1 - progress) * 2; // 1 to 0 over second half

            const sizeMult = 1 + intensity * 1.4;
            const dotOpacity = 0.85 + intensity * 0.15;
            const glowOpacity = intensity * 0.65;

            dots[i].setAttribute("r", (p.baseSize * sizeMult).toFixed(2));
            dots[i].setAttribute("opacity", dotOpacity.toFixed(2));
            glows[i].setAttribute("opacity", glowOpacity.toFixed(2));
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g id="particles-dots" />
    </svg>
  );
}
