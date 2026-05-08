"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Discovery Call",
    description:
      "A free 30-minute consultation to understand your business, biggest pain points, and where AI can deliver the fastest wins.",
  },
  {
    number: "02",
    title: "Process Audit & Roadmap",
    description:
      "We map your current workflows, identify automation opportunities, and deliver a prioritized roadmap with projected savings.",
  },
  {
    number: "03",
    title: "Build & Integrate",
    description:
      "We build and integrate AI solutions directly into the tools you already use — no rip-and-replace, no steep learning curves.",
  },
  {
    number: "04",
    title: "Launch & Optimize",
    description:
      "We go live together, train your team, and monitor performance — then iterate, because great AI systems get smarter over time.",
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
          From Idea to Impact in 4 Steps
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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.55 }}
          className="mt-14 flex justify-center"
        >
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-[#E8420A] text-white font-semibold font-[family-name:var(--font-montserrat)] text-sm hover:bg-[#c93508] transition-colors shadow-md shadow-orange-100"
          >
            Start Your Free Discovery Call
          </a>
        </motion.div>
      </div>
    </section>
  );
}
