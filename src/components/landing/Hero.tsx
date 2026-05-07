"use client";

import loadClientOnly from "next/dynamic";
import { motion } from "framer-motion";
import { useIsDesktop } from "@/hooks/useIsDesktop";

const Logo3D = loadClientOnly(() => import("@/components/Logo3D"), { ssr: false });

export default function Hero() {
  const isDesktop = useIsDesktop();

  return (
    <section className="relative bg-white overflow-hidden pt-32 pb-24 px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-orange-50 via-white to-white rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-orange-50 to-white rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-100 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8420A]" />
              <span className="font-[family-name:var(--font-dm-sans)] text-xs text-[#E8420A] font-semibold tracking-wide uppercase">
                AI for Small &amp; Mid-Sized Businesses
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="font-display text-5xl md:text-7xl leading-[1.05] tracking-tight"
            >
              AI agents your business can actually run on.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.22 }}
              className="mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-on-surface-muted"
            >
              Organic AI Solutions is a Dallas-based AI consulting firm that deploys production AI
              agents and AI-native websites for small and mid-sized businesses. Built by operators
              with enterprise-grade experience — not strategy decks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.34 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <a
                href="/assessment"
                className="group relative inline-flex items-center justify-center rounded-full bg-tertiary px-8 py-4 text-base font-medium text-on-tertiary transition-all hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
              >
                <span>Get a free AI Operations Assessment</span>
                <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-full border border-on-surface/30 px-8 py-4 text-base font-medium text-on-surface transition-all hover:bg-on-surface/5 hover:border-on-surface/50"
              >
                See how it works
              </a>
            </motion.div>
          </div>

          {isDesktop && (
            <div className="relative hidden lg:block aspect-square min-h-[420px] max-h-[560px]">
              <Logo3D />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
