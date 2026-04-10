"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const stats = [
  { value: 40, suffix: "%", label: "Average Time Saved" },
  { value: 3, suffix: "x", label: "Faster Decision Making" },
  { value: 97, suffix: "%", label: "Client Satisfaction" },
];

function AnimatedCounter({
  target,
  suffix,
  start,
}: {
  target: number;
  suffix: string;
  start: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let frame = 0;
    const totalFrames = 60;
    const step = () => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (frame < totalFrames) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function Hero() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative bg-white overflow-hidden pt-32 pb-24 px-6 lg:px-10">
      {/* Subtle background gradient blob */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-orange-50 via-white to-white rounded-full opacity-80 translate-x-1/4 -translate-y-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-orange-50 to-white rounded-full opacity-60 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-100 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8420A]" />
            <span className="font-[family-name:var(--font-dm-sans)] text-xs text-[#E8420A] font-semibold tracking-wide uppercase">
              AI for Small &amp; Mid-Sized Businesses
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="font-[family-name:var(--font-montserrat)] text-5xl md:text-6xl lg:text-[72px] text-neutral-900 leading-[1.08] tracking-tight"
            style={{ fontWeight: 800 }}
          >
            AI Optimization
            <br />
            <span className="text-[#E8420A]">Built for</span> Real
            <br />
            Businesses
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="font-[family-name:var(--font-dm-sans)] text-lg text-neutral-500 mt-7 max-w-xl leading-relaxed"
          >
            We translate cutting-edge AI into practical tools your team actually
            uses — automating repetitive work, surfacing insights, and freeing
            you to focus on growth.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.26 }}
            className="flex flex-col sm:flex-row gap-3 mt-10"
          >
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg bg-[#E8420A] text-white font-semibold font-[family-name:var(--font-montserrat)] text-sm hover:bg-[#c93508] transition-colors shadow-md shadow-orange-200"
            >
              Book a Free Consultation
            </a>
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg border border-neutral-200 text-neutral-700 font-semibold font-[family-name:var(--font-montserrat)] text-sm hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
            >
              Explore Services
            </a>
          </motion.div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4 + i * 0.08 }}
              className="bg-white border border-neutral-100 rounded-2xl px-7 py-6 shadow-sm"
            >
              <div className="font-[family-name:var(--font-montserrat)] text-3xl font-extrabold text-neutral-900">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  start={statsVisible}
                />
              </div>
              <div className="font-[family-name:var(--font-dm-sans)] text-neutral-400 mt-1 text-xs font-medium uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
