"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const FLOW_LOOP_SECONDS = 1.8;
const FLOW_SEGMENT_SECONDS = 0.42;

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
    accent: "orange",
  },
  {
    name: "Home Services",
    examples: "Foundation repair, HVAC contractors",
    accent: "slate",
  },
  {
    name: "Transportation & Logistics",
    examples: "Trucking, Last-mile delivery",
    accent: "orange",
  },
  {
    name: "Training & Fitness",
    examples: "Gyms, Studios",
    accent: "orange",
  },
  {
    name: "Hospitality",
    examples: "Hotels, Restaurants",
    accent: "slate",
  },
  {
    name: "Real Estate",
    examples: "Brokerages, Property management",
    accent: "orange",
  },
  {
    name: "Financial Services",
    examples: "Wealth management, Insurance",
    accent: "slate",
  },
  {
    name: "Construction & Trades",
    examples: "Builders, Specialty contractors",
    accent: "orange",
  },
  {
    name: "Education & Training",
    examples: "Private schools, Online education",
    accent: "slate",
  },
];

const industryAccentStyles = {
  orange: {
    border: "border-tertiary/30",
    bg: "bg-tertiary/8",
    dot: "bg-tertiary",
    text: "text-tertiary",
  },
  slate: {
    border: "border-on-surface-muted/25",
    bg: "bg-surface-muted/70",
    dot: "bg-on-surface-muted",
    text: "text-on-surface-muted",
  },
};

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const flowInView = useInView(ref, { margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();
  const flowActive = flowInView && !shouldReduceMotion;

  return (
    <section className="bg-white px-6 py-28 md:pt-20 lg:px-10" id="services">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45 }}
              className="font-[family-name:var(--font-montserrat)] text-tertiary text-xs font-semibold tracking-widest uppercase mb-4"
            >
              What We Do
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="max-w-3xl font-[family-name:var(--font-montserrat)] text-4xl font-bold leading-tight text-neutral-900 md:text-4xl xl:text-5xl"
              style={{ fontWeight: 700 }}
            >
              Built for the industries operators actually run.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.14 }}
            className="font-[family-name:var(--font-dm-sans)] text-neutral-400 max-w-sm leading-relaxed text-sm md:text-right"
          >
            Operator-built AI for 5–200 person customer-facing teams. We start where the work starts.
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
                  <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-xs leading-relaxed text-on-surface-muted">
                    {industry.examples}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
          {services.map((svc, i) => (
            <ServiceCard key={svc.title} svc={svc} inView={inView} flowActive={flowActive} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ServiceCardProps {
  svc: { eyebrow: string; title: string; body: string; detail: string; featured?: boolean };
  inView: boolean;
  flowActive: boolean;
  index: number;
}

function ServiceCard({ svc, inView, flowActive, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: 0.08 + index * 0.06 }}
      className={`group relative rounded-2xl border bg-white p-7 transition-all duration-300 hover:-translate-y-1 md:min-h-[260px] lg:col-span-2 ${
        svc.featured
          ? "border-[#E8420A]/35"
          : "border-neutral-100"
      } ${index >= 3 ? "lg:col-span-3" : ""}`}
    >
      <p className="mb-4 font-[family-name:var(--font-montserrat)] text-[10px] font-semibold uppercase tracking-[0.18em] text-tertiary">
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
      {index < 4 && <ServiceFlowConnector active={flowActive} index={index} />}
    </motion.div>
  );
}

function ServiceFlowConnector({ active, index }: { active: boolean; index: number }) {
  return (
    <>
      {index < 2 && (
        <div className="pointer-events-none absolute left-full top-1/2 z-10 hidden w-5 -translate-y-1/2 lg:block" aria-hidden="true">
          <div className="h-px w-full bg-gradient-to-r from-[#E8420A]/25 via-[#E8420A]/55 to-[#E8420A]/20" />
          {active && <ServiceFlowPulse axis="x" index={index} />}
        </div>
      )}
      {index === 2 && (
        <div className="pointer-events-none absolute left-1/2 top-full z-10 hidden h-5 -translate-x-1/2 lg:block" aria-hidden="true">
          <div className="mx-auto h-full w-px bg-gradient-to-b from-[#E8420A]/25 via-[#E8420A]/50 to-[#E8420A]/15" />
          {active && <ServiceFlowPulse axis="y" index={index} />}
        </div>
      )}
      {index === 3 && (
        <div className="pointer-events-none absolute left-full top-1/2 z-10 hidden w-5 -translate-y-1/2 lg:block" aria-hidden="true">
          <div className="h-px w-full bg-gradient-to-r from-[#E8420A]/25 via-[#E8420A]/55 to-[#E8420A]/20" />
          {active && <ServiceFlowPulse axis="x" index={index} />}
        </div>
      )}
      <div className="pointer-events-none absolute left-1/2 top-full z-10 h-5 -translate-x-1/2 md:hidden" aria-hidden="true">
        <div className="mx-auto h-full w-px bg-gradient-to-b from-[#E8420A]/25 via-[#E8420A]/50 to-[#E8420A]/15" />
        {active && <ServiceFlowPulse axis="y" index={index} />}
      </div>
    </>
  );
}

function ServiceFlowPulse({ axis, index }: { axis: "x" | "y"; index: number }) {
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
        delay: index * 0.36,
        ease: "easeInOut",
      }}
    />
  );
}
