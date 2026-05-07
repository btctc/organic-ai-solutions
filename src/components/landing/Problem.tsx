"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Talk to us, or talk to our agent",
    description:
      "Book a 30-minute call to scope the problem. Or, if you're short on time, use our custom-built assessment agent — built by us, runs 24/7.",
  },
  {
    number: "02",
    title: "We build",
    description:
      "Working software in your environment, on your data, integrated into the systems you already use.",
  },
  {
    number: "03",
    title: "It runs alongside you",
    description:
      "Your agents handle the work that gets lost, misplaced, or never happens. You stay running the business.",
  },
];

const stack = ["Anthropic", "OpenAI", "Supabase", "Vercel", "Inngest", "Resend"];

function rise(inView: boolean, delay = 0, y = 16) {
  return {
    initial: { opacity: 0, y },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.45, delay },
  };
}

export default function Problem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-neutral-50 py-28 px-6 lg:px-10 scroll-mt-24" id="problem">
      <div className="max-w-7xl mx-auto" ref={ref}>
        <div className="max-w-5xl">
          <motion.p
            {...rise(inView)}
            className="font-[family-name:var(--font-montserrat)] text-[#E8420A] text-xs font-semibold tracking-widest uppercase mb-4"
          >
            How it works
          </motion.p>
          <motion.h2
            {...rise(inView, 0.08)}
            className="font-[family-name:var(--font-montserrat)] text-4xl md:text-5xl font-bold text-neutral-900 leading-tight xl:whitespace-nowrap"
            style={{ fontWeight: 700 }}
          >
            Three steps to working software
          </motion.h2>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-[#E8420A]/30 via-neutral-300 to-[#E8420A]/20 md:left-0 md:right-0 md:top-8 md:bottom-auto md:h-px md:w-auto md:bg-gradient-to-r" />
          <div className="relative grid gap-12 md:grid-cols-3 md:gap-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                {...rise(inView, 0.12 + i * 0.1, 28)}
                className="relative flex gap-5 md:block"
              >
                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#E8420A]/25 bg-white text-[#E8420A] shadow-sm shadow-orange-100 font-[family-name:var(--font-montserrat)] text-xs font-bold tracking-widest md:h-16 md:w-16">
                  {step.number}
                </div>
                <div className="pt-1 md:pt-8">
                  <h3 className="font-[family-name:var(--font-montserrat)] text-xl font-bold text-neutral-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="font-[family-name:var(--font-dm-sans)] text-neutral-500 leading-relaxed text-base max-w-sm">
                    {step.description}
                  </p>
                  {step.number === "01" && (
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href="#contact"
                        className="inline-flex items-center justify-center rounded-full bg-[#E8420A] px-5 py-2.5 font-[family-name:var(--font-montserrat)] text-sm font-semibold text-white transition-all hover:bg-[#c93508] hover:-translate-y-0.5"
                      >
                        Book a call →
                      </Link>
                      <Link
                        href="/assessment"
                        className="inline-flex items-center justify-center rounded-full border border-[#E8420A]/30 px-5 py-2.5 font-[family-name:var(--font-montserrat)] text-sm font-semibold text-[#E8420A] transition-all hover:border-[#E8420A]/60 hover:bg-orange-50 hover:-translate-y-0.5"
                      >
                        Try the agent →
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          {...rise(inView, 0.48)}
          className="mt-16 text-center font-[family-name:var(--font-dm-sans)] text-neutral-600 text-base md:text-lg leading-relaxed"
        >
          Once scoped, working software in 30 days. 60+ for complex builds.
        </motion.p>

        <motion.div
          {...rise(inView, 0.58, 18)}
          className="mt-12 border-t border-neutral-200 pt-10 text-center"
        >
          <p className="font-[family-name:var(--font-montserrat)] text-neutral-400 text-xs font-semibold tracking-widest uppercase mb-5">
            Built on
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            {stack.map((name, i) => (
              <span key={name} className="inline-flex items-center gap-x-4">
                <span className="font-[family-name:var(--font-montserrat)] text-sm md:text-base font-semibold text-neutral-500">
                  {name}
                </span>
                {i < stack.length - 1 && <span className="text-neutral-300">·</span>}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
