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
import { Brain, FileText, Link2, Lock, Mail, MessageSquare, Phone, Search } from 'lucide-react';

type Industry = 'training' | 'dental' | 'homebuilder';
type Panel = 'findings' | 'taskflow' | 'architecture';
type Accent = 'emerald' | 'cyan' | 'violet' | 'amber';
type TooltipPlacement = 'top' | 'bottom';
type TooltipAlign = 'left' | 'center' | 'right' | 'outside-left' | 'outside-right';

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

interface TaskFlowData {
  subhead: string;
  nodes: TaskNode[];
  edges: TaskEdge[];
}

interface ArchitectureLayer {
  name: string;
  plain: string;
  technical: string;
}

type ArchitectureIconHint = 'form' | 'sms' | 'phone' | 'email' | 'claude' | 'search' | 'link' | 'lock';

interface ArchitectureActivityEntry {
  timestamp: string;
  id: string;
  description: string;
  source: string;
  metrics: string;
  iconHint: ArchitectureIconHint;
}

interface IndustryData {
  id: Industry;
  code: string;
  label: string;
  liveFindings: LiveFindingsData;
  taskFlow: TaskFlowData;
  serviceArchitecture: ArchitectureLayer[];
}

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
    headlineKpi: { value: 38900, label: 'Recovered this month', prefix: '$' },
    secondaryKpis: [
      { value: 18, label: 'Patients reactivated', accent: 'emerald' },
      { value: 287, label: 'Hours saved', accent: 'cyan' },
      { value: 94, label: 'Triage accuracy', suffix: '%', accent: 'violet' },
    ],
    findings: [
      { id: 1, when: '2 min ago', text: "Dr. Chen's 3pm slot rebooked · 94% confidence" },
      { id: 2, when: '9 min ago', text: 'Patient reminder sent for Friday cleaning' },
      { id: 3, when: '16 min ago', text: 'Lapsed patient outreach drafted · awaiting reply' },
      { id: 4, when: '24 min ago', text: 'Insurance pre-auth completed for treatment plan' },
      { id: 5, when: '41 min ago', text: 'Treatment plan accepted · deposit booked' },
    ],
  },
  homebuilder: {
    headlineKpi: { value: 112400, label: 'Recovered this month', prefix: '$' },
    secondaryKpis: [
      { value: 9, label: 'Projects re-quoted', accent: 'emerald' },
      { value: 198, label: 'Hours saved', accent: 'cyan' },
      { value: 88, label: 'Lead qualification', suffix: '%', accent: 'violet' },
    ],
    findings: [
      { id: 1, when: '3 min ago', text: 'New lead matched to deck specialist crew' },
      { id: 2, when: '11 min ago', text: 'Quote sent for kitchen remodel · 91% match' },
      { id: 3, when: '18 min ago', text: 'Supplier delay flagged · timeline adjusted' },
      { id: 4, when: '27 min ago', text: 'Crew assignment auto-balanced across 3 jobs' },
      { id: 5, when: '38 min ago', text: 'Project milestone confirmed · invoice queued' },
    ],
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

const trainingTaskNodes: TaskNode[] = [
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

const dentalTaskNodes: TaskNode[] = [
  {
    id: 'new-lead',
    label: 'New patient call',
    lane: 'system',
    x: 80,
    y: 40,
    width: 150,
    tooltip: {
      technical: 'Real-time signal capture · under 50ms',
      plain: "Captured Sarah's call the moment she dialed in",
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
      plain: 'Confirmed Sarah is new, not an existing patient',
    },
  },
  {
    id: 'plan',
    label: 'Treatment plan drafted',
    lane: 'system',
    x: 620,
    y: 40,
    width: 170,
    tooltip: {
      technical: 'Personalized plan generation',
      plain: "Wrote Sarah's full treatment plan with cost estimates",
    },
  },
  {
    id: 'trial',
    label: 'Cleaning scheduled · 97% confirmed',
    lane: 'intake',
    x: 515,
    y: 118,
    width: 198,
    tooltip: {
      technical: 'Calendar booking · text confirmation',
      plain: 'Found a cleaning slot — Sarah confirmed by text in 45 seconds',
    },
  },
  {
    id: 'goal',
    label: 'Symptoms understood',
    lane: 'intake',
    x: 320,
    y: 118,
    width: 160,
    tooltip: {
      technical: 'Symptom extraction from conversation',
      plain: "Turned 'tooth pain on left' into specific diagnostic markers",
    },
  },
  {
    id: 'similar',
    label: 'Past similar cases reviewed',
    lane: 'knowledge',
    x: 455,
    y: 196,
    width: 190,
    tooltip: {
      technical: 'Searched 1,847 past patients · 198ms',
      plain: "Reviewed every past patient who had Sarah's symptom profile",
    },
  },
  {
    id: 'program',
    label: 'Best-fit treatment protocol · 89% match',
    lane: 'knowledge',
    x: 650,
    y: 196,
    width: 220,
    tooltip: {
      technical: 'Ranked top 5 protocols by similarity',
      plain: 'Picked the protocol patients like Sarah responded best to',
    },
  },
  {
    id: 'decision',
    label: 'General clean or restorative work?',
    lane: 'decision',
    x: 650,
    y: 282,
    width: 112,
    shape: 'diamond',
    tooltip: {
      technical: 'Tier decision · 3 inputs · 85% confidence required',
      plain: "Chose the right treatment level for Sarah's symptoms",
    },
  },
  {
    id: 'welcome',
    label: 'Welcome SMS sent',
    lane: 'action',
    x: 620,
    y: 360,
    width: 150,
    tooltip: {
      technical: 'Personalized SMS · authenticated send',
      plain: 'Sent Sarah her appointment details and intake form',
    },
  },
  {
    id: 'session',
    label: 'First appointment booked',
    lane: 'action',
    x: 790,
    y: 360,
    width: 170,
    tooltip: {
      technical: 'Provider availability matched · slot reserved',
      plain: 'Booked Sarah with the right provider at the right time',
    },
  },
  {
    id: 'coach',
    label: 'Provider assigned',
    lane: 'action',
    x: 925,
    y: 360,
    width: 150,
    tooltip: {
      technical: 'Provider match · specialty + workload balanced',
      plain: 'Matched Sarah with the dentist who specializes in her symptoms',
    },
  },
];

const homebuilderTaskNodes: TaskNode[] = [
  {
    id: 'new-lead',
    label: 'New lead inquiry',
    lane: 'system',
    x: 80,
    y: 40,
    width: 150,
    tooltip: {
      technical: 'Real-time signal capture · under 50ms',
      plain: "Captured Mike's inquiry the moment he submitted the form",
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
      plain: 'Confirmed Mike is a new lead, not a returning customer',
    },
  },
  {
    id: 'plan',
    label: 'Quote drafted',
    lane: 'system',
    x: 620,
    y: 40,
    width: 140,
    tooltip: {
      technical: 'Personalized quote generation',
      plain: "Wrote Mike's full quote with materials, labor, and timeline",
    },
  },
  {
    id: 'trial',
    label: 'Site visit scheduled · 95% confirmed',
    lane: 'intake',
    x: 515,
    y: 118,
    width: 204,
    tooltip: {
      technical: 'Calendar booking · text confirmation',
      plain: 'Found a site visit slot — Mike confirmed by text in 90 seconds',
    },
  },
  {
    id: 'goal',
    label: 'Specs understood',
    lane: 'intake',
    x: 320,
    y: 118,
    width: 150,
    tooltip: {
      technical: 'Spec extraction from conversation',
      plain: "Turned '3-car garage with workshop' into measurable build specs",
    },
  },
  {
    id: 'similar',
    label: 'Past similar projects reviewed',
    lane: 'knowledge',
    x: 455,
    y: 196,
    width: 198,
    tooltip: {
      technical: 'Searched 800+ past projects · 312ms',
      plain: "Reviewed every past project that matched Mike's spec profile",
    },
  },
  {
    id: 'program',
    label: 'Best-fit crew specialty · 87% match',
    lane: 'knowledge',
    x: 650,
    y: 196,
    width: 210,
    tooltip: {
      technical: 'Ranked top 5 crews by similarity',
      plain: "Picked the crew that's built the most projects like Mike's",
    },
  },
  {
    id: 'decision',
    label: 'Standard build or premium finish?',
    lane: 'decision',
    x: 650,
    y: 282,
    width: 112,
    shape: 'diamond',
    tooltip: {
      technical: 'Tier decision · 3 inputs · 85% confidence required',
      plain: "Chose the right build tier for Mike's budget and specs",
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
      plain: 'Sent Mike his quote, timeline, and next-step prep',
    },
  },
  {
    id: 'session',
    label: 'Site visit booked',
    lane: 'action',
    x: 790,
    y: 360,
    width: 150,
    tooltip: {
      technical: 'Crew availability matched · slot reserved',
      plain: "Booked Mike's site visit with the right project manager",
    },
  },
  {
    id: 'coach',
    label: 'Crew assigned',
    lane: 'action',
    x: 925,
    y: 360,
    width: 150,
    tooltip: {
      technical: 'Crew match · specialty + workload balanced',
      plain: 'Matched Mike with the garage-specialty crew',
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

const taskFlows: Record<Industry, TaskFlowData> = {
  training: {
    subhead: 'New member walked in — Greg, wants to lose 20 lbs in 12 weeks',
    nodes: trainingTaskNodes,
    edges: taskEdges,
  },
  dental: {
    subhead: 'New patient called — Sarah, recurring tooth pain on left side',
    nodes: dentalTaskNodes,
    edges: taskEdges,
  },
  homebuilder: {
    subhead: 'New lead inquired — Mike, wants 3-car garage with workshop',
    nodes: homebuilderTaskNodes,
    edges: taskEdges,
  },
};

const serviceArchitectures: Record<Industry, ArchitectureLayer[]> = {
  training: [
    {
      name: 'Customer-Facing Layer',
      plain: 'Member-facing booking, plan delivery, support',
      technical: 'Web · SMS · Email · phone routing',
    },
    {
      name: 'Decision Engine',
      plain: 'Picks programs, tiers, coaches, schedules',
      technical: 'Claude (Anthropic) · structured outputs · 85% confidence threshold',
    },
    {
      name: 'Knowledge Base',
      plain: 'Past member journeys, program library, coach specialties',
      technical: 'Vector search · semantic indexing · 1,247 indexed members',
    },
    {
      name: 'Integration Layer',
      plain: 'Connects to your existing tools',
      technical: 'Member management · point-of-sale · scheduling · accounting',
    },
    {
      name: 'Storage & Audit',
      plain: "Every decision logged, every member's history saved",
      technical: 'Encrypted storage · full audit trail · 7-year retention',
    },
  ],
  dental: [
    {
      name: 'Customer-Facing Layer',
      plain: 'Patient-facing scheduling, reminders, intake',
      technical: 'Web · SMS · Email · phone routing',
    },
    {
      name: 'Decision Engine',
      plain: 'Triages cases, books appointments, assigns providers',
      technical: 'Claude (Anthropic) · structured outputs · clinical guardrails',
    },
    {
      name: 'Knowledge Base',
      plain: 'Past patient histories, treatment protocols, insurance rules',
      technical: 'Vector search · HIPAA-compliant indexing · semantic retrieval',
    },
    {
      name: 'Integration Layer',
      plain: 'Connects to your existing tools',
      technical: 'Practice management · charting · insurance verification · accounting',
    },
    {
      name: 'Storage & Audit',
      plain: "Every decision logged, every patient's history saved",
      technical: 'HIPAA-compliant encrypted storage · 7-year retention',
    },
  ],
  homebuilder: [
    {
      name: 'Customer-Facing Layer',
      plain: 'Lead-facing intake, project updates, scheduling',
      technical: 'Web · SMS · Email · phone routing',
    },
    {
      name: 'Decision Engine',
      plain: 'Qualifies leads, routes projects, schedules crews',
      technical: 'Claude (Anthropic) · structured outputs · 85% confidence threshold',
    },
    {
      name: 'Knowledge Base',
      plain: 'Past project specs, crew expertise, supplier pricing',
      technical: 'Vector search · semantic indexing · 800+ indexed projects',
    },
    {
      name: 'Integration Layer',
      plain: 'Connects to your existing tools',
      technical: 'Project management · estimating · accounting · payments',
    },
    {
      name: 'Storage & Audit',
      plain: "Every quote logged, every project's history saved",
      technical: 'Encrypted storage · full audit trail · 7-year retention',
    },
  ],
};

const architectureActivity = (
  timestamp: string,
  id: string,
  description: string,
  source: string,
  metrics: string,
  iconHint: ArchitectureIconHint
): ArchitectureActivityEntry => ({ timestamp, id, description, source, metrics, iconHint });

const serviceArchitectureActivities: Record<Industry, ArchitectureActivityEntry[][]> = {
  training: [
    [
      architectureActivity('14:23:11', 'MBR-A4291', 'Greg booked trial · gym tour requested', 'Web form', '250ms response', 'form'),
      architectureActivity('14:22:48', 'MBR-A4187', 'Sara texted: can I bring a friend?', 'SMS', '180ms response', 'sms'),
      architectureActivity('14:22:22', 'MBR-A4156', "Marcus called: cancel today's session", 'Phone', '320ms response', 'phone'),
      architectureActivity('14:21:55', 'MBR-A3982', 'Patricia opened email, clicked confirm', 'Email', 'tracked', 'email'),
      architectureActivity('14:21:12', 'MBR-A4288', 'Coach booking page · 3 slots available', 'Web form', '95ms response', 'form'),
      architectureActivity('14:20:48', 'MBR-A4145', 'Jen rescheduled · Tuesday 6pm', 'SMS', '210ms response', 'sms'),
    ],
    [
      architectureActivity('14:23:08', '—', 'Greg → 12-week strength program · 91% confidence', 'Claude', 'structured · 247ms', 'claude'),
      architectureActivity('14:22:51', '—', 'Sara → premium tier recommended · 88%', 'Claude', 'tier eval · 189ms', 'claude'),
      architectureActivity('14:22:30', '—', 'Marcus → comeback offer drafted · 84%', 'Claude', 'retention · 312ms', 'claude'),
      architectureActivity('14:22:01', '—', 'Patricia → tier upgrade qualified · 92%', 'Claude', 'revenue · 156ms', 'claude'),
      architectureActivity('14:21:40', '—', 'Coach assignment · Marcus paired with Greg', 'Claude', 'skill match · 98ms', 'claude'),
      architectureActivity('14:21:15', '—', 'Jen retention check · low risk · no action', 'Claude', 'health scan · 124ms', 'claude'),
    ],
    [
      architectureActivity('14:23:07', '—', 'members like Greg with 20lb goals', 'Vector search', '1,247 idx · 247ms · 5 matches', 'search'),
      architectureActivity('14:22:50', '—', 'premium tier conversion patterns', 'Vector search', '1,247 idx · 198ms · 8 matches', 'search'),
      architectureActivity('14:22:28', '—', 'lapsed members reactivated last quarter', 'Vector search', '1,247 idx · 312ms · 12 matches', 'search'),
      architectureActivity('14:22:00', '—', 'tier upgrade triggers · last 90 days', 'Vector search', '1,247 idx · 156ms · 7 matches', 'search'),
      architectureActivity('14:21:39', '—', 'coach specialty match · strength + beginner', 'Vector search', '1,247 idx · 98ms · 4 matches', 'search'),
      architectureActivity('14:21:14', '—', 'high-risk retention patterns', 'Vector search', '1,247 idx · 124ms · 3 matches', 'search'),
    ],
    [
      architectureActivity('14:23:09', '—', 'Calendar · slot reserved Tue 6pm · Coach Marcus', 'Member management', 'synced', 'link'),
      architectureActivity('14:22:53', '—', 'Payment · Sara charged $89 monthly · approved', 'Point-of-sale', 'processed', 'link'),
      architectureActivity('14:22:33', '—', 'Schedule update · Marcus 12-week plan loaded', 'Scheduling', '14 sessions queued', 'link'),
      architectureActivity('14:22:04', '—', 'Invoice · Patricia upgrade · $40 prorated charge', 'Accounting', 'ledger updated', 'link'),
      architectureActivity('14:21:42', '—', "Calendar update · Greg's trial confirmed", 'Scheduling', 'synced', 'link'),
      architectureActivity('14:21:18', '—', 'Session attendance · Jen checked in · 6:00pm', 'Member management', 'logged', 'link'),
    ],
    [
      architectureActivity('14:23:10', '—', "Greg's program decision · 247-token reasoning saved", 'AUDIT', 'Encrypted · 7-year retention', 'lock'),
      architectureActivity('14:22:55', '—', "Sara's tier change · approval chain logged", 'AUDIT', 'Encrypted · 7-year retention', 'lock'),
      architectureActivity('14:22:35', '—', 'Marcus comeback offer · sent + received states', 'AUDIT', 'Encrypted · 7-year retention', 'lock'),
      architectureActivity('14:22:08', '—', 'Patricia upgrade decision · revenue scoring saved', 'AUDIT', 'Encrypted · 7-year retention', 'lock'),
      architectureActivity('14:21:45', '—', 'Coach assignment reasoning · skill match saved', 'AUDIT', 'Encrypted · 7-year retention', 'lock'),
      architectureActivity('14:21:21', '—', 'Jen check-in · attendance + retention markers', 'AUDIT', 'Encrypted · 7-year retention', 'lock'),
    ],
  ],
  dental: [
    [
      architectureActivity('14:23:11', 'PT-44912', 'Sarah texted: tooth pain on left side, urgent?', 'SMS', '180ms response', 'sms'),
      architectureActivity('14:22:48', 'PT-44887', 'Insurance pre-auth question · PPO plan', 'Web form', '250ms response', 'form'),
      architectureActivity('14:22:22', 'PT-44856', 'John called: cancel cleaning, reschedule', 'Phone', '320ms response', 'phone'),
      architectureActivity('14:21:55', 'PT-44782', 'Maya confirmed appointment via SMS', 'SMS', '210ms response', 'sms'),
      architectureActivity('14:21:12', 'PT-44918', 'Insurance verification request submitted', 'Web form', '95ms response', 'form'),
      architectureActivity('14:20:48', 'PT-44845', 'Kevin requested same-day emergency slot', 'Phone', '280ms response', 'phone'),
    ],
    [
      architectureActivity('14:23:08', '—', 'Sarah → urgent triage · same-day slot · 94%', 'Claude', 'clinical guardrails · 247ms', 'claude'),
      architectureActivity('14:22:51', '—', 'John → cancellation flagged · retention contact', 'Claude', 'patient retention · 189ms', 'claude'),
      architectureActivity('14:22:30', '—', 'Maya appointment confirmed · provider matched', 'Claude', 'provider routing · 156ms', 'claude'),
      architectureActivity('14:22:01', '—', 'Kevin → emergency slot allocated · Dr. Chen', 'Claude', 'triage logic · 124ms', 'claude'),
      architectureActivity('14:21:40', '—', 'Insurance pre-auth → eligibility verified · 96%', 'Claude', 'verification · 198ms', 'claude'),
      architectureActivity('14:21:15', '—', 'Treatment plan drafted · 3-visit sequence', 'Claude', 'plan generation · 312ms', 'claude'),
    ],
    [
      architectureActivity('14:23:07', '—', 'tooth pain triage protocols', 'Vector search', '1,847 idx · 198ms · 6 matches', 'search'),
      architectureActivity('14:22:50', '—', 'PPO coverage rules · cleanings', 'Vector search', '1,847 idx · 156ms · 4 matches', 'search'),
      architectureActivity('14:22:28', '—', 'cancellation patterns · last 90 days', 'Vector search', '1,847 idx · 312ms · 9 matches', 'search'),
      architectureActivity('14:22:00', '—', 'emergency slot allocation history', 'Vector search', '1,847 idx · 124ms · 5 matches', 'search'),
      architectureActivity('14:21:39', '—', 'provider availability · Dr. Chen · this week', 'Vector search', '1,847 idx · 98ms · 7 matches', 'search'),
      architectureActivity('14:21:14', '—', 'treatment plan templates · molar restoration', 'Vector search', '1,847 idx · 247ms · 8 matches', 'search'),
    ],
    [
      architectureActivity('14:23:09', '—', 'Calendar · Sarah 4pm slot · Dr. Chen confirmed', 'Practice management', 'synced', 'link'),
      architectureActivity('14:22:53', '—', "Patient chart · Sarah's history loaded", 'Charting', 'synced', 'link'),
      architectureActivity('14:22:33', '—', 'Insurance · pre-auth approved · $340', 'Insurance verification', 'processed', 'link'),
      architectureActivity('14:22:04', '—', 'Billing · John cancellation fee waived', 'Accounting', 'adjusted', 'link'),
      architectureActivity('14:21:42', '—', 'Provider schedule · Dr. Chen Tuesday 2pm', 'Scheduling', 'synced', 'link'),
      architectureActivity('14:21:18', '—', 'Treatment plan · uploaded to patient portal', 'Practice management', 'synced', 'link'),
    ],
    [
      architectureActivity('14:23:10', '—', "Sarah's triage decision · 312-token reasoning", 'AUDIT', 'HIPAA · 7-year retention', 'lock'),
      architectureActivity('14:22:55', '—', 'John cancellation · retention path saved', 'AUDIT', 'HIPAA · 7-year retention', 'lock'),
      architectureActivity('14:22:35', '—', 'Maya appointment · provider match logged', 'AUDIT', 'HIPAA · 7-year retention', 'lock'),
      architectureActivity('14:22:08', '—', 'Kevin emergency · clinical justification saved', 'AUDIT', 'HIPAA · 7-year retention', 'lock'),
      architectureActivity('14:21:45', '—', 'Insurance pre-auth · eligibility chain saved', 'AUDIT', 'HIPAA · 7-year retention', 'lock'),
      architectureActivity('14:21:21', '—', 'Treatment plan · 3-visit sequence saved', 'AUDIT', 'HIPAA · 7-year retention', 'lock'),
    ],
  ],
  homebuilder: [
    [
      architectureActivity('14:23:11', 'LD-7702', 'Mike submitted form: 3-car garage with workshop', 'Web form', '250ms response', 'form'),
      architectureActivity('14:22:48', 'LD-7689', 'Laura texted: timeline for kitchen remodel?', 'SMS', '180ms response', 'sms'),
      architectureActivity('14:22:22', 'LD-7654', 'Dave called: site visit Thursday or Friday?', 'Phone', '320ms response', 'phone'),
      architectureActivity('14:21:55', 'LD-7611', 'Pam confirmed quote acceptance via email', 'Email', 'tracked', 'email'),
      architectureActivity('14:21:12', 'LD-7698', 'Rachel uploaded site photos · 8 images', 'Web form', '95ms response', 'form'),
      architectureActivity('14:20:48', 'LD-7672', 'Tom requested same-day estimate revision', 'Phone', '280ms response', 'phone'),
    ],
    [
      architectureActivity('14:23:08', '—', 'Mike → garage specialist crew matched · 87%', 'Claude', 'crew routing · 247ms', 'claude'),
      architectureActivity('14:22:51', '—', 'Laura → kitchen remodel timeline · 6 weeks', 'Claude', 'project sizing · 189ms', 'claude'),
      architectureActivity('14:22:30', '—', 'Dave site visit · Thursday 10am · Project Mgr', 'Claude', 'schedule logic · 156ms', 'claude'),
      architectureActivity('14:22:01', '—', 'Pam quote accepted · contract drafted', 'Claude', 'contract generation · 124ms', 'claude'),
      architectureActivity('14:21:40', '—', 'Rachel site analysis · scope confirmed', 'Claude', 'specs extraction · 198ms', 'claude'),
      architectureActivity('14:21:15', '—', 'Tom estimate revision · materials adjustment', 'Claude', 'pricing logic · 312ms', 'claude'),
    ],
    [
      architectureActivity('14:23:07', '—', '3-car garage projects · last 24 months', 'Vector search', '800 idx · 247ms · 12 matches', 'search'),
      architectureActivity('14:22:50', '—', 'kitchen remodel timelines · similar scope', 'Vector search', '800 idx · 198ms · 8 matches', 'search'),
      architectureActivity('14:22:28', '—', 'site visit protocols · custom builds', 'Vector search', '800 idx · 156ms · 5 matches', 'search'),
      architectureActivity('14:22:00', '—', 'garage crew specialty · workshop builds', 'Vector search', '800 idx · 124ms · 6 matches', 'search'),
      architectureActivity('14:21:39', '—', 'supplier delays · last 30 days', 'Vector search', '800 idx · 98ms · 3 matches', 'search'),
      architectureActivity('14:21:14', '—', 'estimate revision patterns · materials', 'Vector search', '800 idx · 312ms · 9 matches', 'search'),
    ],
    [
      architectureActivity('14:23:09', '—', 'Calendar · Mike site visit Thu 10am · PM Sarah', 'Project management', 'synced', 'link'),
      architectureActivity('14:22:53', '—', 'Estimate · Laura kitchen remodel · $87,400', 'Estimating', 'processed', 'link'),
      architectureActivity('14:22:33', '—', 'Crew schedule · garage specialist · Mon-Fri', 'Scheduling', 'synced', 'link'),
      architectureActivity('14:22:04', '—', 'Invoice · Pam contract deposit · $8,500', 'Accounting', 'ledger updated', 'link'),
      architectureActivity('14:21:42', '—', 'Project file · Rachel site photos · uploaded', 'Project management', 'synced', 'link'),
      architectureActivity('14:21:18', '—', 'Payment · Tom revision approved · $2,300 adjustment', 'Payments', 'processed', 'link'),
    ],
    [
      architectureActivity('14:23:10', '—', 'Mike crew assignment · skill match saved', 'AUDIT', 'Encrypted · 7-year retention', 'lock'),
      architectureActivity('14:22:55', '—', 'Laura timeline estimate · scope reasoning saved', 'AUDIT', 'Encrypted · 7-year retention', 'lock'),
      architectureActivity('14:22:35', '—', 'Dave site visit decision · routing saved', 'AUDIT', 'Encrypted · 7-year retention', 'lock'),
      architectureActivity('14:22:08', '—', 'Pam contract acceptance · approval chain saved', 'AUDIT', 'Encrypted · 7-year retention', 'lock'),
      architectureActivity('14:21:45', '—', 'Rachel scope confirmation · spec analysis saved', 'AUDIT', 'Encrypted · 7-year retention', 'lock'),
      architectureActivity('14:21:21', '—', 'Tom estimate revision · pricing rationale saved', 'AUDIT', 'Encrypted · 7-year retention', 'lock'),
    ],
  ],
};

const industries: IndustryData[] = [
  {
    id: 'training',
    code: 'TRN-A4291',
    label: 'Training Facility',
    liveFindings: liveFindings.training,
    taskFlow: taskFlows.training,
    serviceArchitecture: serviceArchitectures.training,
  },
  {
    id: 'dental',
    code: 'DNT-44912',
    label: 'Dental Practice',
    liveFindings: liveFindings.dental,
    taskFlow: taskFlows.dental,
    serviceArchitecture: serviceArchitectures.dental,
  },
  {
    id: 'homebuilder',
    code: 'BLD-7702',
    label: 'Homebuilder',
    liveFindings: liveFindings.homebuilder,
    taskFlow: taskFlows.homebuilder,
    serviceArchitecture: serviceArchitectures.homebuilder,
  },
];

const CYCLE_INTERVAL_MS = 30000;
const CYCLE_TICK_MS = 100;
const TASK_TOOLTIP_WIDTH = 380;
const TASK_TOOLTIP_HEIGHT = 190;
const MOBILE_TOOLTIP_MARGIN = 16;

const quickContactSelectors = [
  '[aria-label="Open quick contact"]',
  '[aria-label="Organic AI Solutions chat assistant"]',
];

function focusTabByOffset(container: HTMLElement, offset: number) {
  const tabs = Array.from(container.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);
  if (currentIndex < 0) return;

  const nextIndex = (currentIndex + offset + tabs.length) % tabs.length;
  tabs[nextIndex]?.focus();
}

function handleTabListKeyDown(event: React.KeyboardEvent<HTMLElement>) {
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    focusTabByOffset(event.currentTarget, 1);
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    focusTabByOffset(event.currentTarget, -1);
  }
}

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
  const [activeIndustryIndex, setActiveIndustryIndex] = useState(0);
  const [cycleProgress, setCycleProgress] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [tooltipPaused, setTooltipPaused] = useState(false);
  const [tabPulseActive, setTabPulseActive] = useState(false);
  const hasPlayedTabPulseRef = useRef(false);
  const manualPauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleProgressRef = useRef(0);
  const activeIndustry = industries[activeIndustryIndex];
  const isPaused = hoverPaused || manualPaused || tooltipPaused;

  const pauseForManualInteraction = () => {
    if (manualPauseTimeoutRef.current) clearTimeout(manualPauseTimeoutRef.current);
    setManualPaused(true);
    manualPauseTimeoutRef.current = setTimeout(() => setManualPaused(false), CYCLE_INTERVAL_MS);
  };

  const handlePanelChange = (panel: Panel) => {
    setActivePanel(panel);
    pauseForManualInteraction();
  };

  const handleIndustryChange = (index: number) => {
    setActiveIndustryIndex(index);
    cycleProgressRef.current = 0;
    setCycleProgress(0);
    pauseForManualInteraction();
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      let next = cycleProgressRef.current + CYCLE_TICK_MS / CYCLE_INTERVAL_MS;
      if (next >= 1) {
        next = 0;
        setActiveIndustryIndex((index) => (index + 1) % industries.length);
      }
      cycleProgressRef.current = next;
      setCycleProgress(next);
    }, CYCLE_TICK_MS);

    return () => clearInterval(interval);
  }, [isPaused]);

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
      if (manualPauseTimeoutRef.current) clearTimeout(manualPauseTimeoutRef.current);
      setQuickContactHidden(false);
    };
  }, []);

  return (
    <section ref={sectionRef} id="proof" className="relative overflow-hidden bg-[#0A0A0F] py-12 text-white md:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_85%_55%,rgba(167,139,250,0.12),transparent_28%)]" />
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6">
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
            industryLabel={activeIndustry.label}
            industryCode={activeIndustry.code}
            industries={industries}
            activeIndustryIndex={activeIndustryIndex}
            activePanel={activePanel}
            onPanelChange={handlePanelChange}
            onIndustryChange={handleIndustryChange}
            onHoverPauseChange={setHoverPaused}
            onManualPause={pauseForManualInteraction}
            cycleProgress={cycleProgress}
            tabPulseActive={tabPulseActive}
          >
            {(panelInView) => (
              <AnimatePresence mode="wait">
                {activePanel === 'findings' && (
                  <FindingsPanel
                    key={`findings-${activeIndustry.id}`}
                    data={activeIndustry.liveFindings}
                    panelInView={panelInView}
                  />
                )}
                {activePanel === 'taskflow' && (
                  <TaskFlowPanel
                    key={`taskflow-${activeIndustry.id}`}
                    data={activeIndustry.taskFlow}
                    onTooltipOpenChange={setTooltipPaused}
                  />
                )}
                {activePanel === 'architecture' && (
                  <ServiceArchitecturePanel
                    key={`architecture-${activeIndustry.id}`}
                    layers={activeIndustry.serviceArchitecture}
                    activities={serviceArchitectureActivities[activeIndustry.id]}
                    paused={isPaused}
                  />
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
    <div
      role="tablist"
      aria-label="Select dashboard view"
      onKeyDown={handleTabListKeyDown}
      className="mx-auto flex w-max min-w-max justify-center rounded-full border border-white/10 bg-white/5 p-1"
    >
      <PanelButton id="findings" active={activePanel} onClick={onPanelChange} pulse={tabPulseActive}>
        Live Findings
      </PanelButton>
      <span className="mx-0.5 self-center rounded-full bg-white/25 p-0.5 sm:mx-1" aria-hidden="true" />
      <PanelButton id="taskflow" active={activePanel} onClick={onPanelChange} pulse={tabPulseActive}>
        Task Flow
      </PanelButton>
      <span className="mx-0.5 self-center rounded-full bg-white/25 p-0.5 sm:mx-1" aria-hidden="true" />
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
      id={`dashboard-tab-${id}`}
      role="tab"
      aria-selected={isActive}
      aria-controls="dashboard-content"
      aria-label={`Show ${children}`}
      onClick={() => onClick(id)}
      className={`relative cursor-pointer whitespace-nowrap rounded-full border-b px-2.5 py-2 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#11121A] sm:px-4 sm:py-3 sm:text-base ${
        isActive
          ? 'border-transparent'
          : 'border-white/15 text-white/55 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/5 hover:text-white/90'
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

function IndustryTabs({
  industries,
  activeIndustryIndex,
  onIndustryChange,
  pulse,
  activeIndustryLabel,
}: {
  industries: IndustryData[];
  activeIndustryIndex: number;
  onIndustryChange: (index: number) => void;
  pulse: boolean;
  activeIndustryLabel: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Select industry"
      onKeyDown={handleTabListKeyDown}
      className="mx-auto flex w-max min-w-max items-center justify-center rounded-full border border-white/10 bg-white/[0.035] p-1"
    >
      {industries.map((industry, index) => (
        <div key={industry.id} className="flex items-center">
          {index > 0 && <span className="mx-0.5 rounded-full bg-white/25 p-0.5 sm:mx-1" aria-hidden="true" />}
          <IndustryButton
            index={index}
            activeIndex={activeIndustryIndex}
            onClick={onIndustryChange}
            pulse={pulse}
            ariaLabel={`Show ${industry.label} dashboard${industry.label === activeIndustryLabel ? ' (current)' : ''}`}
          >
            {industry.label}
          </IndustryButton>
        </div>
      ))}
    </div>
  );
}

function IndustryButton({
  index,
  activeIndex,
  onClick,
  pulse,
  ariaLabel,
  children,
}: {
  index: number;
  activeIndex: number;
  onClick: (index: number) => void;
  pulse: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  const isActive = index === activeIndex;

  return (
    <button
      type="button"
      id={`dashboard-industry-tab-${index}`}
      role="tab"
      aria-selected={isActive}
      aria-controls="dashboard-content"
      onClick={() => onClick(index)}
      aria-label={ariaLabel}
      className={`relative cursor-pointer whitespace-nowrap rounded-full border-b px-2.5 py-2 text-xs font-medium text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#11121A] sm:px-4 sm:py-3 sm:text-base ${
        isActive
          ? 'border-emerald-400 bg-emerald-400/12 text-emerald-300 shadow-[0_8px_24px_rgba(16,185,129,0.18),inset_0_0_16px_rgba(16,185,129,0.08)]'
          : 'border-white/10 text-white/55 hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/5 hover:text-white/80'
      }`}
    >
      <AnimatePresence>
        {pulse && isActive && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-emerald-400/45 shadow-[0_0_22px_rgba(16,185,129,0.24)]"
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
          className="absolute inset-x-3 bottom-1 h-px rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.72)]"
        />
      )}
    </button>
  );
}

function DashboardPanelShell({
  industryLabel,
  industryCode,
  industries,
  activeIndustryIndex,
  activePanel,
  onPanelChange,
  onIndustryChange,
  onHoverPauseChange,
  onManualPause,
  cycleProgress,
  tabPulseActive,
  children,
}: {
  industryLabel: string;
  industryCode: string;
  industries: IndustryData[];
  activeIndustryIndex: number;
  activePanel: Panel;
  onPanelChange: (panel: Panel) => void;
  onIndustryChange: (index: number) => void;
  onHoverPauseChange: (paused: boolean) => void;
  onManualPause: () => void;
  cycleProgress: number;
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
  const progressRgb = glow.rgb.join(', ');

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
        className="relative flex min-h-[560px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur md:min-h-[640px] md:p-5"
        onMouseEnter={() => onHoverPauseChange(true)}
        onMouseLeave={() => onHoverPauseChange(false)}
        onPointerDown={(event) => {
          if (event.pointerType !== 'mouse') onManualPause();
        }}
      >
        <button
          type="button"
          onClick={onManualPause}
          className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-50 focus:rounded-full focus:border focus:border-emerald-400 focus:bg-[#0E1118] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-emerald-200 focus:outline-none"
          aria-label="Pause industry rotation"
        >
          Pause industry rotation
        </button>

        <div className="mb-3 flex flex-col items-center gap-3">
          <div className="flex flex-col items-center gap-3">
            <span className="mx-auto inline-flex items-center justify-center gap-2 text-center text-xs font-medium uppercase tracking-wide text-emerald-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.85)]" />
              Live · {industryCode}
            </span>

            <div className="relative flex w-full justify-center overflow-x-auto pb-1 after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-10 after:bg-gradient-to-l after:from-[#11121A] after:to-transparent lg:pb-0 lg:after:hidden">
              <PanelTabs activePanel={activePanel} onPanelChange={onPanelChange} tabPulseActive={tabPulseActive} />
            </div>
          </div>

          <div className="relative flex w-full justify-center overflow-x-auto pb-1 after:pointer-events-none after:absolute after:inset-y-0 after:right-0 after:w-10 after:bg-gradient-to-l after:from-[#11121A] after:to-transparent lg:pb-0 lg:after:hidden">
            <IndustryTabs
              industries={industries}
              activeIndustryIndex={activeIndustryIndex}
              onIndustryChange={onIndustryChange}
              pulse={tabPulseActive}
              activeIndustryLabel={industryLabel}
            />
          </div>
        </div>

        <div className="mb-4 h-0.5 w-full rounded-full bg-white/5">
          <motion.div
            className="h-0.5 rounded-full"
            animate={{ width: `${cycleProgress * 100}%` }}
            transition={{ duration: 0.12, ease: 'linear' }}
            style={{
              backgroundColor: `rgba(${progressRgb}, 0.55)`,
              boxShadow: `0 0 12px rgba(${progressRgb}, 0.35)`,
            }}
          />
        </div>

        <div
          id="dashboard-content"
          role="tabpanel"
          aria-labelledby={`dashboard-tab-${activePanel}`}
          className="min-h-0 flex-1"
        >
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
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-white/45">
            Recent
          </p>
          <div className="relative rounded-2xl border border-white/10 bg-[#11121A]/80">
            <div aria-live="polite" aria-atomic="false" className="max-h-[300px] overflow-y-auto pb-8 lg:max-h-[420px] lg:pb-0">
              {data.findings.map((finding, index) => (
                <motion.div
                  key={finding.id}
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.36, ease: 'easeOut' }}
                  className={`grid gap-2 border-b border-white/10 px-4 py-5 last:border-b-0 md:grid-cols-[120px_1fr] md:px-5 lg:grid-cols-1 lg:px-4 lg:py-4 ${
                    index >= 4 ? 'lg:hidden' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm text-white/55">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {finding.when}
                  </div>
                  <p className="text-base leading-relaxed text-white/85">{finding.text}</p>
                </motion.div>
              ))}
            </div>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-12 rounded-b-2xl bg-gradient-to-t from-[#11121A] to-transparent lg:hidden"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TaskFlowPanel({
  data,
  onTooltipOpenChange,
}: {
  data: TaskFlowData;
  onTooltipOpenChange: (open: boolean) => void;
}) {
  useEffect(() => () => onTooltipOpenChange(false), [onTooltipOpenChange]);

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
          <span>{data.subhead}</span>
        </p>
      </div>

      <div className="hidden lg:block">
        <TaskFlowGraph data={data} onTooltipOpenChange={onTooltipOpenChange} />
      </div>

      <MobileTaskFlowFallback data={data} onTooltipOpenChange={onTooltipOpenChange} />
    </motion.div>
  );
}

function TaskFlowGraph({
  data,
  onTooltipOpenChange,
}: {
  data: TaskFlowData;
  onTooltipOpenChange: (open: boolean) => void;
}) {
  return (
    <div
      data-task-flow-graph
      className="relative h-[392px] overflow-visible rounded-3xl border border-white/10 bg-[#0E1118]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 52% 50%, rgba(16,185,129,0.10), transparent 34%), linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 44px 44px, 44px 44px',
      }}
    >
      <div className="absolute inset-y-0 left-0 z-20 w-[128px] overflow-hidden rounded-l-3xl border-r border-white/10 bg-[#0E1118]/70 backdrop-blur-sm">
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

      <div className="absolute inset-y-0 left-[128px] right-0 overflow-visible rounded-r-3xl">
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

          {data.edges.map((edge, index) => {
            const source = getTaskNode(edge.from, data.nodes);
            const lane = getTaskLane(source.lane);
            const edgeId = `task-edge-${index}`;

            return (
              <g key={edgeId}>
                <motion.path
                  id={edgeId}
                  d={buildTaskEdgePath(edge, data.nodes)}
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

        {data.nodes.map((node, index) => (
          <TaskNodeCard key={node.id} node={node} index={index} onTooltipOpenChange={onTooltipOpenChange} />
        ))}
      </div>
    </div>
  );
}

function MobileTaskFlowFallback({
  data,
  onTooltipOpenChange,
}: {
  data: TaskFlowData;
  onTooltipOpenChange: (open: boolean) => void;
}) {
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
              {data.nodes
                .filter((node) => node.lane === lane.id)
                .map((node) => (
                  <MobileTaskNodeChip key={node.id} node={node} onTooltipOpenChange={onTooltipOpenChange} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileTaskNodeChip({
  node,
  onTooltipOpenChange,
}: {
  node: TaskNode;
  onTooltipOpenChange: (open: boolean) => void;
}) {
  const lane = getTaskLane(node.lane);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipAlign, setTooltipAlign] = useState<TooltipAlign>('center');
  const mobileTooltipPlacement: TooltipPlacement = node.lane === 'action' ? 'top' : 'bottom';
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onTooltipOpenChange(tooltipOpen);
    return () => onTooltipOpenChange(false);
  }, [onTooltipOpenChange, tooltipOpen]);

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

  const toggleTooltip = () => {
    if (!tooltipOpen) {
      setTooltipAlign(calculateViewportTooltipAlign(wrapperRef.current));
    }
    setTooltipOpen((open) => !open);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          toggleTooltip();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setTooltipOpen(false);
        }}
        aria-describedby={`task-node-mobile-${node.id}-description`}
        className="w-full rounded-lg border bg-[#11121A]/95 px-3 py-2 text-left text-sm font-medium leading-snug text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#11121A]"
        style={{ borderColor: `${lane.color}8C`, boxShadow: `0 0 14px ${lane.color}18` }}
      >
        {node.label}
      </button>
      <span id={`task-node-mobile-${node.id}-description`} className="sr-only">
        {node.tooltip.technical}. {node.tooltip.plain}
      </span>
      <AnimatePresence>
        {tooltipOpen && (
          <TaskNodeTooltip node={node} lane={lane} placement={mobileTooltipPlacement} align={tooltipAlign} />
        )}
      </AnimatePresence>
    </div>
  );
}

function TaskNodeCard({
  node,
  index,
  onTooltipOpenChange,
}: {
  node: TaskNode;
  index: number;
  onTooltipOpenChange: (open: boolean) => void;
}) {
  const lane = getTaskLane(node.lane);
  const isDiamond = node.shape === 'diamond';
  const height = isDiamond ? 92 : 40;
  const width = isDiamond ? 92 : node.width;
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipPlacement, setTooltipPlacement] = useState<TooltipPlacement>('top');
  const [tooltipAlign, setTooltipAlign] = useState<TooltipAlign>('center');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onTooltipOpenChange(tooltipOpen);
    return () => onTooltipOpenChange(false);
  }, [onTooltipOpenChange, tooltipOpen]);

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

  const positionTooltip = () => {
    const nextPosition = calculateTaskTooltipPosition(wrapperRef.current);
    if (nextPosition.placement === 'bottom' && node.lane === 'system') {
      if (node.x > 500) {
        nextPosition.align = 'right';
      } else if (node.x > 160) {
        nextPosition.align = 'outside-left';
      } else {
        nextPosition.align = 'left';
      }
    }
    setTooltipPlacement(nextPosition.placement);
    setTooltipAlign(nextPosition.align);
  };

  const openTooltip = () => {
    positionTooltip();
    setTooltipOpen(true);
  };

  const showTooltip = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    positionTooltip();
    showTimerRef.current = setTimeout(() => setTooltipOpen(true), 200);
  };

  const hideTooltip = () => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    hideTimerRef.current = setTimeout(() => setTooltipOpen(false), 100);
  };

  return (
    <motion.div
      ref={wrapperRef}
      role="button"
      tabIndex={0}
      aria-describedby={`task-node-${node.id}-description`}
      className={`absolute rounded-xl focus-visible:z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1118] hover:z-40 ${isDiamond ? 'z-[9]' : 'z-10'}`}
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
      onBlur={hideTooltip}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openTooltip();
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          setTooltipOpen(false);
        }
      }}
      onPointerDown={(event) => {
        if (event.pointerType !== 'mouse') {
          event.preventDefault();
          event.stopPropagation();
          if (!tooltipOpen) positionTooltip();
          setTooltipOpen((open) => !open);
        }
      }}
    >
      {isDiamond ? (
        <div
          className="flex h-full w-full rotate-45 items-center justify-center rounded-xl border bg-[#11121A]/95"
          style={{
            borderColor: `${lane.color}8C`,
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
            borderColor: `${lane.color}8C`,
            boxShadow: `0 0 18px ${lane.color}20`,
          }}
        >
          {node.label}
        </div>
      )}
      <span id={`task-node-${node.id}-description`} className="sr-only">
        {node.tooltip.technical}. {node.tooltip.plain}
      </span>
      <AnimatePresence>
        {tooltipOpen && (
          <TaskNodeTooltip
            node={node}
            lane={lane}
            placement={tooltipPlacement}
            align={tooltipAlign}
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
  placement: TooltipPlacement;
  align?: TooltipAlign;
}) {
  const placementClass = placement === 'bottom' ? 'top-full mt-3' : 'bottom-full mb-3';
  const alignClassByAlign: Record<TooltipAlign, string> = {
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0',
    'outside-left': 'right-[calc(100%-80px)]',
    'outside-right': 'left-full ml-3',
  };
  const alignClass = alignClassByAlign[align];

  return (
    <motion.div
      data-task-node-tooltip
      className={`pointer-events-none absolute ${placementClass} ${alignClass} z-[80] w-[380px] max-w-[calc(100vw-2rem)] rounded-xl border bg-[#0B0D13]/95 p-5 text-left shadow-2xl backdrop-blur-md`}
      style={{ borderColor: `${lane.color}B3`, boxShadow: `0 18px 42px rgba(0,0,0,0.42), 0 0 26px ${lane.color}38` }}
      initial={{ opacity: 0, scale: 0.96, y: placement === 'bottom' ? -4 : 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: placement === 'bottom' ? -4 : 4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <p className="font-mono text-base leading-relaxed tracking-wide text-white/70">{node.tooltip.technical}</p>
      <p className="mt-3 text-lg leading-relaxed text-white/95">{node.tooltip.plain}</p>
    </motion.div>
  );
}

function getTaskNode(id: string, nodes: TaskNode[]): TaskNode {
  const node = nodes.find((item) => item.id === id);
  if (!node) throw new Error(`Missing task node: ${id}`);
  return node;
}

function getTaskLane(id: TaskLaneId): TaskLane {
  return taskLanes.find((lane) => lane.id === id) || taskLanes[0];
}

function buildTaskEdgePath(edge: TaskEdge, nodes: TaskNode[]) {
  const source = getTaskNode(edge.from, nodes);
  const target = getTaskNode(edge.to, nodes);
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

function calculateTaskTooltipPosition(wrapper: HTMLDivElement | null): {
  placement: TooltipPlacement;
  align: TooltipAlign;
} {
  if (!wrapper) return { placement: 'top', align: 'center' };

  const graph = wrapper.closest<HTMLElement>('[data-task-flow-graph]');
  const nodeRect = wrapper.getBoundingClientRect();
  const boundaryRect = graph?.getBoundingClientRect() ?? document.documentElement.getBoundingClientRect();
  const gap = 16;
  const spaceAbove = nodeRect.top - boundaryRect.top;
  const spaceBelow = boundaryRect.bottom - nodeRect.bottom;
  const placement =
    spaceAbove >= TASK_TOOLTIP_HEIGHT + gap || spaceAbove >= spaceBelow ? 'top' : 'bottom';

  const centerX = nodeRect.left + nodeRect.width / 2;
  const centeredLeft = centerX - TASK_TOOLTIP_WIDTH / 2;
  const centeredRight = centerX + TASK_TOOLTIP_WIDTH / 2;
  let align: TooltipAlign = 'center';

  if (centeredLeft < boundaryRect.left + gap) {
    align = 'left';
  } else if (centeredRight > boundaryRect.right - gap) {
    align = 'right';
  }

  return { placement, align };
}

function calculateViewportTooltipAlign(wrapper: HTMLDivElement | null): TooltipAlign {
  if (!wrapper) return 'center';

  const nodeRect = wrapper.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  const tooltipWidth = Math.min(TASK_TOOLTIP_WIDTH, viewportWidth - MOBILE_TOOLTIP_MARGIN * 2);
  const centerX = nodeRect.left + nodeRect.width / 2;
  const centeredLeft = centerX - tooltipWidth / 2;
  const centeredRight = centerX + tooltipWidth / 2;

  if (centeredLeft < MOBILE_TOOLTIP_MARGIN) return 'left';
  if (centeredRight > viewportWidth - MOBILE_TOOLTIP_MARGIN) return 'right';
  return 'center';
}

const architectureActivityStyles = [
  { text: 'text-cyan-300', border: 'border-cyan-400/60', bg: 'bg-cyan-400/[0.14]', dot: 'bg-cyan-300', glow: 'shadow-[0_0_14px_rgba(34,211,238,0.65)]' },
  { text: 'text-emerald-300', border: 'border-emerald-400/60', bg: 'bg-emerald-400/[0.14]', dot: 'bg-emerald-300', glow: 'shadow-[0_0_14px_rgba(52,211,153,0.65)]' },
  { text: 'text-violet-300', border: 'border-violet-400/65', bg: 'bg-violet-400/[0.16]', dot: 'bg-violet-300', glow: 'shadow-[0_0_14px_rgba(167,139,250,0.65)]' },
  { text: 'text-amber-300', border: 'border-amber-400/60', bg: 'bg-amber-400/[0.16]', dot: 'bg-amber-300', glow: 'shadow-[0_0_14px_rgba(251,191,36,0.65)]' },
  { text: 'text-white/75', border: 'border-white/40', bg: 'bg-white/[0.10]', dot: 'bg-white/70', glow: 'shadow-[0_0_14px_rgba(255,255,255,0.35)]' },
];

const architectureActivityIcons: Record<ArchitectureIconHint, typeof FileText> = {
  form: FileText,
  sms: MessageSquare,
  phone: Phone,
  email: Mail,
  claude: Brain,
  search: Search,
  link: Link2,
  lock: Lock,
};

function ServiceArchitecturePanel({
  layers,
  activities,
  paused,
}: {
  layers: ArchitectureLayer[];
  activities: ArchitectureActivityEntry[][];
  paused: boolean;
}) {
  const [activityIndices, setActivityIndices] = useState(() => layers.map(() => 0));
  const [openMobileHistoryLayer, setOpenMobileHistoryLayer] = useState<number | null>(null);

  useEffect(() => {
    setActivityIndices(layers.map(() => 0));
    setOpenMobileHistoryLayer(null);
  }, [layers]);

  useEffect(() => {
    if (paused) return;

    const intervals: ReturnType<typeof setInterval>[] = [];
    const timers = activities.map((entries, layerIndex) =>
      setTimeout(() => {
        if (!entries.length) return;

        setActivityIndices((current) =>
          current.map((value, index) => (index === layerIndex ? (value + 1) % entries.length : value))
        );

        intervals[layerIndex] = setInterval(() => {
          setActivityIndices((current) =>
            current.map((value, index) => (index === layerIndex ? (value + 1) % entries.length : value))
          );
        }, 4000);
      }, layerIndex * 800)
    );

    return () => {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [activities, paused]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="flex min-h-0 flex-col justify-center overflow-visible lg:h-full"
    >
      <div
        className="relative flex min-h-0 flex-col items-center justify-center overflow-visible rounded-3xl border border-violet-400/20 bg-[#0E1118] px-3 py-1 md:px-5 lg:h-full"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 48%, rgba(139,92,246,0.14), transparent 38%), linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 42px 42px, 42px 42px',
        }}
      >
        <ArchitectureEndpoint label="Request enters" delay={0} />
        <ArchitectureConnector id="entry" index={0} />

        {layers.map((layer, index) => (
          <div key={layer.name} className="flex w-full flex-col items-center">
            <ArchitectureFlowNode
              layer={layer}
              index={index}
              activity={activities[index]?.[activityIndices[index] || 0] || activities[index]?.[0]}
              activityHistory={activities[index] || []}
              openMobileHistoryLayer={openMobileHistoryLayer}
              onToggleMobileHistory={(layerIndex) =>
                setOpenMobileHistoryLayer((current) => (current === layerIndex ? null : layerIndex))
              }
            />
            <ArchitectureConnector
              id={`layer-${index}`}
              index={index + 1}
              bidirectional={index === 1}
            />
          </div>
        ))}

        <ArchitectureEndpoint label="Decision delivered" delay={1.05} />
      </div>
    </motion.div>
  );
}

function ArchitectureEndpoint({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-white/45"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.24, ease: 'easeOut' }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_14px_rgba(167,139,250,0.85)]" />
      {label}
    </motion.div>
  );
}

function ArchitectureFlowNode({
  layer,
  index,
  activity,
  activityHistory,
  openMobileHistoryLayer,
  onToggleMobileHistory,
}: {
  layer: ArchitectureLayer;
  index: number;
  activity?: ArchitectureActivityEntry;
  activityHistory: ArchitectureActivityEntry[];
  openMobileHistoryLayer: number | null;
  onToggleMobileHistory: (layerIndex: number) => void;
}) {
  const style = architectureActivityStyles[index] || architectureActivityStyles[0];

  return (
    <motion.div
      role="region"
      aria-label={`${layer.name} - ${layer.plain}`}
      className={`relative mb-4 w-full max-w-[1160px] rounded-xl border border-violet-400/55 bg-[#11121A]/95 px-3 py-3 transition-all duration-200 hover:z-[100] hover:border-violet-400/75 focus-within:z-[100] md:mb-0 md:py-2 lg:h-[72px] lg:overflow-visible ${openMobileHistoryLayer === index ? 'z-[100]' : 'z-10'}`}
      style={{ boxShadow: '0 0 24px rgba(139,92,246,0.12)' }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: 0.15 + index * 0.15, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ scale: 1.005 }}
    >
      <div className="grid h-full gap-2 md:grid-cols-[minmax(0,0.98fr)_1px_minmax(360px,0.86fr)] md:items-center">
        <div className="grid min-w-0 gap-3 md:grid-cols-[240px_minmax(0,1fr)] md:items-center">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-white/45">
              Layer {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="text-base font-medium leading-tight text-white/90">{layer.name}</h3>
          </div>

          <div className="min-w-0">
            <p className="line-clamp-2 whitespace-normal break-words text-sm leading-snug text-white/75 md:line-clamp-1">{layer.plain}</p>
            <p className="mt-0.5 line-clamp-2 whitespace-normal break-words font-mono text-xs leading-snug tracking-wide text-white/55 md:line-clamp-1">{layer.technical}</p>
          </div>
        </div>

        <div className="hidden h-full w-px bg-white/10 md:block" aria-hidden="true" />

        {activity && (
          <ArchitectureActivityPanel
            entry={activity}
            history={activityHistory}
            layerIndex={index}
            style={style}
            isHistoryOpenMobile={openMobileHistoryLayer === index}
            onToggleMobileHistory={onToggleMobileHistory}
          />
        )}
      </div>
    </motion.div>
  );
}

function ArchitectureActivityPanel({
  entry,
  history,
  layerIndex,
  style,
  isHistoryOpenMobile,
  onToggleMobileHistory,
}: {
  entry: ArchitectureActivityEntry;
  history: ArchitectureActivityEntry[];
  layerIndex: number;
  style: (typeof architectureActivityStyles)[number];
  isHistoryOpenMobile: boolean;
  onToggleMobileHistory: (layerIndex: number) => void;
}) {
  const Icon = architectureActivityIcons[entry.iconHint] || FileText;
  const [canRenderDesktopHistory, setCanRenderDesktopHistory] = useState(false);
  const mobileHistory = history.slice(0, 3);
  const historyPlacement =
    layerIndex <= 1
      ? 'right-0 top-full mt-2 lg:left-auto lg:right-full lg:top-0 lg:mt-0 lg:mr-3'
      : layerIndex >= 3
        ? 'right-0 top-full mt-2 lg:left-auto lg:right-full lg:bottom-0 lg:top-auto lg:mt-0 lg:mr-3'
      : 'right-0 top-full mt-2 lg:left-auto lg:right-full lg:top-1/2 lg:mt-0 lg:mr-3 lg:-translate-y-1/2';

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const syncDesktopHistory = () => setCanRenderDesktopHistory(mediaQuery.matches);

    syncDesktopHistory();
    mediaQuery.addEventListener('change', syncDesktopHistory);

    return () => mediaQuery.removeEventListener('change', syncDesktopHistory);
  }, []);

  const handleActiveClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window === 'undefined') return;

    const isBelowDesktopGraph = window.matchMedia('(max-width: 1023px)').matches;
    if (!isBelowDesktopGraph) return;

    event.preventDefault();
    event.stopPropagation();
    onToggleMobileHistory(layerIndex);
  };

  return (
    <div
      data-architecture-active-panel
      tabIndex={0}
      aria-expanded={isHistoryOpenMobile}
      aria-live="polite"
      aria-atomic="false"
      aria-label={`Layer ${layerIndex + 1} active log. Tap on mobile or hover on desktop to reveal recent history.`}
      className="group relative flex h-full min-w-0 flex-col justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#11121A]"
    >
      <div
        className={`min-h-[56px] w-full cursor-pointer overflow-hidden rounded-lg border ${style.border} ${style.bg} px-2 py-1 transition-shadow duration-200 md:h-[56px] lg:cursor-default ${isHistoryOpenMobile ? 'ring-1 ring-white/25 shadow-[0_0_18px_rgba(255,255,255,0.10)]' : ''}`}
        onClick={handleActiveClick}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2">
            <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${style.dot} ${style.glow}`} aria-hidden="true" />
            <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${style.text}`}>Active</span>
          </span>
          <span className="truncate font-mono text-[11px] leading-none text-white/55">
            {entry.timestamp} <span className="text-white/20">·</span> <span className="text-white/70">{entry.id}</span>
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${entry.timestamp}-${entry.description}`}
            initial={{ opacity: 0.38, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0.38, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="min-w-0"
          >
            <p
              data-architecture-active-description
              className="mt-1 line-clamp-2 text-sm italic leading-tight text-white/85 md:line-clamp-1"
            >
              {entry.description}
            </p>
            <p className={`mt-0.5 flex min-w-0 items-center gap-1.5 truncate font-mono text-[11px] leading-none ${style.text}`}>
              <Icon size={12} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
              <span className="truncate">{entry.source}</span>
              <span className="text-white/25">·</span>
              <span className="truncate text-white/65">{entry.metrics}</span>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {isHistoryOpenMobile && (
          <motion.div
            key="mobile-history"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeInOut' }}
            className="mt-2 w-full overflow-hidden lg:hidden"
          >
            <div className={`rounded-lg border ${style.border} bg-[#070A10]/95 p-3 text-left shadow-[0_12px_30px_rgba(0,0,0,0.34)]`}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${style.text}`}>
                  Log History
                </span>
                <span className="font-mono text-[11px] text-white/45">Last 3 events</span>
              </div>
              <div className="grid gap-1.5">
                {mobileHistory.map((item) => {
                  const HistoryIcon = architectureActivityIcons[item.iconHint] || FileText;

                  return (
                    <div
                      key={`${item.timestamp}-${item.description}`}
                      className="grid gap-1.5 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2"
                    >
                      <p className="font-mono text-[11px] leading-snug text-white/60">
                        {item.timestamp}
                        <span className="px-1.5 text-white/25">·</span>
                        <span className="text-white/75">{item.id}</span>
                      </p>
                      <p className="text-sm italic leading-snug text-white/[0.88]">
                        {item.description}
                      </p>
                      <p className={`flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-[11px] leading-snug ${style.text}`}>
                        <HistoryIcon size={12} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
                        <span>{item.source}</span>
                        <span className="text-white/25">·</span>
                        <span className="break-words text-white/65">{item.metrics}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {canRenderDesktopHistory && (
        <div
          data-architecture-log-history
          className={`pointer-events-none absolute ${historyPlacement} z-[120] hidden max-h-[300px] w-[min(440px,calc(100vw-3rem))] overflow-y-auto rounded-xl border ${style.border} bg-[#070A10] p-3 text-left opacity-0 shadow-[0_18px_44px_rgba(0,0,0,0.55),0_0_28px_rgba(139,92,246,0.24)] backdrop-blur-md transition-opacity duration-200 lg:block lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 xl:w-[560px]`}
        >
          <div className="mb-2 flex items-center justify-between gap-4">
            <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${style.text}`}>
              Log History
            </span>
            <span className="font-mono text-xs text-white/45">Last {history.length} events</span>
          </div>
          <div className="grid gap-1.5">
            {history.map((item) => {
              const HistoryIcon = architectureActivityIcons[item.iconHint] || FileText;

              return (
                <div
                  key={`${item.timestamp}-${item.description}`}
                  className="grid gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-1.5 md:grid-cols-[120px_minmax(0,1fr)_minmax(0,160px)]"
                >
                  <p className="font-mono text-xs leading-snug text-white/60">
                    {item.timestamp}
                    <span className="px-1.5 text-white/25">·</span>
                    <span className="text-white/75">{item.id}</span>
                  </p>
                  <p className="text-sm italic leading-snug text-white/[0.88]">
                    {item.description}
                  </p>
                  <p className={`flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-xs leading-snug ${style.text}`}>
                    <HistoryIcon size={13} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
                    <span>{item.source}</span>
                    <span className="text-white/25">·</span>
                    <span className="break-words text-white/65">{item.metrics}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <span className="sr-only">Layer {layerIndex + 1} active activity</span>
    </div>
  );
}

function ArchitectureConnector({
  id,
  index,
  bidirectional = false,
  hidden = false,
}: {
  id: string;
  index: number;
  bidirectional?: boolean;
  hidden?: boolean;
}) {
  if (hidden) return <div className="h-2" aria-hidden="true" />;

  const primaryPathId = `architecture-flow-${id}-down`;
  const returnPathId = `architecture-flow-${id}-up`;
  const delay = 0.28 + index * 0.15;

  return (
    <div
      className={`relative hidden h-1.5 w-full max-w-[860px] items-center justify-center md:flex ${bidirectional ? 'my-px' : ''}`}
      aria-hidden="true"
    >
      <svg className="h-full w-32 overflow-visible" viewBox="0 0 128 20" fill="none">
        <defs>
          <filter id={`architecture-pulse-glow-${id}`} x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.path
          id={primaryPathId}
          d={bidirectional ? 'M 54 0 C 48 6, 48 14, 54 20' : 'M 64 0 C 64 6, 64 14, 64 20'}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay, duration: 0.28, ease: 'easeOut' }}
        />
        <circle r="3.2" fill="#A78BFA" opacity="0" filter={`url(#architecture-pulse-glow-${id})`}>
          <animate
            attributeName="opacity"
            values="0;0.95;0.95;0"
            keyTimes="0;0.16;0.84;1"
            dur={`${2.1 + (index % 3) * 0.18}s`}
            begin={`${1.2 + index * 0.12}s`}
            repeatCount="indefinite"
          />
          <animateMotion
            dur={`${2.1 + (index % 3) * 0.18}s`}
            begin={`${1.2 + index * 0.12}s`}
            repeatCount="indefinite"
          >
            <mpath href={`#${primaryPathId}`} />
          </animateMotion>
        </circle>

        {bidirectional && (
          <>
            <motion.path
              id={returnPathId}
              d="M 74 20 C 80 14, 80 6, 74 0"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: delay + 0.06, duration: 0.28, ease: 'easeOut' }}
            />
            <circle r="3.2" fill="#C4B5FD" opacity="0" filter={`url(#architecture-pulse-glow-${id})`}>
              <animate
                attributeName="opacity"
                values="0;0.9;0.9;0"
                keyTimes="0;0.16;0.84;1"
                dur="2.35s"
                begin={`${1.38 + index * 0.12}s`}
                repeatCount="indefinite"
              />
              <animateMotion dur="2.35s" begin={`${1.38 + index * 0.12}s`} repeatCount="indefinite">
                <mpath href={`#${returnPathId}`} />
              </animateMotion>
            </circle>
          </>
        )}
      </svg>
      {bidirectional && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden w-56 -translate-x-1/2 -translate-y-1/2 justify-between text-[0.58rem] uppercase tracking-[0.18em] text-white/25 md:flex">
          <span>queries</span>
          <span>returns</span>
        </div>
      )}
    </div>
  );
}

function HeadlineKpiTile({ kpi, active }: { kpi: HeadlineKpi; active: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
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
        <div className="flex items-baseline justify-center gap-1 text-center text-5xl leading-none md:text-8xl">
          {kpi.prefix && <span className="font-display text-3xl text-emerald-300 md:text-6xl">{kpi.prefix}</span>}
          <span className="font-display text-white">
            <CountUp value={kpi.value} duration={1.5} active={active} />
          </span>
          {kpi.suffix && <span className="font-display text-3xl text-emerald-300 md:text-6xl">{kpi.suffix}</span>}
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
      animate={{ opacity: 1, y: 0 }}
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
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/55">{label}</p>
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
