'use client';

import { useEffect, useRef, useState } from 'react';
import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
} from 'framer-motion';

type Industry = 'training' | 'dental' | 'homebuilder';
type Panel = 'findings' | 'taskflow' | 'architecture';
type Accent = 'emerald' | 'cyan' | 'violet' | 'amber';

interface HeadlineKpi {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

interface SecondaryKpi extends HeadlineKpi {
  accent: Accent;
}

interface Finding {
  id: number;
  when: string;
  text: string;
}

interface LiveFindingsData {
  headlineKpi: HeadlineKpi;
  secondaryKpis: SecondaryKpi[];
  findings: Finding[];
}

const industryMeta: Record<Industry, { code: string; label: string }> = {
  training: { code: 'TRN-A4291', label: 'Training Facility' },
  dental: { code: 'DNT-44912', label: 'Dental Practice' },
  homebuilder: { code: 'BLD-7702', label: 'Homebuilder' },
};

const liveFindings: Record<Industry, LiveFindingsData> = {
  training: {
    headlineKpi: { value: 47200, label: 'Recovered this month', prefix: '$' },
    secondaryKpis: [
      { value: 23, label: 'Members reactivated', accent: 'emerald' },
      { value: 412, label: 'Hours saved', accent: 'cyan' },
      { value: 91, label: 'Match accuracy', suffix: '%', accent: 'violet' },
    ],
    findings: [
      { id: 1, when: '2 min ago', text: 'Greg matched to 12-week strength program · 91% confidence' },
      { id: 2, when: '8 min ago', text: 'Trial confirmed for Sara · welcome email sent' },
      { id: 3, when: '14 min ago', text: 'Lapsed member Marcus offered comeback plan · awaiting reply' },
      { id: 4, when: '22 min ago', text: 'Coach assignment auto-balanced across 4 trainers' },
      { id: 5, when: '37 min ago', text: 'Membership tier upgrade suggested for Patricia · deal closed' },
    ],
  },
  dental: {
    headlineKpi: { value: 0, label: '', prefix: '$' },
    secondaryKpis: [],
    findings: [],
  },
  homebuilder: {
    headlineKpi: { value: 0, label: '', prefix: '$' },
    secondaryKpis: [],
    findings: [],
  },
};

const accentClasses: Record<Accent, { border: string; text: string; glow: string }> = {
  emerald: {
    border: 'border-l-emerald-400',
    text: 'text-emerald-300',
    glow: 'shadow-emerald-500/10',
  },
  cyan: {
    border: 'border-l-cyan-400',
    text: 'text-cyan-300',
    glow: 'shadow-cyan-500/10',
  },
  violet: {
    border: 'border-l-violet-400',
    text: 'text-violet-300',
    glow: 'shadow-violet-500/10',
  },
  amber: {
    border: 'border-l-amber-400',
    text: 'text-amber-300',
    glow: 'shadow-amber-500/10',
  },
};

export default function ScrollDeviceShowcase() {
  const [activePanel, setActivePanel] = useState<Panel>('findings');
  const [activeIndustry] = useState<Industry>('training');

  return (
    <section id="proof" className="relative overflow-hidden bg-[#0A0A0F] py-16 text-white md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_85%_55%,rgba(167,139,250,0.12),transparent_28%)]" />
      <div className="relative mx-auto max-w-[1440px] px-6">
        <div className="mb-6 text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-emerald-400">
            Three businesses · Same operating system · Different work
          </p>
          <h2 className="font-display text-3xl leading-[1.05] md:text-5xl">
            Your operation, running itself.
          </h2>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-sm">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.85)]" />
            <span className="text-xs font-medium uppercase tracking-wide text-emerald-400">
              Live · {industryMeta[activeIndustry].code}
            </span>
          </div>

          <div className="w-full overflow-x-auto pb-1 md:w-auto md:pb-0">
            <div className="inline-flex min-w-max rounded-full border border-white/10 bg-white/5 p-1">
              <PanelButton id="findings" active={activePanel} onClick={setActivePanel}>
                Live Findings
              </PanelButton>
              <PanelButton id="taskflow" active={activePanel} onClick={setActivePanel}>
                Task Flow
              </PanelButton>
              <PanelButton id="architecture" active={activePanel} onClick={setActivePanel}>
                Service Architecture
              </PanelButton>
            </div>
          </div>
        </div>

        <div className="relative min-h-[480px]">
          <AnimatePresence mode="wait">
            {activePanel === 'findings' && (
              <FindingsPanel
                key="findings"
                data={liveFindings[activeIndustry]}
                industryLabel={industryMeta[activeIndustry].label}
              />
            )}
            {activePanel === 'taskflow' && (
              <PlaceholderPanel key="taskflow" label="Task Flow — coming in Pass 2" />
            )}
            {activePanel === 'architecture' && (
              <PlaceholderPanel key="architecture" label="Service Architecture — coming in Pass 3" />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function PanelButton({
  id,
  active,
  onClick,
  children,
}: {
  id: Panel;
  active: Panel;
  onClick: (panel: Panel) => void;
  children: React.ReactNode;
}) {
  const isActive = id === active;

  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-emerald-500/10 text-emerald-400'
          : 'text-white/60 hover:bg-white/5 hover:text-white/85'
      }`}
    >
      {children}
    </button>
  );
}

function FindingsPanel({ data, industryLabel }: { data: LiveFindingsData; industryLabel: string }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const panelInView = useInView(panelRef, { margin: '-100px' });

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      viewport={{ once: false, margin: '-100px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mx-auto max-w-[1320px]"
    >
      <motion.div
        animate={
          panelInView
            ? {
                boxShadow: [
                  '0 24px 80px rgba(0,0,0,0.40), 0 0 28px rgba(16,185,129,0.10)',
                  '0 24px 80px rgba(0,0,0,0.40), 0 0 46px rgba(16,185,129,0.20)',
                  '0 24px 80px rgba(0,0,0,0.40), 0 0 28px rgba(16,185,129,0.10)',
                ],
              }
            : { boxShadow: '0 24px 80px rgba(0,0,0,0.40), 0 0 18px rgba(16,185,129,0.08)' }
        }
        transition={{ boxShadow: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
        className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur md:p-5"
      >
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/60">
            {industryLabel}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Live Findings
          </span>
        </div>

        <div className="mb-5 h-0.5 w-full rounded-full bg-white/5">
          <div className="h-0.5 w-0 rounded-full bg-emerald-500/40" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <HeadlineKpiTile kpi={data.headlineKpi} active={panelInView} />

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {data.secondaryKpis.map((kpi, index) => (
                <SecondaryKpiTile key={kpi.label} kpi={kpi} delay={index * 0.2} active={panelInView} />
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 lg:col-span-2 lg:border-l lg:border-t-0 lg:border-white/5 lg:pl-6 lg:pt-0">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#11121A]/80">
              {data.findings.map((finding, index) => (
                <motion.div
                  key={finding.id}
                  initial={{ opacity: 0, x: 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: '-100px' }}
                  transition={{ delay: index * 0.1, duration: 0.36, ease: 'easeOut' }}
                  className="grid gap-2 border-b border-white/10 px-4 py-4 last:border-b-0 md:grid-cols-[120px_1fr] md:px-5 lg:grid-cols-1 lg:px-4"
                >
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {finding.when}
                  </div>
                  <p className="text-sm leading-relaxed text-white/80 md:text-base">{finding.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function HeadlineKpiTile({ kpi, active }: { kpi: HeadlineKpi; active: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-100px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#10131B] px-6 py-6 md:px-10 md:py-7"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-emerald-300/10 to-transparent"
        initial={{ x: '-130%' }}
        animate={{ x: ['-130%', '330%'] }}
        transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 6.6, ease: 'easeInOut' }}
      />
      <div className="relative">
        <div className="flex items-baseline justify-center gap-1 text-center text-6xl leading-none md:text-8xl">
          {kpi.prefix && <span className="font-display text-4xl text-emerald-300 md:text-6xl">{kpi.prefix}</span>}
          <span className="font-display text-white">
            <CountUp value={kpi.value} duration={1.5} active={active} />
          </span>
          {kpi.suffix && <span className="font-display text-4xl text-emerald-300 md:text-6xl">{kpi.suffix}</span>}
        </div>
        <p className="mt-4 text-center text-[0.7rem] font-medium uppercase tracking-[0.22em] text-white/45">
          {kpi.label}
        </p>
      </div>
    </motion.div>
  );
}

function SecondaryKpiTile({ kpi, delay, active }: { kpi: SecondaryKpi; delay: number; active: boolean }) {
  const accent = accentClasses[kpi.accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: '-100px' }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className={`rounded-2xl border border-white/10 border-l-4 ${accent.border} bg-[#11121A] p-5 shadow-xl ${accent.glow}`}
    >
      <div className={`font-display text-4xl leading-none md:text-5xl ${accent.text}`}>
        <CountUp value={kpi.value} duration={1.2} delay={delay} active={active} />
        {kpi.suffix && <span>{kpi.suffix}</span>}
      </div>
      <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-white/45">
        {kpi.label}
      </p>
    </motion.div>
  );
}

function PlaceholderPanel({ label }: { label: string }) {
  const pass = label.includes('Pass 2') ? 'PASS 2' : 'PASS 3';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      viewport={{ once: false, margin: '-100px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mx-auto flex min-h-[400px] max-w-6xl items-center justify-center rounded-[2rem] border border-dashed border-white/15 bg-white/[0.03] p-8"
    >
      <div className="relative w-full text-center">
        <span className="absolute right-0 top-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-emerald-300">
          {pass}
        </span>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/30">{label}</p>
      </div>
    </motion.div>
  );
}

function CountUp({
  value,
  duration,
  active,
  delay = 0,
}: {
  value: number;
  duration: number;
  active: boolean;
  delay?: number;
}) {
  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useMotionValueEvent(motionValue, 'change', (latest) => {
    setDisplayValue(Math.round(latest));
  });

  useEffect(() => {
    if (!active) return;

    motionValue.set(0);
    const controls = animate(motionValue, value, { duration, delay, ease: 'easeOut' });
    return () => controls.stop();
  }, [active, delay, duration, motionValue, value]);

  return (
    <span>
      {displayValue.toLocaleString('en-US')}
    </span>
  );
}
