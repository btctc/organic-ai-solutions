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
  {
    name: "Professional Services",
    examples: "Law firms, Accounting practices",
    accent: "orange",
  },
  {
    name: "Healthcare & Dental",
    examples: "Dental practices, Specialty clinics",
    accent: "cyan",
  },
  {
    name: "Home Services",
    examples: "Foundation repair, HVAC contractors",
    accent: "emerald",
  },
  {
    name: "Transportation & Logistics",
    examples: "Trucking, Last-mile delivery",
    accent: "violet",
  },
  {
    name: "Training & Fitness",
    examples: "Gyms, Studios",
    accent: "amber",
  },
  {
    name: "Hospitality",
    examples: "Hotels, Restaurants",
    accent: "orange",
  },
  {
    name: "Real Estate",
    examples: "Brokerages, Property management",
    accent: "cyan",
  },
  {
    name: "Financial Services",
    examples: "Wealth management, Insurance",
    accent: "emerald",
  },
  {
    name: "Construction & Trades",
    examples: "Builders, Specialty contractors",
    accent: "violet",
  },
  {
    name: "Education & Training",
    examples: "Private schools, Online education",
    accent: "amber",
  },
];

const industryAccentStyles = {
  orange: {
    border: "border-[#E8420A]/20",
    bg: "bg-[#E8420A]/[0.04]",
    dot: "bg-[#E8420A]",
    text: "text-[#E8420A]",
  },
  cyan: {
    border: "border-cyan-400/25",
    bg: "bg-cyan-400/[0.05]",
    dot: "bg-cyan-400",
    text: "text-cyan-700",
  },
  emerald: {
    border: "border-emerald-400/25",
    bg: "bg-emerald-400/[0.05]",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
  },
  violet: {
    border: "border-violet-400/25",
    bg: "bg-violet-400/[0.05]",
    dot: "bg-violet-500",
    text: "text-violet-700",
  },
  amber: {
    border: "border-amber-400/30",
    bg: "bg-amber-400/[0.08]",
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
};

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-white px-6 py-28 md:pt-20 lg:px-10" id="services">
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
          className="mb-10 rounded-[28px] border border-neutral-200 bg-neutral-50 p-4"
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {industries.map((industry) => {
              const accent = industryAccentStyles[industry.accent as keyof typeof industryAccentStyles];

              return (
                <div
                  key={industry.name}
                  className={`rounded-2xl border ${accent.border} ${accent.bg} px-4 py-3`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                    <p className={`font-[family-name:var(--font-montserrat)] text-[11px] font-semibold uppercase tracking-[0.14em] ${accent.text}`}>
                      {industry.name}
                    </p>
                  </div>
                  <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-xs leading-relaxed text-neutral-500">
                    {industry.examples}
                  </p>
                </div>
              );
            })}
          </div>
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
