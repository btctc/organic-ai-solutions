---
version: alpha
name: Organic AI Solutions
description: The house design system for Organic AI Solutions — Dallas-based AI consulting firm. Confident, considered, deliberately not-a-tech-company. This file is the source of truth for organicaisolutions.ai and the reference implementation OAS uses on every client engagement.

colors:
  # Core palette — high-contrast neutrals, single accent, soft surface
  primary: "#0F1310"           # Deep ink — primary text, headlines, dark surfaces
  secondary: "#5C6661"         # Slate green — borders, captions, metadata
  tertiary: "#B5421B"          # Burnt clay — single interaction accent, primary CTAs only
  neutral: "#F5F2ED"           # Warm bone — page background, organic foundation
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
- **Tertiary (#B5421B) — Burnt Clay:** The sole driver of interaction. Used **only** for the single most important action per screen (primary button hover, link underline on hover, the active state of a critical control). Never for icons, never decoratively, never two on the same screen.
- **Neutral (#F5F2ED) — Warm Bone:** The page foundation. Provides organic warmth against pure-white content cards. This color is non-negotiable — it's the single most important brand decision in the system. Pure white is rejected as the page background.
- **Surface (#FFFFFF):** Pure white reserved for content cards, modals, and the chatbot panel — the moments where information density goes up and contrast needs to be maximized.
- **Surface-muted (#EBE7E0):** A halfstep between bone and white. Used for hover states on neutral elements, subtle dividers, and section banding when the design needs structure without lines.
- **Error (#A8321A) and Success (#3D5A3F):** Reserved for true state communication only. Never used decoratively. Never used as accent colors in marketing surfaces.

**WCAG:** Primary on neutral = 14.8:1 (AAA). Tertiary on neutral = 5.0:1 (AA pass for normal text). Bone-on-tertiary (button-primary-hover) = 5.0:1 (AA pass). Secondary on neutral = 4.7:1 (AA pass).

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

- The page background is bone (`#F5F2ED`).
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

## Do's and Don'ts

- **Do** use the burnt clay accent only on the single most important action per screen. One per screen. Never two.
- **Do** use bone (`#F5F2ED`) as the page background everywhere except the admin dashboard. Pure white as a page background is rejected.
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
