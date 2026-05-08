"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Free Assessment",
    description:
      "Conversational AI sizes the work. 5–10 minutes. No prep. We come back with your score and the fix order.",
  },
  {
    number: "02",
    title: "Audit & Scope",
    description:
      "We score every category 1–100. Identify the highest-impact AI work. Quote the build before you commit.",
  },
  {
    number: "03",
    title: "Build & Deploy",
    description:
      "We build inside the tools you already use. Ships in 30 days. 60+ for complex builds. No rip-out, no retraining.",
  },
  {
    number: "04",
    title: "Run & Iterate",
    description:
      "Software goes live. We watch metrics, tune what's working, expand when you're ready. Real software, not a one-time deliverable.",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-neutral-50 py-28 px-6 lg:px-10" id="how-it-works">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="font-[family-name:var(--font-montserrat)] text-[#E8420A] text-xs font-semibold tracking-widest uppercase mb-4 text-center"
        >
          Our Process
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="font-[family-name:var(--font-montserrat)] text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 leading-tight mb-16 text-center md:whitespace-nowrap"
          style={{ fontWeight: 700 }}
        >
          From Audit to Live AI in 4 Steps
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.08 + i * 0.1 }}
              className="relative bg-white rounded-2xl p-7 border border-neutral-100 shadow-sm"
            >
              {/* Step number */}
              <div className="font-[family-name:var(--font-montserrat)] text-[#E8420A] text-xs font-bold tracking-widest uppercase mb-5">
                {step.number}
              </div>
              <h3 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-neutral-900 mb-3">
                {step.title}
              </h3>
              <p className="font-[family-name:var(--font-dm-sans)] text-neutral-500 text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Bottom orange accent bar */}
              <div className="absolute bottom-0 left-7 right-7 h-0.5 bg-gradient-to-r from-[#E8420A]/20 to-transparent rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
