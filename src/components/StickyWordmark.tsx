'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export default function StickyWordmark() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [700, 900], [0, 1]);
  const y = useTransform(scrollY, [700, 900], [-10, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none fixed top-6 left-1/2 z-40 -translate-x-1/2"
    >
      <span className="font-display text-sm tracking-wide uppercase text-on-surface">
        Organic AI Solutions
      </span>
    </motion.div>
  );
}
