'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleY }}
      className="pointer-events-none fixed right-6 top-0 z-40 hidden h-screen w-px origin-top bg-tertiary md:block"
    />
  );
}
