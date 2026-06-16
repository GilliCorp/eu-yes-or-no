# EU – Yes or No? — Design Spec

**Date:** 2026-06-16
**Status:** Approved (design); ready for implementation planning
**Repo:** `git@github.com:GilliCorp/eu-yes-or-no.git`

## Purpose

A plain-language website explaining **what Iceland would gain and lose by joining the EU**, aimed at
smart-but-not-policy-expert people who don't have months to research the topic. Strictly neutral,
heavily sourced.

### The core reframing

Iceland is already **~2/3 "in"** the EU through the **EEA agreement (since 1994)** and **Schengen** —
it already adopts much of the single-market law (free movement of goods/people/services/capital, most
regulations) but with **no vote** on those rules. So the site's real story is usually **not**
"EU vs. no-EU." It's the narrower, more honest **"EEA member vs. full EU member" — what *actually*
changes.** The big live differences: fisheries (Common Fisheries Policy), agriculture, currency
(króna vs. euro), a seat/vote at the table, and sovereignty/self-determination.

A crucial asset for neutrality: **Iceland already negotiated this for real.** It was an official EU
candidate 2010–2013, actually opened negotiation chapters, then froze the process and formally
withdrew the application in 2015. So there is **primary-source documentation of exactly what was on
the table**, chapter by chapter — we are largely *reporting a documented negotiation*, not
speculating.

## Principles

1. **Everyday life is the lens.** Abstract sovereignty arguments bounce off people; "here's what
   happens to your mortgage payment" does not. Most-relevant-to-daily-life content comes first.
2. **No claim without a source.** Neutrality is enforced *structurally* (schema), not by good
   intentions.
3. **Auditable / "call bullshit later."** Every claim is a structured record with sources in git, so
   anyone (including the author in two years) can challenge or correct any single line, with full edit
   history.
4. **Fast and simple.** Static-first, minimal JS.

## Architecture — Approach A: structured content repo + static site

### Tech stack (deliberately boring and fast)

- **Astro** with **content collections**. Dossier schema defined in **Zod** so Astro validates every
  content file at build time — *a topic with a claim but no `sources[]` fails the build.* The
  neutrality rule becomes a compiler error. 🔒
- **TypeScript** throughout.
- The household calculator is a single interactive **island**; Astro ships zero JS for everything else.
- **i18n** via Astro's built-in routing (`/is/...`, `/en/...`) over parallel `is`/`en` fields.
  Bilingual (Icelandic + English).
- **Hosting:** static output on Cloudflare Pages / Netlify / GitHub Pages — free, global, instant.

### Content model — the "dossier" record

Each topic is a **structured data file, not prose.** Parallel `is`/`en` fields throughout:

- `title`, `tldr` (one line), `summary` (plain-language paragraph)
- `today` — what's already true under the EEA/Schengen *now*
- `asMember` — what changes with full membership
- `gains[]` and `losses[]` — each item is `{ claim, sources[], affects: [who] }`
- `uncertain[]` — honestly-flagged unknowns (e.g. "depends on negotiated terms")
- `lastReviewed` date + `confidence` level

**No claim can exist without a `sources[]` entry** — enforced by the Zod schema.

### Topic taxonomy (chapters), everyday-life-first

1. **Your money** — mortgages, interest rates, indexed (verðtryggð) loans, króna vs. euro
2. **Your grocery bill** — food tariffs, customs union, agricultural protection
3. **Your job & prices** — wages, competition, consumer prices, cost of living
4. **Fisheries** — the Common Fisheries Policy (classic Icelandic sticking point)
5. **Farming & rural life**
6. **Sovereignty & a seat at the table** — the EEA "no vote" problem vs. ceding control
7. **Security, energy, currency stability** — the macro backdrop

### Headline feature — "Build your household" calculator

- **Not a fixed nuclear family.** Pick a preset (**live alone 👋**, couple, family, retiree…) *or* go
  fully custom. Single-person is a first-class case, not an afterthought.
- Editable inputs: salary, mortgage size, loan type (indexed vs. non-indexed), monthly groceries, etc.
- Shows **two columns side by side: "Today (EEA)" vs. "As an EU member"** — never a single
  triumphant number.
- Every output shows a **range, not a point estimate**; each input is annotated with its source and
  assumption.
- Permanent, unmissable banner: *"Illustrative scenario based on stated assumptions — not a
  prediction."*
- **Euro adoption shown as conditional and multi-year** (EU membership ≠ instant euro; requires years
  in ERM II + convergence criteria). Pretending otherwise is the fastest way to lose credibility.
- The calculator **model lives in its own sourced data file**: every assumption (interest-rate ranges,
  tariff rates, etc.) is a named constant with a citation, so the math itself is auditable.

> Note: the family-numbers feature is simultaneously the most powerful and the biggest neutrality
> risk — numbers feel like facts, so cherry-picking reads as propaganda. The ranges / dual-column /
> sourced-assumptions design exists specifically to guard against that.

### Cross-cutting trust pages (non-negotiable)

- **Methodology** — how sources are chosen, how "neutral" is defined
- **Sources** index
- Visible **"last reviewed"** dates everywhere

## Research workflow (the answer to "how do I research all this")

Per topic, a repeatable sourced pass against tiered sources:

- **Tier 1 — primary/authoritative:** EEA Agreement & EU treaties (EUR-Lex), the **2010–2013 Iceland
  accession negotiation chapter documents** (the goldmine), Icelandic government impact assessments,
  **Hagstofa** (Statistics Iceland), the **Central Bank of Iceland**, Eurostat.
- **Tier 2 — academic/neutral:** University of Iceland, Centre for Small State Studies, EFTA analyses.
- **Tier 3 — advocacy (both sides, for *framing* not facts):** pro (Já Ísland) and anti (Heimssýn) —
  to fairly represent each camp's strongest argument.
- **Adversarial rule per topic:** explicitly capture the *strongest pro claim* **and** the *strongest
  anti claim*, then verify each against Tier 1. If a claim only survives in advocacy sources, it's
  flagged `uncertain`, not stated as fact.

These research passes can be run with deep-research tooling (fan out sources, fact-check claims
against each other, return a cited structured dossier per topic that drops straight into the schema).

## Build order (vertical slices — see it working early)

0. **Phase 0:** Scaffold Astro + schema + i18n + deploy an empty shell (prove the pipeline).
1. **Phase 1:** One topic — **"Your money"** — end to end, fully sourced. Validates the whole content
   model on the hardest topic.
2. **Phase 2:** The household calculator, wired to that topic's sourced assumptions.
3. **Phase 3:** Remaining topics, one dossier at a time (research pass → record → page).
4. **Phase 4:** Trust pages (Methodology, Sources), English translation pass, polish.

## Open questions / deferred

- Exact hosting target (Cloudflare Pages vs. Netlify vs. GitHub Pages) — decide at Phase 0 deploy.
- Visual design / branding direction — not yet explored.
- Domain name — TBD.
