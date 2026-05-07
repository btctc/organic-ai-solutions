'use client';

import { useEffect, useRef, useState } from 'react';
import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionTemplate,
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

type TaskLaneId = 'system' | 'intake' | 'knowledge' | 'decision' | 'action';
type TaskNodeShape = 'rectangle' | 'diamond';

interface TaskLane {
  id: TaskLaneId;
  label: string;
  y: number;
  color: string;
  labelClass: string;
  bg: string;
}

interface TaskNode {
  id: string;
  label: string;
  lane: TaskLaneId;
  x: number;
  y: number;
  width: number;
  tooltip: {
    technical: string;
    plain: string;
  };
  shape?: TaskNodeShape;
}

interface TaskEdge {
  from: string;
  to: string;
}

const industryMeta: Record<Industry, { code: string; label: string }> = {
  training: { code: 'TRN-A4291', label: 'Training Facility' },
  dental: { code: 'DNT-44912', label: 'Dental Practice' },
  homebuilder: { code: 'BLD-7702', label: 'Homebuilder' },
};

const panelGlowByPanel: Record<Panel, { rgb: [number, number, number] }> = {
  findings: { rgb: [16, 185, 129] },
  taskflow: { rgb: [6, 182, 212] },
  architecture: { rgb: [139, 92, 246] },
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

const taskLanes: TaskLane[] = [
  {
    id: 'system',
    label: 'System',
    y: 40,
    color: '#22D3EE',
    labelClass: 'text-cyan-400/60',
    bg: 'rgba(6,182,212,0.10)',
  },
  {
    id: 'intake',
    label: 'Intake',
    y: 118,
    color: '#FBBF24',
    labelClass: 'text-amber-400/60',
    bg: 'rgba(245,158,11,0.10)',
  },
  {
    id: 'knowledge',
    label: 'Knowledge',
    y: 196,
    color: '#34D399',
    labelClass: 'text-emerald-400/60',
    bg: 'rgba(16,185,129,0.10)',
  },
  {
    id: 'decision',
    label: 'Decision',
    y: 282,
    color: '#A78BFA',
    labelClass: 'text-violet-400/60',
    bg: 'rgba(139,92,246,0.12)',
  },
  {
    id: 'action',
    label: 'Action',
    y: 360,
    color: '#34D399',
    labelClass: 'text-emerald-400/60',
    bg: 'rgba(16,185,129,0.10)',
  },
];

const TASK_GRAPH_HEIGHT = 392;

const taskNodes: TaskNode[] = [
  {
    id: 'new-lead',
    label: 'New lead arrived',
    lane: 'system',
    x: 80,
    y: 40,
    width: 150,
    tooltip: {
      technical: 'Real-time signal capture · under 50ms',
      plain: 'Captured Greg the moment he showed interest — in person or online',
    },
  },
  {
    id: 'identity',
    label: 'Identity verified',
    lane: 'system',
    x: 245,
    y: 40,
    width: 150,
    tooltip: {
      technical: 'Identity match · 320ms',
      plain: 'Confirmed Greg is new, not a returning member',
    },
  },
  {
    id: 'plan',
    label: 'Plan drafted',
    lane: 'system',
    x: 620,
    y: 40,
    width: 140,
    tooltip: {
      technical: 'Personalized plan generation',
      plain: "Wrote Greg's full 12-week program with weekly progressions",
    },
  },
  {
    id: 'trial',
    label: 'Trial scheduled · 99% confirmed',
    lane: 'intake',
    x: 515,
    y: 118,
    width: 184,
    tooltip: {
      technical: 'Calendar booking · text confirmation',
      plain: 'Found a trial slot — Greg confirmed by text in 30 seconds',
    },
  },
  {
    id: 'goal',
    label: 'Goal understood',
    lane: 'intake',
    x: 320,
    y: 118,
    width: 150,
    tooltip: {
      technical: 'Goal extraction from conversation',
      plain: "Turned 'lose 20 lbs in 12 weeks' into measurable training targets",
    },
  },
  {
    id: 'similar',
    label: 'Past similar members reviewed',
    lane: 'knowledge',
    x: 455,
    y: 196,
    width: 190,
    tooltip: {
      technical: 'Searched 1,247 past members · 247ms',
      plain: "Reviewed every past member who matched Greg's profile",
    },
  },
  {
    id: 'program',
    label: 'Best-fit program found · 91% match',
    lane: 'knowledge',
    x: 650,
    y: 196,
    width: 204,
    tooltip: {
      technical: 'Ranked top 5 program matches by similarity',
      plain: 'Picked the program members like Greg succeeded on',
    },
  },
  {
    id: 'decision',
    label: 'Basic plan or premium?',
    lane: 'decision',
    x: 650,
    y: 282,
    width: 112,
    shape: 'diamond',
    tooltip: {
      technical: 'Tier decision · 3 inputs · 85% confidence required',
      plain: "Chose the right tier for Greg's goals and budget",
    },
  },
  {
    id: 'welcome',
    label: 'Welcome email sent',
    lane: 'action',
    x: 620,
    y: 360,
    width: 150,
    tooltip: {
      technical: 'Personalized email · authenticated send',
      plain: 'Sent Greg his program, schedule, and first-session prep',
    },
  },
  {
    id: 'session',
    label: 'First session booked',
    lane: 'action',
    x: 790,
    y: 360,
    width: 150,
    tooltip: {
      technical: 'Coach availability matched · slot reserved',
      plain: 'Booked Greg with the right coach at the right time',
    },
  },
  {
    id: 'coach',
    label: 'Coach assigned',
    lane: 'action',
    x: 925,
    y: 360,
    width: 150,
    tooltip: {
      technical: 'Coach match · specialty + workload balanced',
      plain: 'Matched Greg with the strength-specialty coach',
    },
  },
];

const taskEdges: TaskEdge[] = [
  { from: 'new-lead', to: 'identity' },
  { from: 'identity', to: 'trial' },
  { from: 'identity', to: 'goal' },
  { from: 'goal', to: 'similar' },
  { from: 'similar', to: 'program' },
  { from: 'program', to: 'decision' },
  { from: 'decision', to: 'plan' },
  { from: 'plan', to: 'welcome' },
  { from: 'plan', to: 'session' },
  { from: 'plan', to: 'coach' },
];

const quickContactSelectors = [
  '[aria-label="Open quick contact"]',
  '[aria-label="Organic AI Solutions chat assistant"]',
];

function findFixedContainer(element: Element | null) {
  let current = element?.parentElement || null;
  while (current && current !== document.body) {
    if (window.getComputedStyle(current).position === 'fixed') {
      return current;
    }
    current = current.parentElement;
  }
  return element instanceof HTMLElement ? element : null;
}

function setQuickContactHidden(hidden: boolean) {
  if (typeof document === 'undefined') return;

  const containers = new Set<HTMLElement>();
  quickContactSelectors.forEach((selector) => {
    const element = document.querySelector(selector);
    const container = findFixedContainer(element);
    if (container instanceof HTMLElement) {
      containers.add(container);
    }
  });

  containers.forEach((container) => {
    if (hidden) {
      if (!('dashboardOriginalTransition' in container.dataset)) {
        container.dataset.dashboardOriginalTransition = container.style.transition;
        container.dataset.dashboardOriginalOpacity = container.style.opacity;
        container.dataset.dashboardOriginalPointerEvents = container.style.pointerEvents;
        container.dataset.dashboardOriginalTransform = container.style.transform;
      }
      container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      if (!container.matches('[aria-label="Organic AI Solutions chat assistant"]')) {
        container.style.transform = 'translateY(20px)';
      }
    } else if ('dashboardOriginalTransition' in container.dataset) {
      container.style.transition = container.dataset.dashboardOriginalTransition || '';
      container.style.opacity = container.dataset.dashboardOriginalOpacity || '';
      container.style.pointerEvents = container.dataset.dashboardOriginalPointerEvents || '';
      container.style.transform = container.dataset.dashboardOriginalTransform || '';
      delete container.dataset.dashboardOriginalTransition;
      delete container.dataset.dashboardOriginalOpacity;
      delete container.dataset.dashboardOriginalPointerEvents;
      delete container.dataset.dashboardOriginalTransform;
    }
  });
}

export default function ScrollDeviceShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activePanel, setActivePanel] = useState<Panel>('findings');
  const [activeIndustry] = useState<Industry>('training');
  const [tabPulseActive, setTabPulseActive] = useState(false);
  const hasPlayedTabPulseRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let isDashboardVisible = false;
    let pulseTimeout: ReturnType<typeof setTimeout> | null = null;

    const syncQuickContact = () => setQuickContactHidden(isDashboardVisible);
    const mutationObserver = new MutationObserver(syncQuickContact);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        isDashboardVisible = entry.isIntersecting;
        setQuickContactHidden(isDashboardVisible);

        if (isDashboardVisible && !hasPlayedTabPulseRef.current) {
          hasPlayedTabPulseRef.current = true;
          setTabPulseActive(true);
          pulseTimeout = setTimeout(() => setTabPulseActive(false), 6500);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      if (pulseTimeout) clearTimeout(pulseTimeout);
      setQuickContactHidden(false);
    };
  }, []);

  return (
    <section ref={sectionRef} id="proof" className="relative overflow-hidden bg-[#0A0A0F] py-12 text-white md:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_85%_55%,rgba(167,139,250,0.12),transparent_28%)]" />
      <div className="relative mx-auto max-w-[1440px] px-6">
        <div className="mb-4 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-emerald-400">
            Three businesses · Same operating system · Different work
          </p>
          <h2 className="font-display text-3xl leading-[1.05] md:text-5xl">
            Your operation, running itself.
          </h2>
        </div>

        <div className="relative">
          <DashboardPanelShell
            industryLabel={industryMeta[activeIndustry].label}
            industryCode={industryMeta[activeIndustry].code}
            activePanel={activePanel}
            onPanelChange={setActivePanel}
            tabPulseActive={tabPulseActive}
          >
            {(panelInView) => (
              <AnimatePresence mode="wait">
                {activePanel === 'findings' && (
                  <FindingsPanel
                    key="findings"
                    data={liveFindings[activeIndustry]}
                    panelInView={panelInView}
                  />
                )}
                {activePanel === 'taskflow' && (
                  <TaskFlowPanel key="taskflow" />
                )}
                {activePanel === 'architecture' && (
                  <PlaceholderPanel key="architecture" label="Service Architecture — coming in Pass 3" />
                )}
              </AnimatePresence>
            )}
          </DashboardPanelShell>
        </div>
      </div>
    </section>
  );
}

function PanelTabs({
  activePanel,
  onPanelChange,
  tabPulseActive,
}: {
  activePanel: Panel;
  onPanelChange: (panel: Panel) => void;
  tabPulseActive: boolean;
}) {
  return (
    <div className="inline-flex min-w-max rounded-full border border-white/10 bg-white/5 p-1">
      <PanelButton id="findings" active={activePanel} onClick={onPanelChange} pulse={tabPulseActive}>
        Live Findings
      </PanelButton>
      <span className="mx-1 self-center rounded-full bg-white/25 p-0.5" aria-hidden="true" />
      <PanelButton id="taskflow" active={activePanel} onClick={onPanelChange} pulse={tabPulseActive}>
        Task Flow
      </PanelButton>
      <span className="mx-1 self-center rounded-full bg-white/25 p-0.5" aria-hidden="true" />
      <PanelButton id="architecture" active={activePanel} onClick={onPanelChange} pulse={tabPulseActive}>
        Service Architecture
      </PanelButton>
    </div>
  );
}

function PanelButton({
  id,
  active,
  onClick,
  pulse,
  children,
}: {
  id: Panel;
  active: Panel;
  onClick: (panel: Panel) => void;
  pulse: boolean;
  children: React.ReactNode;
}) {
  const isActive = id === active;
  const [r, g, b] = panelGlowByPanel[id].rgb;
  const tabRgb = `${r}, ${g}, ${b}`;

  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`relative cursor-pointer whitespace-nowrap rounded-full border-b px-4 py-2 text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'border-transparent'
          : 'border-white/15 text-white/60 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/5 hover:text-white/90'
      }`}
      style={
        isActive
          ? {
              color: `rgb(${tabRgb})`,
              backgroundColor: `rgba(${tabRgb}, 0.16)`,
              borderColor: `rgba(${tabRgb}, 0.62)`,
              boxShadow: `0 0 0 1px rgba(${tabRgb}, 0.22), 0 8px 26px rgba(${tabRgb}, 0.24), inset 0 0 18px rgba(${tabRgb}, 0.10)`,
            }
          : undefined
      }
    >
      <AnimatePresence>
        {pulse && isActive && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border"
            style={{
              borderColor: `rgba(${tabRgb}, 0.48)`,
              boxShadow: `0 0 22px rgba(${tabRgb}, 0.24)`,
            }}
            initial={{ opacity: 0.42, scale: 1 }}
            animate={{ opacity: 0, scale: 1.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, repeat: 2, repeatDelay: 0.2, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
      <span className="relative z-10">{children}</span>
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute inset-x-3 bottom-1 h-px rounded-full"
          style={{
            backgroundColor: `rgb(${tabRgb})`,
            boxShadow: `0 0 14px rgba(${tabRgb}, 0.62)`,
          }}
        />
      )}
    </button>
  );
}

function DashboardPanelShell({
  industryLabel,
  industryCode,
  activePanel,
  onPanelChange,
  tabPulseActive,
  children,
}: {
  industryLabel: string;
  industryCode: string;
  activePanel: Panel;
  onPanelChange: (panel: Panel) => void;
  tabPulseActive: boolean;
  children: (panelInView: boolean) => React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const panelInView = useInView(panelRef, { margin: '-100px' });
  const glow = panelGlowByPanel[activePanel];
  const glowR = useMotionValue(glow.rgb[0]);
  const glowG = useMotionValue(glow.rgb[1]);
  const glowB = useMotionValue(glow.rgb[2]);
  const glowOpacity = useMotionValue(0.1);
  const glowSize = useMotionValue(40);
  const panelShadow = useMotionTemplate`0 24px 80px rgba(0,0,0,0.40), 0 0 ${glowSize}px 0 rgba(${glowR}, ${glowG}, ${glowB}, ${glowOpacity})`;

  useEffect(() => {
    const controls = [
      animate(glowR, glow.rgb[0], { duration: 0.4, ease: 'easeInOut' }),
      animate(glowG, glow.rgb[1], { duration: 0.4, ease: 'easeInOut' }),
      animate(glowB, glow.rgb[2], { duration: 0.4, ease: 'easeInOut' }),
    ];
    return () => controls.forEach((control) => control.stop());
  }, [activePanel, glow.rgb, glowB, glowG, glowR]);

  useEffect(() => {
    if (!panelInView) {
      const controls = [
        animate(glowOpacity, 0.1, { duration: 0.4, ease: 'easeInOut' }),
        animate(glowSize, 40, { duration: 0.4, ease: 'easeInOut' }),
      ];
      return () => controls.forEach((control) => control.stop());
    }

    const controls = [
      animate(glowOpacity, [0.1, 0.2, 0.1], { duration: 4, repeat: Infinity, ease: 'easeInOut' }),
      animate(glowSize, [40, 60, 40], { duration: 4, repeat: Infinity, ease: 'easeInOut' }),
    ];
    return () => controls.forEach((control) => control.stop());
  }, [glowOpacity, glowSize, panelInView]);

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      viewport={{ once: false, margin: '-100px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative mx-auto max-w-[1320px]"
    >
      <motion.div
        style={{ boxShadow: panelShadow }}
        className="relative flex min-h-[640px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur md:p-5"
      >
        <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-emerald-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.85)]" />
              Live · {industryCode}
            </span>
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/60">
              {industryLabel}
            </span>
          </div>

          <div className="w-full overflow-x-auto pb-1 lg:w-auto lg:pb-0">
            <PanelTabs activePanel={activePanel} onPanelChange={onPanelChange} tabPulseActive={tabPulseActive} />
          </div>
        </div>

        <div className="mb-4 h-0.5 w-full rounded-full bg-white/5">
          <div className="h-0.5 w-0 rounded-full bg-emerald-500/40" />
        </div>

        <div className="min-h-0 flex-1">
          {children(panelInView)}
        </div>
      </motion.div>
    </motion.div>
  );
}

function FindingsPanel({
  data,
  panelInView,
}: {
  data: LiveFindingsData;
  panelInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="h-full"
    >
      <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)]">
        <div>
          <HeadlineKpiTile kpi={data.headlineKpi} active={panelInView} />

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {data.secondaryKpis.map((kpi, index) => (
              <SecondaryKpiTile key={kpi.label} kpi={kpi} delay={index * 0.2} active={panelInView} />
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:border-white/5 lg:pl-6 lg:pt-0">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            Recent
          </p>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#11121A]/80 lg:max-h-[420px]">
            {data.findings.map((finding, index) => (
              <motion.div
                key={finding.id}
                initial={{ opacity: 0, x: 28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: '-100px' }}
                transition={{ delay: index * 0.1, duration: 0.36, ease: 'easeOut' }}
                className={`grid gap-2 border-b border-white/10 px-4 py-4 last:border-b-0 md:grid-cols-[120px_1fr] md:px-5 lg:grid-cols-1 lg:px-4 lg:py-3 ${
                  index >= 4 ? 'lg:hidden' : ''
                }`}
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
  );
}

function TaskFlowPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="flex h-full flex-col"
    >
      <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-3 shadow-[0_0_30px_rgba(6,182,212,0.12)]">
        <p className="flex items-center gap-3 text-sm font-medium leading-relaxed text-white/90 md:text-base lg:whitespace-nowrap">
          <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.85)]" aria-hidden="true" />
          <span>New member walked in — Greg, wants to lose 20 lbs in 12 weeks</span>
        </p>
      </div>

      <div className="hidden lg:block">
        <TaskFlowGraph />
      </div>

      <MobileTaskFlowFallback />
    </motion.div>
  );
}

function TaskFlowGraph() {
  return (
    <div
      className="relative h-[392px] overflow-hidden rounded-3xl border border-white/10 bg-[#0E1118]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 52% 50%, rgba(16,185,129,0.10), transparent 34%), linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 44px 44px, 44px 44px',
      }}
    >
      <div className="absolute inset-y-0 left-0 z-20 w-[104px] border-r border-white/10 bg-[#0E1118]/70 backdrop-blur-sm">
        {taskLanes.map((lane) => (
          <div
            key={lane.id}
            className={`absolute left-4 -translate-y-1/2 text-xs font-medium uppercase tracking-[0.2em] ${lane.labelClass}`}
            style={{ top: `${(lane.y / TASK_GRAPH_HEIGHT) * 100}%` }}
          >
            {lane.label}
          </div>
        ))}
      </div>

      <div className="absolute inset-y-0 left-[104px] right-0 overflow-hidden">
        {taskLanes.map((lane) => (
          <div
            key={lane.id}
            className="absolute left-0 right-0 h-[50px] -translate-y-1/2 border-y border-white/[0.03]"
            style={{ top: `${(lane.y / TASK_GRAPH_HEIGHT) * 100}%`, backgroundColor: lane.bg }}
          />
        ))}

        <svg
          className="absolute inset-0 z-0 h-full w-full"
          viewBox={`0 0 1000 ${TASK_GRAPH_HEIGHT}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <filter id="task-pulse-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {taskEdges.map((edge, index) => {
            const source = getTaskNode(edge.from);
            const lane = getTaskLane(source.lane);
            const edgeId = `task-edge-${index}`;

            return (
              <g key={edgeId}>
                <motion.path
                  id={edgeId}
                  d={buildTaskEdgePath(edge)}
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.22 + index * 0.08, duration: 0.52, ease: 'easeOut' }}
                />
                <circle r="4" fill={lane.color} opacity="0" filter="url(#task-pulse-glow)">
                  <animate
                    attributeName="opacity"
                    values="0;0.95;0.95;0"
                    keyTimes="0;0.12;0.86;1"
                    dur={`${2.2 + (index % 4) * 0.18}s`}
                    begin={`${1.1 + index * 0.16}s`}
                    repeatCount="indefinite"
                  />
                  <animateMotion
                    dur={`${2.2 + (index % 4) * 0.18}s`}
                    begin={`${1.1 + index * 0.16}s`}
                    repeatCount="indefinite"
                  >
                    <mpath href={`#${edgeId}`} />
                  </animateMotion>
                </circle>
              </g>
            );
          })}
        </svg>

        {taskNodes.map((node, index) => (
          <TaskNodeCard key={node.id} node={node} index={index} />
        ))}
      </div>
    </div>
  );
}

function MobileTaskFlowFallback() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#10131B]/90 p-5 lg:hidden">
      <p className="mb-5 text-sm leading-relaxed text-white/65">
        Best viewed on desktop. Tap any step below to reveal the technical layer.
      </p>
      <div className="space-y-4">
        {taskLanes.map((lane) => (
          <div key={lane.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <span className={`text-xs font-medium uppercase tracking-[0.2em] ${lane.labelClass}`}>
              {lane.label}
            </span>
            <div className="mt-3 grid gap-2">
              {taskNodes
                .filter((node) => node.lane === lane.id)
                .map((node) => (
                  <MobileTaskNodeChip key={node.id} node={node} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileTaskNodeChip({ node }: { node: TaskNode }) {
  const lane = getTaskLane(node.lane);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tooltipOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setTooltipOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [tooltipOpen]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setTooltipOpen((open) => !open);
        }}
        className="w-full rounded-lg border bg-[#11121A]/95 px-3 py-1.5 text-left text-xs font-medium leading-snug text-white/85"
        style={{ borderColor: `${lane.color}66`, boxShadow: `0 0 14px ${lane.color}18` }}
      >
        {node.label}
      </button>
      <AnimatePresence>
        {tooltipOpen && <TaskNodeTooltip node={node} lane={lane} placement="bottom" />}
      </AnimatePresence>
    </div>
  );
}

function TaskNodeCard({ node, index }: { node: TaskNode; index: number }) {
  const lane = getTaskLane(node.lane);
  const isDiamond = node.shape === 'diamond';
  const height = isDiamond ? 92 : 40;
  const width = isDiamond ? 92 : node.width;
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!tooltipOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setTooltipOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [tooltipOpen]);

  useEffect(() => {
    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const showTooltip = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    showTimerRef.current = setTimeout(() => setTooltipOpen(true), 200);
  };

  const hideTooltip = () => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    hideTimerRef.current = setTimeout(() => setTooltipOpen(false), 100);
  };

  return (
    <motion.div
      ref={wrapperRef}
      className={`absolute hover:z-40 ${isDiamond ? 'z-[9]' : 'z-10'}`}
      style={{
        left: `calc(${node.x / 10}% - ${width / 2}px)`,
        top: `calc(${(node.y / TASK_GRAPH_HEIGHT) * 100}% - ${height / 2}px)`,
        width,
        height,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.26, ease: 'easeOut' }}
      whileHover={{ scale: 1.05 }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onPointerDown={(event) => {
        if (event.pointerType !== 'mouse') {
          event.preventDefault();
          event.stopPropagation();
          setTooltipOpen((open) => !open);
        }
      }}
    >
      {isDiamond ? (
        <div
          className="flex h-full w-full rotate-45 items-center justify-center rounded-xl border bg-[#11121A]/95"
          style={{
            borderColor: `${lane.color}66`,
            boxShadow: `0 0 20px ${lane.color}24`,
          }}
        >
          <span className="-rotate-45 px-2 text-center text-xs font-medium leading-snug text-white/90">
            {node.label}
          </span>
        </div>
      ) : (
        <div
          className="flex min-h-10 w-full items-center justify-center rounded-lg border bg-[#11121A]/95 px-3 py-1.5 text-center text-xs font-medium leading-snug text-white/90"
          style={{
            borderColor: `${lane.color}66`,
            boxShadow: `0 0 18px ${lane.color}20`,
          }}
        >
          {node.label}
        </div>
      )}
      <AnimatePresence>
        {tooltipOpen && (
          <TaskNodeTooltip
            node={node}
            lane={lane}
            placement={node.y < 90 ? 'bottom' : 'top'}
            align={node.x > 760 ? 'right' : node.x < 180 ? 'left' : 'center'}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TaskNodeTooltip({
  node,
  lane,
  placement,
  align = 'center',
}: {
  node: TaskNode;
  lane: TaskLane;
  placement: 'top' | 'bottom';
  align?: 'left' | 'center' | 'right';
}) {
  const placementClass = placement === 'bottom' ? 'top-full mt-3' : 'bottom-full mb-3';
  const alignClass =
    align === 'left'
      ? 'left-0'
      : align === 'right'
        ? 'right-0'
        : 'left-1/2 -translate-x-1/2';

  return (
    <motion.div
      className={`pointer-events-none absolute ${placementClass} ${alignClass} z-50 w-[280px] max-w-[280px] rounded-lg border bg-[#0B0D13]/95 p-3 text-left shadow-2xl backdrop-blur-md`}
      style={{ borderColor: `${lane.color}99`, boxShadow: `0 18px 42px rgba(0,0,0,0.42), 0 0 22px ${lane.color}2B` }}
      initial={{ opacity: 0, scale: 0.96, y: placement === 'bottom' ? -4 : 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: placement === 'bottom' ? -4 : 4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <p className="font-mono text-[11px] leading-snug text-white/60">{node.tooltip.technical}</p>
      <p className="mt-3 text-[13px] leading-snug text-white/90">{node.tooltip.plain}</p>
    </motion.div>
  );
}

function getTaskNode(id: string): TaskNode {
  const node = taskNodes.find((item) => item.id === id);
  if (!node) throw new Error(`Missing task node: ${id}`);
  return node;
}

function getTaskLane(id: TaskLaneId): TaskLane {
  return taskLanes.find((lane) => lane.id === id) || taskLanes[0];
}

function buildTaskEdgePath(edge: TaskEdge) {
  const source = getTaskNode(edge.from);
  const target = getTaskNode(edge.to);
  const sourceOffset = source.shape === 'diamond' ? 46 : Math.min(source.width / 2, 92);
  const targetOffset = target.shape === 'diamond' ? 46 : Math.min(target.width / 2, 92);
  let startX = source.x + sourceOffset;
  let endX = target.x - targetOffset;
  let startY = source.y;
  let endY = target.y;

  if (endX <= startX) {
    startX = source.x;
    endX = target.x;
    startY = source.y + (target.y > source.y ? 20 : -20);
    endY = target.y + (target.y > source.y ? -20 : 20);
  }

  const distance = Math.abs(endX - startX);
  const curve = Math.max(52, distance * 0.42);

  return `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`;
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

function PlaceholderPanel({
  label,
}: {
  label: string;
}) {
  const pass = label.includes('Pass 2') ? 'PASS 2' : 'PASS 3';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      viewport={{ once: false, margin: '-100px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex h-full min-h-[400px] items-center justify-center rounded-[2rem] border border-dashed border-white/15 bg-white/[0.03] p-8"
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
