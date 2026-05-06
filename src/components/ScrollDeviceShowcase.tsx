'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

const conversation: { from: 'customer' | 'agent'; text: string }[] = [
  { from: 'customer', text: 'Hey, do you guys do same-day foundation inspections?' },
  { from: 'agent', text: 'We can usually get an inspector out within 4 hours during business hours. What ZIP are you in?' },
  { from: 'customer', text: '75204' },
  { from: 'agent', text: "Perfect — that's our core service area. I have an opening at 2:30 PM today. Want me to lock it in?" },
  { from: 'customer', text: 'Yes please' },
  { from: 'agent', text: "Booked. You'll get a confirmation text in 30 seconds. Anything else I can help with?" },
];

export default function ScrollDeviceShowcase() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <section id="proof" className="relative">
      {isDesktop ? <DesktopShowcase /> : <MobileShowcase />}
    </section>
  );
}

function DesktopShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const lidRotate = useTransform(scrollYProgress, [0.15, 0.5], [-110, -5]);
  const deviceRotateY = useTransform(scrollYProgress, [0.15, 0.5], [25, 0]);
  const messageProgress = useTransform(scrollYProgress, [0.5, 0.85], [0, conversation.length]);

  return (
    <div ref={ref} className="min-h-[200vh] py-32">
      <div className="sticky top-[20vh] mx-auto max-w-5xl px-6">
        <div className="mb-20 text-center">
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05]">
            What an OAS deployment actually looks like.
          </h2>
          <p className="mt-5 text-lg text-on-surface-muted max-w-2xl mx-auto">
            An AI agent handling a real customer conversation — built, deployed, and yours.
          </p>
        </div>

        <motion.div
          className="relative mx-auto"
          style={{ perspective: '1500px', transformStyle: 'preserve-3d', rotateY: deviceRotateY }}
        >
          <div className="relative mx-auto h-4 w-full max-w-3xl rounded-b-2xl bg-neutral-800 shadow-2xl" />
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-3xl origin-bottom"
            style={{ rotateX: lidRotate, transformStyle: 'preserve-3d' }}
          >
            <div className="aspect-[16/10] rounded-t-xl bg-neutral-900 p-3 shadow-2xl">
              <div className="h-full w-full overflow-hidden rounded-lg bg-surface p-6 md:p-8">
                <div className="mb-4 flex items-center gap-2 border-b border-on-surface/10 pb-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-on-surface">
                    Foundation Pier Masters · Live Agent
                  </span>
                </div>
                <div className="space-y-3">
                  {conversation.map((msg, i) => (
                    <Message key={i} index={i} progress={messageProgress} {...msg} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function Message({
  index,
  progress,
  from,
  text,
}: {
  index: number;
  progress: MotionValue<number>;
  from: 'customer' | 'agent';
  text: string;
}) {
  const opacity = useTransform(progress, [index, index + 0.5], [0, 1]);
  const y = useTransform(progress, [index, index + 0.5], [10, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      className={`flex ${from === 'agent' ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
          from === 'agent'
            ? 'bg-on-surface/5 text-on-surface'
            : 'bg-tertiary text-on-tertiary'
        }`}
      >
        {text}
      </div>
    </motion.div>
  );
}

function MobileShowcase() {
  return (
    <div className="py-24 px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl leading-[1.05]">
            What an OAS deployment actually looks like.
          </h2>
          <p className="mt-4 text-base text-on-surface-muted">
            An AI agent handling a real customer conversation — built, deployed, and yours.
          </p>
        </div>
        <div className="rounded-2xl bg-neutral-900 p-3 shadow-xl">
          <div className="rounded-lg bg-surface p-5">
            <div className="mb-4 flex items-center gap-2 border-b border-on-surface/10 pb-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-on-surface">
                Foundation Pier Masters · Live Agent
              </span>
            </div>
            <div className="space-y-3">
              {conversation.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className={`flex ${msg.from === 'agent' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      msg.from === 'agent'
                        ? 'bg-on-surface/5 text-on-surface'
                        : 'bg-tertiary text-on-tertiary'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
