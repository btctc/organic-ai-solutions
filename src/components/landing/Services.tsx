"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, GitBranch, Lightbulb, BarChart3, Map, GraduationCap } from "lucide-react";

const services = [
  {
    icon: Zap,
    title: "AI Automation",
    description:
      "Eliminate repetitive manual work with intelligent automation pipelines that handle data entry, reporting, and scheduling.",
    useCase:
      "A dump truck operator stops re-typing job requests from Gmail into their dispatch board — saves 8 hours a week.",
  },
  {
    icon: GitBranch,
    title: "Workflow Optimization",
    description:
      "Audit your current processes, identify bottlenecks, and redesign them with AI-enhanced workflows that cut costs and scale.",
    useCase:
      "A dental practice cuts no-shows 40% by mapping the booking-to-confirmation flow and adding AI follow-up.",
  },
  {
    icon: Lightbulb,
    title: "AI Consulting",
    description:
      "Our consultants assess your business, identify the highest-ROI AI opportunities, and build a clear roadmap for your goals.",
    useCase:
      "A 12-person home services company gets a 90-day roadmap with three scoped builds, ranked by ROI.",
  },
  {
    icon: BarChart3,
    title: "Data Insights",
    description:
      "Turn raw business data into actionable intelligence with AI-driven analytics that surface trends and guide smarter decisions.",
    useCase:
      "A specialty contractor sees which job types actually make money — margin per crew-hour, not just gross revenue.",
  },
  {
    icon: Map,
    title: "Process Mapping",
    description:
      "Document and visualize your end-to-end operations — creating a shared language for your team and a blueprint for transformation.",
    useCase:
      "A growing restaurant group documents every step from order to delivery — onboarding new managers in days, not months.",
  },
  {
    icon: GraduationCap,
    title: "AI Training",
    description:
      "Hands-on training programs designed for non-technical staff — practical, jargon-free, and immediately applicable.",
    useCase:
      "A real estate brokerage's 30 agents learn to write listings, follow up with leads, and respond to inquiries with AI in two half-day sessions.",
  },
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
              className="font-[family-name:var(--font-montserrat)] text-4xl md:text-5xl font-bold text-neutral-900 max-w-xl leading-tight"
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
            Measurable ROI for businesses with 5 to 500 employees — no bloat, no fluff.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.08 + i * 0.06 }}
                className="group relative rounded-2xl border border-neutral-100 p-7 hover:border-[#E8420A]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-5 group-hover:bg-[#E8420A] transition-colors duration-200">
                  <Icon className="text-[#E8420A] group-hover:text-white transition-colors duration-200" size={19} />
                </div>
                <h3 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-neutral-900 mb-2.5">
                  {svc.title}
                </h3>
                <p className="font-[family-name:var(--font-dm-sans)] text-neutral-500 text-sm leading-relaxed">
                  {svc.description}
                </p>

                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out">
                  <div className="overflow-hidden">
                    <div className="mt-4 pt-4 border-t border-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      <p className="font-[family-name:var(--font-montserrat)] text-[10px] font-semibold tracking-widest uppercase text-[#E8420A] mb-2">
                        For example
                      </p>
                      <p className="font-[family-name:var(--font-dm-sans)] text-neutral-700 text-sm leading-relaxed italic">
                        {svc.useCase}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
