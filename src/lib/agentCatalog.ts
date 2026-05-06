export type MarginTier = 'A' | 'B' | 'C';
export type PricingTier = 'Starter' | 'Pro' | 'AllStar' | 'Enterprise';
export type OpsCost = 'low' | 'medium' | 'high';

export interface OASAgent {
  id: string;
  name: string;
  tagline: string;
  capability: string;
  fitsIndustries: string[];
  fitsPainPoints: string[];
  marginTier: MarginTier;
  pricingTiers: PricingTier[];
  setupHours: number;
  monthlyOpsCost: OpsCost;
}

export const OAS_AGENT_CATALOG: OASAgent[] = [
  {
    id: 'lead-qualifier',
    name: 'Lead Qualifier Agent',
    tagline: 'Never miss an inbound lead.',
    capability:
      'Captures inbound leads from web forms, email, and SMS. Scores them, drafts personalized first responses, and routes hot leads to the right person. Works 24/7 so after-hours leads never go cold.',
    fitsIndustries: [
      'Healthcare & Dental',
      'Home Services',
      'Professional Services',
      'Real Estate & Property Management',
      'Construction & Trades',
      'Automotive & Transportation',
      'Financial Services & Insurance',
      'Education & Coaching',
      'Other / Not listed',
    ],
    fitsPainPoints: [
      'Lead response time',
      'Lead qualification',
      'Lead qualification and intake',
      'Customer communication',
    ],
    marginTier: 'A',
    pricingTiers: ['Starter', 'Pro', 'AllStar', 'Enterprise'],
    setupHours: 4,
    monthlyOpsCost: 'low',
  },
  {
    id: 'reviews-reputation',
    name: 'Reviews & Reputation Agent',
    tagline: 'Turn happy customers into 5-star reviews on autopilot.',
    capability:
      'Sends post-job review requests via SMS and email at the optimal time. Drafts personalized review responses for the owner. Flags negative sentiment for human follow-up before it goes public.',
    fitsIndustries: [
      'Healthcare & Dental',
      'Home Services',
      'Real Estate & Property Management',
      'Restaurants & Hospitality',
      'Retail & E-commerce',
      'Construction & Trades',
      'Fitness, Wellness & Beauty',
      'Automotive & Transportation',
    ],
    fitsPainPoints: [
      'Reviews and reputation',
      'Reviews and referrals',
    ],
    marginTier: 'A',
    pricingTiers: ['Starter', 'Pro', 'AllStar', 'Enterprise'],
    setupHours: 3,
    monthlyOpsCost: 'low',
  },
  {
    id: 'reactivation',
    name: 'Reactivation Agent',
    tagline: 'Wake up dormant customers.',
    capability:
      'Pulls dormant customers from your CRM and sends personalized re-engagement SMS or email in scheduled batches. Tracks responses and books warm leads back onto the calendar.',
    fitsIndustries: [
      'Healthcare & Dental',
      'Home Services',
      'Professional Services',
      'Restaurants & Hospitality',
      'Retail & E-commerce',
      'Fitness, Wellness & Beauty',
      'Automotive & Transportation',
    ],
    fitsPainPoints: [
      'Recurring service reminders',
      'Loyalty and retention',
      'Loyalty and repeat customers',
      'Marketing and follow-up',
      'Marketing and promotions',
    ],
    marginTier: 'A',
    pricingTiers: ['Pro', 'AllStar', 'Enterprise'],
    setupHours: 4,
    monthlyOpsCost: 'low',
  },
  {
    id: 'ops-reporter',
    name: 'Operations Reporter Agent',
    tagline: 'A weekly business pulse delivered to your inbox.',
    capability:
      'Reads your operational data each week and emails the owner a clear KPI digest. Flags anomalies, tracks trends, and surfaces what needs attention without you logging into 5 dashboards.',
    fitsIndustries: [
      'Healthcare & Dental',
      'Home Services',
      'Professional Services',
      'Real Estate & Property Management',
      'Restaurants & Hospitality',
      'Retail & E-commerce',
      'Construction & Trades',
      'Financial Services & Insurance',
      'Other / Not listed',
    ],
    fitsPainPoints: [
      'Reporting and dashboards',
      'Reporting and visibility',
    ],
    marginTier: 'A',
    pricingTiers: ['Pro', 'AllStar', 'Enterprise'],
    setupHours: 3,
    monthlyOpsCost: 'low',
  },
  {
    id: 'quote-builder',
    name: 'Quote Builder Agent',
    tagline: 'Faster, more consistent estimates.',
    capability:
      'Drafts quotes and proposals from your intake data using your prior winning quotes as templates. Cuts proposal turnaround from days to minutes while keeping pricing logic in your control.',
    fitsIndustries: [
      'Home Services',
      'Professional Services',
      'Construction & Trades',
      'Automotive & Transportation',
    ],
    fitsPainPoints: [
      'Quoting and estimates',
      'Proposal and contract drafting',
    ],
    marginTier: 'B',
    pricingTiers: ['Pro', 'AllStar', 'Enterprise'],
    setupHours: 5,
    monthlyOpsCost: 'medium',
  },
  {
    id: 'scheduling-coordinator',
    name: 'Scheduling Coordinator Agent',
    tagline: 'Calendar conflicts solved before they happen.',
    capability:
      'Manages bookings, confirmations, and reschedules over text and email. Detects conflicts, suggests alternatives, and sends automated reminders so no-shows drop.',
    fitsIndustries: [
      'Healthcare & Dental',
      'Home Services',
      'Professional Services',
      'Real Estate & Property Management',
      'Restaurants & Hospitality',
      'Construction & Trades',
      'Fitness, Wellness & Beauty',
      'Automotive & Transportation',
      'Education & Coaching',
    ],
    fitsPainPoints: [
      'Scheduling and no-shows',
      'Scheduling and dispatch',
      'Showings and scheduling',
      'Reservations and bookings',
      'Scheduling and operations',
      'Scheduling staff',
    ],
    marginTier: 'B',
    pricingTiers: ['Pro', 'AllStar', 'Enterprise'],
    setupHours: 5,
    monthlyOpsCost: 'medium',
  },
  {
    id: 'onboarding',
    name: 'Onboarding Agent',
    tagline: 'New clients up and running in minutes, not days.',
    capability:
      'Walks new clients through intake forms, contracts, payment setup, and a welcome sequence. Keeps onboarding consistent across every client without owner involvement.',
    fitsIndustries: [
      'Healthcare & Dental',
      'Professional Services',
      'Real Estate & Property Management',
      'Fitness, Wellness & Beauty',
      'Financial Services & Insurance',
      'Education & Coaching',
    ],
    fitsPainPoints: [
      'Onboarding new clients',
      'Intake paperwork',
      'Patient communication and follow-up',
    ],
    marginTier: 'B',
    pricingTiers: ['Pro', 'AllStar', 'Enterprise'],
    setupHours: 5,
    monthlyOpsCost: 'medium',
  },
  {
    id: 'knowledge-base',
    name: 'Knowledge Base Agent',
    tagline: 'Your team\'s answer to "where is that document?"',
    capability:
      'Answers staff and customer FAQs from your existing docs and SOPs. Lives in Slack, Teams, or your website. Keeps everyone aligned without asking the owner the same question 10 times a day.',
    fitsIndustries: [
      'Healthcare & Dental',
      'Professional Services',
      'Real Estate & Property Management',
      'Construction & Trades',
      'Financial Services & Insurance',
      'Education & Coaching',
      'Other / Not listed',
    ],
    fitsPainPoints: [
      'Internal knowledge and SOPs',
      'Customer service and FAQs',
    ],
    marginTier: 'B',
    pricingTiers: ['Pro', 'AllStar', 'Enterprise'],
    setupHours: 7,
    monthlyOpsCost: 'medium',
  },
  {
    id: 'inbound-phone-sms',
    name: 'Inbound Phone & SMS Agent',
    tagline: 'A 24/7 front desk that never misses a call.',
    capability:
      'Answers inbound calls and texts when you\'re busy or after hours. Books appointments, qualifies leads, escalates urgent issues to your phone. Voice operating cost passes through transparently.',
    fitsIndustries: [
      'Healthcare & Dental',
      'Home Services',
      'Real Estate & Property Management',
      'Restaurants & Hospitality',
      'Construction & Trades',
      'Automotive & Transportation',
    ],
    fitsPainPoints: [
      'Lead response time',
      'Staffing and front desk load',
      'Customer communication',
      'Tenant communication',
    ],
    marginTier: 'C',
    pricingTiers: ['AllStar', 'Enterprise'],
    setupHours: 10,
    monthlyOpsCost: 'high',
  },
  {
    id: 'billing-collections',
    name: 'Billing & Collections Agent',
    tagline: 'Get paid faster without the awkward calls.',
    capability:
      'Sends invoice reminders, chases overdue payments, and reconciles transactions against your accounting system. Reduces days-sales-outstanding without burning the owner\'s evenings.',
    fitsIndustries: [
      'Home Services',
      'Professional Services',
      'Construction & Trades',
      'Financial Services & Insurance',
    ],
    fitsPainPoints: [
      'Billing and collections',
    ],
    marginTier: 'C',
    pricingTiers: ['AllStar', 'Enterprise'],
    setupHours: 8,
    monthlyOpsCost: 'high',
  },
];

const MARGIN_TIER_WEIGHT: Record<MarginTier, number> = {
  A: 3,
  B: 2,
  C: 1,
};

interface ScoredAgent {
  agent: OASAgent;
  score: number;
}

/**
 * Picks the top N agents from the catalog for a given lead.
 * Scoring: industry match + pain-point match + margin-tier weight.
 * Margin tier is intentionally weighted higher so we recommend
 * cheaper-to-deploy agents in the auto-email; tier-C agents are
 * held back as upsells on the sales call.
 */
export function pickTopAgentsForLead(
  industry: string | null | undefined,
  painPoints: string[],
  n = 3
): OASAgent[] {
  const normalizedPainPoints = painPoints.map((p) => p.toLowerCase().trim());

  const scored: ScoredAgent[] = OAS_AGENT_CATALOG.map((agent) => {
    let score = 0;

    if (industry && agent.fitsIndustries.includes(industry)) {
      score += 5;
    }

    for (const point of normalizedPainPoints) {
      const match = agent.fitsPainPoints.some(
        (fit) => fit.toLowerCase() === point || fit.toLowerCase().includes(point) || point.includes(fit.toLowerCase())
      );
      if (match) score += 3;
    }

    score += MARGIN_TIER_WEIGHT[agent.marginTier];

    return { agent, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, n).map((s) => s.agent);
}

export function getAgentById(id: string): OASAgent | undefined {
  return OAS_AGENT_CATALOG.find((a) => a.id === id);
}
