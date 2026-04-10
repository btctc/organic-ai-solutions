"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, TrendingDown, Brain } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Buried in Repetitive Tasks",
    description:
      "Your team spends hours each week on manual data entry, scheduling, and reporting — time that should go toward strategy and growth.",
  },
  {
    icon: TrendingDown,
    title: "Decisions Made in the Dark",
    description:
      "Valuable business data sits scattered across spreadsheets, tools, and inboxes. You can't act on insights you can't see.",
  },
  {
    icon: Brain,
    title: "AI Feels Out of Reach",
    description:
      "Enterprise AI tools are built for Fortune 500s. Most SMBs are left behind — paying enterprise prices for features they'll never use.",
  },
];

export default function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-neutral-50 py-28 px-6 lg:px-10" id="problem">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="font-[family-name:var(--font-montserrat)] text-[#E8420A] text-xs font-semibold tracking-widest uppercase mb-4"
        >
          The Problem
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="font-[family-name:var(--font-montserrat)] text-4xl md:text-5xl font-bold text-neutral-900 max-w-2xl leading-tight mb-16"
          style={{ fontWeight: 700 }}
        >
          Most SMBs Are Leaving Money on the Table
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                className="bg-white rounded-2xl p-8 border border-neutral-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-6 group-hover:bg-[#E8420A] transition-colors duration-200">
                  <Icon className="text-[#E8420A] group-hover:text-white transition-colors duration-200" size={22} />
                </div>
                <h3 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-neutral-900 mb-3">
                  {p.title}
                </h3>
                <p className="font-[family-name:var(--font-dm-sans)] text-neutral-500 leading-relaxed text-sm">
                  {p.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
