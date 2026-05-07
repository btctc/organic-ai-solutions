"use client";

import { useEffect, useMemo, useRef } from "react";

interface Particle {
  id: number;
  size: number;
  startX: number;
  startY: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
}

const PARTICLE_COUNT = 50;
const COLORS = ["#E8420A", "#FF6B2C", "#FF8A4C", "#D63704"];

function generateParticles(): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Position particles in a ring around the logo center
    const angle = Math.random() * Math.PI * 2;
    const radius = 25 + Math.random() * 35; // 25-60% from center
    const startX = 50 + Math.cos(angle) * radius;
    const startY = 50 + Math.sin(angle) * radius;

    // Each particle drifts in a slightly different direction
    // Small inward bias creates "pull toward center" effect
    const driftAngle = angle + Math.PI + (Math.random() - 0.5) * 1.5;
    const driftMagnitude = 8 + Math.random() * 18;
    const driftX = Math.cos(driftAngle) * driftMagnitude;
    const driftY = Math.sin(driftAngle) * driftMagnitude;

    particles.push({
      id: i,
      size: 2 + Math.random() * 5, // 2-7px
      startX,
      startY,
      driftX,
      driftY,
      duration: 6 + Math.random() * 10, // 6-16s
      delay: Math.random() * -16, // negative delay so they're already mid-animation on load
      opacity: 0.3 + Math.random() * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }
  return particles;
}

export default function HeroParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useMemo(() => generateParticles(), []);

  useEffect(() => {
    // Inject keyframes once
    if (typeof document === "undefined") return;
    if (document.getElementById("hero-particles-keyframes")) return;

    const style = document.createElement("style");
    style.id = "hero-particles-keyframes";
    style.textContent = `
      @keyframes hero-particle-drift {
        0% {
          transform: translate(0, 0) scale(1);
          opacity: 0;
        }
        15% {
          opacity: var(--particle-opacity, 0.5);
        }
        50% {
          transform: translate(calc(var(--drift-x, 0) * 1px), calc(var(--drift-y, 0) * 1px)) scale(1.15);
          opacity: var(--particle-opacity, 0.5);
        }
        85% {
          opacity: var(--particle-opacity, 0.5);
        }
        100% {
          transform: translate(calc(var(--drift-x, 0) * 2px), calc(var(--drift-y, 0) * 2px)) scale(0.85);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.startX}%`,
            top: `${p.startY}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            ["--drift-x" as string]: p.driftX.toFixed(2),
            ["--drift-y" as string]: p.driftY.toFixed(2),
            ["--particle-opacity" as string]: p.opacity.toFixed(2),
            animation: `hero-particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
}
