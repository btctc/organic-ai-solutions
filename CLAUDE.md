# CLAUDE.md — Organic AI Solutions

> **Design system: see [DESIGN.md](./DESIGN.md) at the project root. Follow tokens verbatim — colors, typography, spacing, components.**

This is the marketing site for **Organic AI Solutions** (organicaisolutions.ai) — TC's Dallas-based AI consulting firm. The site is the firm's own front door. Every visual decision should make OAS feel **established, thoughtful, and senior** — not like a tech startup. The aesthetic is warm-modernist editorial: serif headlines, warm bone background (never pure white as page bg), single accent color used surgically.

## Project context

- **Owner:** Terrence Crawford (CEO, non-technical) — prefers plain-language explanations, copy-paste-ready commands, step-by-step instructions, surgical changes (smallest diff that achieves the outcome)
- **Co-founder / CTO:** Diego Templeton (`diegotempleton26` on GitHub) — handles technical infrastructure
- **Domain:** organicaisolutions.ai
- **Hosting:** Vercel (auto-deploys on push to `main`)
- **Repo on TC's Mac:** `~/organic-ai-solutions/`

## Stack (locked — do NOT migrate without explicit authorization)

- **Framework:** Next.js 14 (App Router) — TypeScript
- **Styling:** Tailwind CSS — tokens come from `DESIGN.md` (export with `npx @google/design.md export --format json-tailwind DESIGN.md`)
- **Motion:** Motion (formerly Framer Motion)
- **Hosting:** Vercel
- **Data + Auth:** Supabase
- **Email:** Resend
- **AI:** Claude API (Haiku for chatbots, Sonnet for content)
- **Analytics:** Vercel Analytics + PostHog free tier
- **Icons:** Lucide
- **Fonts:** Fraunces (Fontshare, headlines) + Switzer (Fontshare, body) — see DESIGN.md

## Common commands

```bash
# Local dev
npm run dev              # http://localhost:3000

# Production build (run locally before pushing)
npm run build
npm run start

# Lint the design system
npx @google/design.md lint DESIGN.md

# Deploy
git push                 # Vercel auto-deploys on push to main
```

## Hard rules for any AI agent working in this repo

1. **Read DESIGN.md before generating any UI.** Tokens are normative. Prose explains intent.
2. **Smallest possible diff.** If TC asks for a surgical change, change only the exact lines requested. Never bundle unrelated improvements.
3. **No OAS footer credit on this site.** This is OAS's own site — self-credit is incorrect.
4. **Off-limits without explicit mention:** `tailwind.config.*`, `package.json`, `.env*`, auth flows, payment flows, database schema, anything touching production data.
5. **Secrets are never entered in chat.** `.env.local` is edited via `nano .env.local` or interactive terminal prompts only. Never paste API keys into a chat.
6. **Run `vercel-predeploy-check` before any push to main.** No exceptions.
7. **Anti-AI-slop rules apply absolutely:** No Inter as default, no purple gradients on white, no uniform 12px+ rounded corners on every element, no generic stock photography (handshakes, smiling teams at laptops, code-on-screen).

## When something's unclear

Ask TC directly. He prefers one clear question over five hedged ones. Default to surgical when scope is ambiguous.

---

*This file is read by Claude Code, Cursor, and any other AI coding agent on session start. Keep it tight. Update only when the stack or rules genuinely change.*
