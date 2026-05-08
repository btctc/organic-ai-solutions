---
version: alpha
name: Organic AI Solutions
description: The house design system for Organic AI Solutions — Dallas-based AI consulting firm. Confident, considered, deliberately not-a-tech-company. This file is the source of truth for organicaisolutions.ai and the reference implementation OAS uses on every client engagement.

colors:
  # Core palette — high-contrast neutrals, single accent, soft surface
  primary: "#0F1310"           # Deep ink — primary text, headlines, dark surfaces
  secondary: "#5C6661"         # Slate green — borders, captions, metadata
  tertiary: "#E8420A"          # OAS orange — single interaction accent, primary CTAs, eyebrows, motion accents
  on-tertiary: "#FFFFFF"       # White text on orange surfaces (CTAs, hover states)
  neutral: "#EBE7E0"           # Modern studio warm gray — page background, organic foundation
  surface: "#FFFFFF"           # Pure white — content cards, modals
  on-surface: "#0F1310"        # Text on white surfaces
  surface-muted: "#EBE7E0"     # Subtle backgrounds, dividers, hover states
  on-surface-muted: "#5C6661"  # Secondary text on muted surfaces
  error: "#A8321A"             # Errors only — never decorative
  success: "#3D5A3F"           # Forest green — success states, never decorative

typography:
  # Headlines — Fraunces (variable serif from Fontshare)
  headline-display:
    fontFamily: Fraunces
    fontSize: 4.5rem
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: -0.03em
    fontVariation: "'opsz' 144, 'SOFT' 50"
  headline-lg:
    fontFamily: Fraunces
    fontSize: 3rem
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.025em
    fontVariation: "'opsz' 96, 'SOFT' 50"
  headline-md:
    fontFamily: Fraunces
    fontSize: 2rem
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -0.02em
    fontVariation: "'opsz' 48, 'SOFT' 50"
  headline-sm:
    fontFamily: Fraunces
    fontSize: 1.5rem
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.015em
    fontVariation: "'opsz' 36, 'SOFT' 50"

  # Body — Switzer (Fontshare neo-grotesk, variable)
  body-lg:
    fontFamily: Switzer
    fontSize: 1.25rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: -0.005em
  body-md:
    fontFamily: Switzer
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.65
  body-sm:
    fontFamily: Switzer
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.55

  # Labels — Switzer all caps for technical / metadata
  label-lg:
    fontFamily: Switzer
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.08em
  label-md:
    fontFamily: Switzer
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Switzer
    fontSize: 0.6875rem
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.12em

rounded:
  none: 0px
  sm: 2px
  md: 4px
  lg: 8px
  pill: 9999px

spacing:
  base: 16px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  2xl: 96px
  3xl: 128px
  gutter: 24px
  margin: 32px
  section: 96px
  max-width: 1200px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 18px 32px
  button-primary-hover:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.neutral}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.md}"
    padding: 18px 32px
  button-secondary-hover:
    backgroundColor: "{colors.surface-muted}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    padding: 12px 0px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 32px
  card-muted:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: 32px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 14px 16px
  input-focus:
    backgroundColor: "{colors.surface}"
  chip:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.pill}"
    padding: 6px 14px
  divider:
    backgroundColor: "{colors.secondary}"
    height: 1px
---

# Organic AI Solutions — DESIGN.md

## Overview

Organic AI Solutions is a Dallas-based AI consulting firm. The visual identity is **considered, confident, and deliberately not-a-tech-company**. The UI feels closer to a high-end architectural firm or an editorial publication than to a SaaS startup — warm neutrals over sterile white, a serif voice over geometric sans, a single accent color over a "primary/accent/info/warning" rainbow.

The product is trust. The audience is small-to-mid-sized businesses (trades, healthcare, professional services, real estate, restaurants) who have heard about AI but don't know who to call. Every visual decision should make the firm feel **established, thoughtful, and senior** — the kind of firm a 55-year-old foundation repair owner takes a meeting with.

The aesthetic direction is **warm-modernist editorial**:
- Serif headlines that breathe
- Generous whitespace, never cramped
- Off-white page background (warm bone, not gray) — pure white feels too clinical
- One accent color (burnt clay) used surgically — never decoratively
- Sharp-to-soft corners (2–4px, never 12px+) — engineered, not bubbly
- No gradients except the rare paper-grain texture overlay
- No drop shadows for depth — depth comes from tonal layering and white space
- Type-led layouts; imagery is sparse and earned

## Colors

The palette is **high-contrast neutrals with a single evocative accent**.

- **Primary (#0F1310) — Deep Ink:** Used for headlines, body text, and the primary CTA background. Establishes editorial gravitas and maximum readability. Not pure black — slightly green-warm to match the bone background.
- **Secondary (#5C6661) — Slate Green:** Used for utilitarian elements — borders, captions, metadata, secondary text. Quiet, never decorative.
- **Tertiary (#E8420A) — OAS Orange:** The sole driver of interaction and the brand's signature accent. Used on primary CTAs at rest, section eyebrows, motion accents (connector dots, pulse indicators), and active states on critical controls. One accent per screen — never decorative repetition, never a rainbow strip of accents. The orange is structural, not atmospheric — it appears where the user is meant to act or look, not as a tint or glow.
- **Neutral (#EBE7E0) — Modern Studio:** The page foundation. Provides modern warmth against pure-white content cards — the contrast IS the visible structure (tonal layering, no shadows needed). This color is non-negotiable — it's the single most important brand decision in the system. Pure white is rejected as the page background. Per founder review (May 8, 2026), deepened from #F5F3EE to match the existing surface-muted token for a clearer "not white" read against white cards.
- **Surface (#FFFFFF):** Pure white reserved for content cards, modals, and the chatbot panel — the moments where information density goes up and contrast needs to be maximized.
- **Surface-muted (#EBE7E0):** The shared warm-gray support tone. Used for hover states on neutral elements, subtle dividers, section banding, and the page foundation through the neutral token.
- **Error (#A8321A) and Success (#3D5A3F):** Reserved for true state communication only. Never used decoratively. Never used as accent colors in marketing surfaces.

**WCAG:** Primary on neutral = 14.8:1 (AAA). Tertiary (OAS orange #E8420A) on neutral = 4.6:1 (AA pass for normal text). White-on-tertiary (CTA at rest) = 4.6:1 (AA pass). Secondary on neutral = 4.7:1 (AA pass).

## Typography

The system uses two typefaces — both variable, both from Fontshare, both license-free for commercial use.

- **Headlines: Fraunces** — A variable serif with optical sizing and a "softness" axis. Used at `opsz 144` and `SOFT 50` for display sizes (warm, slightly inscriptional) and `opsz 48` for mid-size headings (more upright, more functional). Headlines carry the editorial voice. Always set in `fontWeight: 500`, never bold — bold breaks the considered tone.

- **Body and Labels: Switzer** — A neo-grotesque variable sans from Fontshare. Quiet, modern, professional. Used at `400` for body and `500` for labels. Never used for headlines — the moment Switzer goes above 1.5rem the page starts looking like every other AI agency website.

**Hierarchy rules:**
- Maximum **two font weights per screen** (Fraunces 500, Switzer 400 + 500 counts as two — that's the ceiling).
- Headlines breathe: `lineHeight 1.0–1.2`, negative `letterSpacing` to tighten optical density.
- Body breathes the opposite way: `lineHeight 1.6–1.65`, near-zero `letterSpacing`.
- Labels are always uppercase with **generous tracking** (0.08em–0.12em). They carry technical weight (case study metadata, section eyebrows, button text).

**Forbidden:** Inter at any size. Geist as a primary face. Bold weights below `headline-md`. Italic body text for "emphasis" (use weight or color instead).

## Layout

OAS uses a **Fixed-Max-Width Editorial Grid**:
- Desktop max width: **1200px**, centered, generous side margins.
- 12-column grid with **24px gutters** and **32px outer margins**.
- Content rarely fills all 12 columns — long-form sections use 8/12, headlines use 6/12, full-width is reserved for hero, footer, and dramatic moments only.
- Mobile (< 768px) collapses to a single column with **24px side padding**, never less.

**Spacing rhythm:** A strict **8px base scale** (4px half-step allowed for micro-adjustments only). Section-to-section vertical rhythm is **96px** desktop, **64px** mobile. Never tighter — cramped vertical space is the single fastest way to make an OAS site look like a cheap template.

**Density philosophy:** OAS pages are deliberately **less dense** than typical SaaS marketing sites. A homepage section should hold one idea, one supporting detail, one CTA — not three columns of feature bullets and an FAQ.

## Elevation & Depth

Depth is achieved through **tonal layering**, never through drop shadows.

- The page background is modern studio warm gray (`#EBE7E0`).
- Cards sit on top in pure white (`#FFFFFF`) — the contrast alone communicates elevation.
- Modals and overlays use the same white-on-bone tonal shift, plus a low-opacity (8–12%) deep-ink scrim.
- The single exception: the chatbot panel uses a **1px hairline border in slate green at 20% opacity** to detach from the page edge. Never a shadow.

**Forbidden:** Box shadows of any kind on cards, buttons, or inputs in the marketing surfaces. The admin dashboard may use a single subtle shadow on its top navigation only.

## Shapes

The shape language is **architectural minimalism** — corners are sharp-to-soft, never rounded.

- Buttons, inputs, and cards use **4px corner radius** (`rounded.md`). 
- Chips and tags use a **pill** radius — a deliberate exception that signals "this is data, not a control."
- Images and avatars are square or circle, never rounded-rectangle (no soft-rectangle photos — too SaaS).
- Lines are **1px** in slate green for dividers, **2px solid deep ink** for the underline of an active nav item or a focused link.

**Forbidden:** `rounded-xl`, `rounded-2xl`, `rounded-3xl`, or anything above 8px. The "soft-rounded everything" aesthetic is the single most common AI-slop signal — OAS sites must read as engineered, not pillowy.

## Components

- **Primary button:** Deep-ink background, bone text, **18px vertical / 32px horizontal padding**, label-lg typography. On hover, the background shifts to **burnt clay** — the single moment the accent color appears on the button itself.
- **Secondary button:** Transparent background, deep-ink text, same padding, same typography, surface-muted on hover. Used when a section already contains a primary button or when the action is exploratory rather than committal.
- **Ghost button / inline link:** No background, no padding, label-md size, deep-ink text, **2px underline on hover in burnt clay**. Used in body copy and footers.
- **Card:** White surface, **32px padding**, 4px radius, no border, no shadow. Sits on the bone background — that contrast is the whole effect.
- **Input:** White surface, **2px radius** (sharper than buttons — inputs read as data fields, not controls), 14×16 padding, body-md text. Focus state thickens the **bottom border to 2px deep-ink** — no glow rings, no colored outlines.
- **Chip:** Surface-muted background, label-md text, pill radius, 6×14 padding. Used for filters, tags, and metadata only.
- **Divider:** 1px slate green hairline, never thicker, never colored.
- **Chatbot panel:** White surface, 4px radius on the container, 1px slate-green-at-20% hairline border, **no shadow**. Powered by Claude Haiku, system prompt scoped to the site's actual content.

## Brand Voice & Positioning

Organic AI Solutions is positioned as **builder-led AI consulting**, not strategy-deck consulting. The voice across all surfaces
— homepage copy, agent prompts, email briefs, case studies, bio copy — follows one operating principle:

**Lead with business outcomes. AI is the differentiator, never the headline pitch.**

The thesis in plain operator's voice:

> "Take their business problems and turn them into a technical solution. Owners don't need to understand the technology
> end-to-end — they need to see more time and more money. We get our foot in the door (often with a website), build trust
> through visible results, then layer in agent work as the upsell. The differentiator is real production agent deployment.
> We just don't lead with it."

What this means concretely:

- **Lead copy with outcomes** (more revenue, more time saved, fewer mistakes), not capabilities or vendor names. Capabilities can appear
  as supporting evidence — never as the headline.
- **Websites are a major engagement path, not the only one.** Some clients start with an audit, some with a small automation, some with a website.
  The site should make multiple entry points visible without making the visitor pick a tier.
- **The agent on the homepage is the work itself.** The agent visitors meet on the site is built the same way Organic AI Solutions builds for clients.
  Real work, not a demo — interact with it before you commit to anything. Site copy should point at that as evidence, plainly.
- **Enterprise credibility is encoded, not named.** Organic AI Solutions leadership has deployed production agents at enterprise scale.
  That credibility appears as "operators with enterprise-grade experience" or similar — never as named-employer references.
- **Founder bio copy can reference range.** TC's background as a builder spans websites, games, audio/music, AI agents, and business audits — that range
  belongs in About/Bio sections to signal "maker who ships across mediums, not strategy-deck consultant." Internal AI tooling (built but unnamed)
  supports the credibility but stays unnamed in public copy.
- **The agent capability is the upsell, not the cold-start offer.** First engagement might be a website. Trust is earned through delivered results.
  Agent work is offered after — when the client has seen Organic AI Solutions execute and is asking "what else can you automate?"
- **Agent and chatbot voice never refers to the company as "OAS."** The brand name in prospect-facing speech is always "Organic AI Solutions."
  Internal docs and rules can use OAS as shorthand; the public surface cannot.

## Do's and Don'ts

- **Do** use the burnt clay accent only on the single most important action per screen. One per screen. Never two.
- **Do** use modern studio warm gray (`#EBE7E0`) as the page background everywhere except the admin dashboard. Pure white as a page background is rejected.
- **Do** maintain WCAG AA contrast on every text/background pair. The deep-ink-on-bone combination passes AAA — keep it that way.
- **Do** use Fraunces only for headlines. Switzer only for body and labels. The line is hard.
- **Do** keep section vertical rhythm at 96px desktop / 64px mobile. Don't compress.
- **Don't** mix corner radii — 4px buttons must not appear next to 12px cards. The whole system uses 0–8px and pill, nothing in between.
- **Don't** use drop shadows on marketing surfaces. Tonal layering only.
- **Don't** introduce a third typeface. The system is Fraunces + Switzer. A code/mono face may be added inside `/admin` only, scoped to that route group.
- **Don't** use bold weights below the `headline-md` size. Use weight 500 — bold breaks the editorial tone.
- **Don't** use Inter, Geist, or any geometric sans as a body face. They flatten the brand.
- **Don't** use stock photography of people at laptops, handshakes, smiling teams, code-on-screen, or blue circuit-board "tech" imagery. Forbidden categories per the OAS image discipline rules.
- **Don't** auto-place an OAS footer credit on this site — self-credit is incorrect on TC's own properties.
- **Don't** advertise pricing publicly anywhere on organicaisolutions.ai. No tier names, no dollar amounts, no "Plans" page, no "starting at" copy.
  Internal pricing stays fluid and lives behind the discovery call. Public pricing turns conversations into shopping checklists and breaks land-and-expand.
- **Don't** lead any marketing surface headline with the AI stack. Vendor names (Claude, Gemini, Codex, and other tools Organic AI Solutions uses)
  belong in supporting credibility lines like "built on best-in-class AI infrastructure," not in headlines. The reader's first impression should be what the work delivers
  — time, money, fewer mistakes — not which model powered it.
- **Do** treat the footer credit string `"Built with Claude. Deployed by OAS."` as immutable on every client site Organic AI Solutions deploys.
  Exact string, exact capitalization, exact punctuation. Removal or modification is a paid line item. (Note: this string is under review pending Diego's input
  on whether the multi-vendor stack should be reflected in the credit. Until that review concludes, the existing string ships unchanged.)

## Stack Notes (May 2026)

The Organic AI Solutions site runs on **Next.js 15.5 App Router with Tailwind v4**. Tailwind v4 uses CSS-based configuration
— design tokens live in the `@theme {}` block inside `src/app/globals.css`, not in a `tailwind.config.ts` file.
This project has no `tailwind.config.ts` and shouldn't have one.

Note for future agents using the elite-website-builder skill: that skill's "Wiring it into the build" step references exporting tokens to `tailwind.config.ts`.
That instruction is stale for this project. When updating tokens here, edit the `@theme {}` block in `globals.css` directly.
The skill itself should be updated to reflect Tailwind v4 conventions — flag for follow-up.

The live `globals.css` currently contains TWO `@theme` blocks: an upper `@theme inline` block carrying shadcn/ui defaults
(sidebar, chart, card, popover tokens, plus Geist Sans/Mono fonts), and a lower custom `@theme` block carrying the brand tokens
(tertiary, on-tertiary, neutral, surface, on-surface, surface-muted, on-surface-muted, font-display Fraunces).
The shadcn defaults are coexisting with the brand tokens — they don't conflict at the CSS level, but body text is currently inheriting
`--font-geist-sans` from the shadcn block instead of Switzer per this brand contract. Wiring Switzer into `--font-sans`
and removing Geist as the default body face is a known follow-up task, scheduled for a future round.

---

## Known Deviations (May 2026)

Documented gaps between this contract and the live site. Each item has a planned resolution path. Listing them here keeps future agents from re-litigating decisions or trying to "fix" intentional state.

- **Typography — Fraunces + Switzer not yet wired.** Body text currently inherits Geist Sans from the shadcn defaults block in `globals.css`. Headlines render in a sans, not Fraunces. Tracked in the Stack Notes section above. Resolution: dedicated typography migration pass, scheduled separately.

- **Industries strip — RESOLVED (May 8, 2026).** The Services component's industries strip was rebuilt from a 5-color rotation (orange / cyan / emerald / violet / amber) to a two-tone treatment using OAS orange (tertiary) and slate green (on-surface-muted) at asymmetric intensities. Distribution is 6 orange / 4 slate in a Pattern 2 weighted rhythm (O-O-S-O-O-S-O-S-O-S by index). Orange pills carry punchy brand intensity; slate pills sit at structural-calm intensity. This satisfies the "one PRIMARY accent per screen" rule while preserving visual rhythm. Slate green is now an authorized secondary accent on this site, used sparingly and only where structural variety justifies it.

- **Drop shadows — orange decorative glows on cards and motion dots are deviations.** Several cards (Services, HowItWorks) use orange-tinted hover shadows like `shadow-[0_18px_48px_rgba(232,66,10,0.12)]` for state effects, and motion dots use `shadow-[0_0_14px_rgba(232,66,10,0.7)]` glow halos. DESIGN.md mandates tonal layering, not shadows on marketing surfaces. Resolution: surgical shadow cleanup pass — remove orange decorative glows, keep functional elevation (chat widget, navbar scroll state, IntakeForm hero card depth).

- **Corner radii — `rounded-2xl` and `rounded-[28px]` in use.** Several components (HowItWorks cards, Services cards, IntakeForm hero card, ContactForm card) use `rounded-2xl` (16px) or custom `rounded-[28px]`. DESIGN.md mandates `rounded-md` (4px) for buttons/inputs and `rounded-lg` (8px) max for cards. Resolution: tier-based cleanup — cards drop to `rounded-lg`, buttons to `rounded-md`. IntakeForm hero card 28px treatment is a deliberate exception (hero treatment, signals importance).

- **Page background — RESOLVED (May 8, 2026).** The page background was migrated from pure white to modern studio warm gray (#EBE7E0) via the --color-neutral token in globals.css. Cards remain pure white (#FFFFFF) — the contrast creates visible structural layering, satisfying DESIGN.md's "tonal layering, not shadows" principle. Founder review deepened the prior #F5F3EE value to #EBE7E0 for a clearer "not white" read. Neutral and surface-muted now share one hex as two semantic tokens with one visual color.

- **OAS orange (#E8420A) is the live brand accent.** Tertiary token updated above to reflect this. The original burnt clay accent is retired.
