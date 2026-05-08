"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const FLOW_LOOP_SECONDS = 1.8;
const FLOW_SEGMENT_SECONDS = 0.42;

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
  const flowInView = useInView(ref, { margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();
  const flowActive = flowInView && !shouldReduceMotion;

  return (
    <section className="bg-neutral-50 py-28 px-6 lg:px-10" id="how-it-works">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="font-[family-name:var(--font-montserrat)] text-tertiary text-xs font-semibold tracking-widest uppercase mb-4 text-center"
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.08 + i * 0.1 }}
                className="relative h-full rounded-2xl border border-neutral-100 bg-white p-7 shadow-sm"
              >
                {/* Step number */}
                <div className="mb-5 font-[family-name:var(--font-montserrat)] text-xs font-bold uppercase tracking-widest text-tertiary">
                  {step.number}
                </div>
                <h3 className="mb-3 font-[family-name:var(--font-montserrat)] text-base font-bold text-neutral-900">
                  {step.title}
                </h3>
                <p className="font-[family-name:var(--font-dm-sans)] text-sm leading-relaxed text-neutral-500">
                  {step.description}
                </p>

                {/* Bottom orange accent bar */}
                <div className="absolute bottom-0 left-7 right-7 h-0.5 rounded-full bg-gradient-to-r from-[#E8420A]/20 to-transparent" />
              </motion.div>
              {i < steps.length - 1 && <StepFlowConnector active={flowActive} index={i} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepFlowConnector({ active, index }: { active: boolean; index: number }) {
  return (
    <>
      <div className="pointer-events-none absolute left-full top-1/2 z-10 hidden w-6 -translate-y-1/2 lg:block" aria-hidden="true">
        <div className="h-px w-full bg-gradient-to-r from-[#E8420A]/25 via-[#E8420A]/55 to-[#E8420A]/20" />
        {active && <FlowPulse axis="x" index={index} />}
      </div>
      <div className="pointer-events-none absolute left-1/2 top-full z-10 h-6 -translate-x-1/2 md:hidden" aria-hidden="true">
        <div className="mx-auto h-full w-px bg-gradient-to-b from-[#E8420A]/25 via-[#E8420A]/50 to-[#E8420A]/15" />
        {active && <FlowPulse axis="y" index={index} />}
      </div>
    </>
  );
}

function FlowPulse({ axis, index }: { axis: "x" | "y"; index: number }) {
  const animate =
    axis === "x"
      ? { left: ["0%", "100%"], opacity: [0, 1, 1, 0] }
      : { top: ["0%", "100%"], opacity: [0, 1, 1, 0] };

  return (
    <motion.span
      className={`absolute h-2 w-2 rounded-full bg-tertiary motion-reduce:hidden ${
        axis === "x" ? "left-0 top-1/2 -translate-y-1/2" : "left-1/2 top-0 -translate-x-1/2"
      }`}
      animate={animate}
      transition={{
        duration: FLOW_SEGMENT_SECONDS,
        repeat: Infinity,
        repeatDelay: FLOW_LOOP_SECONDS - FLOW_SEGMENT_SECONDS,
        delay: index * 0.45,
        ease: "easeInOut",
      }}
    />
  );
}
