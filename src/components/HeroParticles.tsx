"use client";

import { useEffect, useMemo, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

const PARTICLE_COUNT = 100;
const CONNECTION_DISTANCE = 14; // in viewBox units (out of 100)
const COLORS = ["#E8420A", "#FF6B2C", "#FF8A4C", "#D63704"];
const VIEWBOX_SIZE = 100;
const CENTER = 50;

function createParticles(): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 20 + Math.random() * 32; // 20-52% from center
    const x = CENTER + Math.cos(angle) * radius;
    const y = CENTER + Math.sin(angle) * radius;

    // Velocity tangent to orbit + small radial component for organic feel
    const tangentSpeed = 0.04 + Math.random() * 0.07;
    const tangentDir = Math.random() < 0.5 ? 1 : -1;
    const vx = -Math.sin(angle) * tangentSpeed * tangentDir + (Math.random() - 0.5) * 0.04;
    const vy = Math.cos(angle) * tangentSpeed * tangentDir + (Math.random() - 0.5) * 0.04;

    particles.push({
      x,
      y,
      vx,
      vy,
      size: 0.4 + Math.random() * 0.7, // SVG units
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }
  return particles;
}

export default function HeroParticles() {
  const svgRef = useRef<SVGSVGElement>(null);
  const particlesRef = useRef<Particle[]>(useMemo(() => createParticles(), []));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const dotsGroup = svg.querySelector<SVGGElement>("#particles-dots");
    const linesGroup = svg.querySelector<SVGGElement>("#particles-lines");
    if (!dotsGroup || !linesGroup) return;

    // Initialize dots once
    const dots: SVGCircleElement[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particlesRef.current[i];
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("r", p.size.toString());
      c.setAttribute("fill", p.color);
      c.setAttribute("opacity", "0.85");
      dotsGroup.appendChild(c);
      dots.push(c);
    }

    // Pre-create line pool (max possible connections = N*(N-1)/2)
    const maxLines = (PARTICLE_COUNT * (PARTICLE_COUNT - 1)) / 2;
    const lines: SVGLineElement[] = [];
    for (let i = 0; i < maxLines; i++) {
      const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
      l.setAttribute("stroke", "#E8420A");
      l.setAttribute("stroke-width", "0.15");
      l.setAttribute("opacity", "0");
      linesGroup.appendChild(l);
      lines.push(l);
    }

    const animate = () => {
      const ps = particlesRef.current;

      // Update positions
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.x += p.vx;
        p.y += p.vy;

        // Soft attraction toward orbit ring (radius ~36 from center)
        const dx = p.x - CENTER;
        const dy = p.y - CENTER;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          const targetRadius = 36;
          const radialDelta = (targetRadius - dist) * 0.0015;
          p.vx += (dx / dist) * radialDelta;
          p.vy += (dy / dist) * radialDelta;
        }

        // Damping to prevent runaway speeds
        p.vx *= 0.995;
        p.vy *= 0.995;

        // Update circle position
        dots[i].setAttribute("cx", p.x.toFixed(2));
        dots[i].setAttribute("cy", p.y.toFixed(2));
      }

      // Update connection lines
      let lineIdx = 0;
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE && lineIdx < maxLines) {
            const line = lines[lineIdx];
            // Opacity fades with distance: closer = stronger
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.55;
            line.setAttribute("x1", ps[i].x.toFixed(2));
            line.setAttribute("y1", ps[i].y.toFixed(2));
            line.setAttribute("x2", ps[j].x.toFixed(2));
            line.setAttribute("y2", ps[j].y.toFixed(2));
            line.setAttribute("opacity", opacity.toFixed(3));
            lineIdx++;
          }
        }
      }

      // Hide unused lines
      for (let i = lineIdx; i < lines.length; i++) {
        if (lines[i].getAttribute("opacity") !== "0") {
          lines[i].setAttribute("opacity", "0");
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
      <g id="particles-lines" />
      <g id="particles-dots" />
    </svg>
  );
}
