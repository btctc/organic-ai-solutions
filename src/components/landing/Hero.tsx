"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden pt-32 pb-24 px-6 lg:px-10">
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-orange-50 via-white to-white rounded-full opacity-80 translate-x-1/4 -translate-y-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-orange-50 to-white rounded-full opacity-60 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="max-w-4xl">
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

          <h1 className="font-display text-5xl md:text-7xl leading-[1.05] tracking-tight">
            AI agents your business can actually run on.
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-on-surface-muted">
            Organic AI Solutions is a Dallas-based AI consulting firm that deploys production AI
            agents and AI-native websites for small and mid-sized businesses. Built by operators
            with enterprise-grade experience — not strategy decks.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="/assessment"
              className="inline-flex items-center justify-center rounded-full bg-tertiary px-8 py-4 text-base font-medium text-on-tertiary transition hover:opacity-90"
            >
              Get a free AI Operations Assessment
            </a>
            <a
              href="#proof"
              className="inline-flex items-center justify-center rounded-full border border-on-surface/20 px-8 py-4 text-base font-medium text-on-surface transition hover:bg-on-surface/5"
            >
              See how it works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
