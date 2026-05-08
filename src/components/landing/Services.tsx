"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  {
    eyebrow: "Audit",
    title: "Where most start",
    body: "We look at what's costing you. Score every category 1–100. Tell you the fix in plain language.",
    detail: "Free conversational assessment. Full audit deliverable.",
  },
  {
    eyebrow: "Website Build & Repair",
    title: "Foundation",
    body: "Build new or fix what's broken. Lead capture, fast page weight, AI-ready from day one.",
    detail: "Ships in 30 days. 60+ for complex builds.",
  },
  {
    eyebrow: "Simple AI Solutions",
    title: "First wins",
    body: "Plug AI into the work that already breaks. Single deliverables that prove value before you scale.",
    detail: "Scoped, quoted, deployed.",
  },
  {
    eyebrow: "Custom Agents",
    title: "Where it pays off",
    body: "Production AI agents inside your operation. Built right. Deployed fast. Yours to run.",
    detail: "Built on enterprise agent experience.",
    featured: true,
  },
  {
    eyebrow: "Operational Systems",
    title: "Long-term",
    body: "Multi-agent systems your business runs on. Long-term partnership. Real software, not advisory.",
    detail: "Ongoing build + maintain.",
  },
];

const industries = [
  "Professional Services",
  "Healthcare & Dental",
  "Home Services",
  "Transportation & Logistics",
  "Training & Gyms",
  "Hospitality",
];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-white py-28 px-6 lg:px-10" id="services">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45 }}
              className="font-[family-name:var(--font-montserrat)] text-[#E8420A] text-xs font-semibold tracking-widest uppercase mb-4"
            >
              What We Do
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="font-[family-name:var(--font-montserrat)] text-4xl md:max-w-none md:whitespace-nowrap md:text-4xl xl:text-5xl font-bold text-neutral-900 max-w-xl leading-tight"
              style={{ fontWeight: 700 }}
            >
              Services Built for Your Scale
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.14 }}
            className="font-[family-name:var(--font-dm-sans)] text-neutral-400 max-w-sm leading-relaxed text-sm md:text-right"
          >
            Built for operators running 5-200 person customer-facing teams.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.18 }}
          className="mb-10 rounded-full border border-neutral-200 bg-neutral-50 px-5 py-3"
        >
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center font-[family-name:var(--font-dm-sans)] text-xs font-medium text-neutral-500">
            {industries.map((industry, index) => (
              <span key={industry} className="inline-flex items-center gap-x-3">
                <span>{industry}</span>
                {index < industries.length - 1 && <span className="text-neutral-300">·</span>}
              </span>
            ))}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-6">
          {services.map((svc, i) => (
            <ServiceCard key={svc.title} svc={svc} inView={inView} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ServiceCardProps {
  svc: { eyebrow: string; title: string; body: string; detail: string; featured?: boolean };
  inView: boolean;
  index: number;
}

function ServiceCard({ svc, inView, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: 0.08 + index * 0.06 }}
      className={`group relative rounded-2xl border bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(232,66,10,0.12)] md:min-h-[260px] xl:col-span-2 ${
        svc.featured
          ? "border-[#E8420A]/35 shadow-[0_18px_54px_rgba(232,66,10,0.10)]"
          : "border-neutral-100"
      } ${index >= 3 ? "xl:col-span-3" : ""}`}
    >
      <p className="mb-4 font-[family-name:var(--font-montserrat)] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E8420A]">
        {svc.eyebrow}
      </p>
      <h3 className="mb-3 font-[family-name:var(--font-montserrat)] text-xl font-bold text-neutral-900">
        {svc.title}
      </h3>
      <p className="font-[family-name:var(--font-dm-sans)] text-sm leading-relaxed text-neutral-500">
        {svc.body}
      </p>
      <p className="mt-6 border-t border-neutral-100 pt-4 font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
        {svc.detail}
      </p>
    </motion.div>
  );
}
