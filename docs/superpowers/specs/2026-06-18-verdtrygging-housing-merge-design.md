# Design — Merge "Verðtrygging" into the Home-loans chapter

**Date:** 2026-06-18
**Status:** Approved in brainstorming; pending spec review.
**Type:** Content consolidation + small schema/render addition.

## Context & goal

The site currently has two adjacent "money" chapters:
- `verdtrygging.yaml` (order 1) — the *concept* of CPI-indexed loans. No calculator.
- `husnaedislan.yaml` (order 2) — home loans, with the calculator and the euro cost-of-capital / shock-absorber trade-offs.

This split is an artifact of how the project grew (verðtrygging was researched and built first, home loans second), not a deliberate structure. The problem: the site's organizing promise is *"here's what changes if we join."* Verðtrygging is the one topic where our own verified research says the honest answer is **"directly, nothing"** — EU membership neither bans nor changes it; the legal machinery already applies via the EEA; the euro is only an *indirect, slow, conditional* lever. A standalone chapter that sits as a peer to Fisheries quietly implies a direct cause-and-effect we ourselves debunked.

**Decision:** Merge verðtrygging into the home-loans chapter, where it belongs — verðtrygging is inseparable from the mortgage decision, and people who click "Home loans" expect the verðtrygging discussion there regardless of the EU angle. Home loans is the star; verðtrygging is honest opening context.

This is sub-project 1 of two. Sub-project 2 (the accession "Start here" intro page) follows in its own spec/plan and is **out of scope here**.

## Decisions (locked in brainstorming)

1. **Verðtrygging is NOT a standalone chapter.** Its content folds into `husnaedislan.yaml`.
2. **Title/nav unchanged:** "Húsnæðislán / Home loans." Verðtrygging does not go in the title — the home-page card already signals the indexed/non-indexed angle, and readers care about the loan, not the terminology.
3. **Home loans is the star.** The existing home-loan content (`today` / `asMember` / euro trade-offs / calculator / ledger) remains the body.
4. **Verðtrygging leads as a clearly-flagged framing note** with three honest beats (see below).
5. **Framing note renders as a distinct callout** via a new optional `contextNote` schema field (option A from brainstorming).
6. **Renumber to a contiguous sequence:** Home loans `→ 1`, Grocery `→ 2`, Jobs `→ 3`, Fisheries `→ 4`, Security & energy `→ 5`. The Home page **displays the `order` value as a visible chapter number** (`Home.astro` renders `01`, `02`…), so numbering must stay gap-free — leaving security-energy at 7 would show a broken `04 → 07` jump. When farming / sovereignty / natural-resources are built they'll be inserted in the national half (pushing security-energy to last); we renumber again then. The accession intro is the separate "Starter," so the numbered arc cleanly begins at 1.
7. **No redirect** for the removed `/verdtrygging/` URLs. (Only 3 people have the link; explicitly told it's WIP.)

## The verðtrygging framing note — three beats

Rendered as a callout near the top of the chapter, in this order:
1. **Not on the table.** Verðtrygging is *not* part of EU accession negotiations and is *not* directly affected by membership — EEA rules already govern it; the EU neither bans nor removes it.
2. **Why it's here anyway.** (a) It's the hot-button issue Icelanders most associate with the EU/euro, so an honest site must address it; and (b) it's *indirectly* affected — the euro, over a slow conditional multi-year path (ERM II + Maastricht), removes the high króna inflation that makes verðtrygging bite.
3. **Why it lives in this chapter.** It's inseparable from the home-loan decision — you can't weigh your mortgage without it.

Source material: this framing already exists almost verbatim in the current `verdtrygging.yaml` `tldr` / `summary` / `asMember` (bilingual), so the note is largely a relocation, not new prose.

## Schema change (`src/content.config.ts`)

Add one optional field to the dossier schema:

```ts
// Optional honest "scope note" callout rendered at the top of a chapter —
// e.g. "this topic isn't directly an EU matter; here's why it's here anyway."
contextNote: loc.optional(),
```

`loc` already enforces bilingual (is + en) text. Optional, so no other chapter is affected.

## Render change (`src/components/Dossier.astro`)

If `contextNote` is present, render it as a visually distinct callout box near the top of the chapter (after the hero/thesis, before the today-vs-member panels). Styling: reuse the existing "uncertain"/dashed-box or footnote visual vocabulary so it reads as an aside, not a gain/loss. Zero-JS, bilingual via the existing locale plumbing. Must not break chapters without the field.

## Content merge (`src/content/dossiers/husnaedislan.yaml`)

- `order: 1`
- `title`: unchanged.
- `contextNote`: the three-beat verðtrygging framing (from current `verdtrygging.yaml` tldr/summary/asMember).
- `tldr` / `summary` / `today` / `asMember`: keep home-loan focus; light edits so they read as the lead now that verðtrygging context sits in the callout (avoid duplicating the note's content).
- **Ledger (`gains` / `losses` / `uncertain`): one merged, de-duplicated set.** Combine the two chapters' points (home-loan points lead). Verðtrygging points worth carrying: the euro-removes-devaluation-driven-inflation gain, the Maastricht-low-inflation point, and any honest unknowns — but only where they aren't already said by a home-loan point. Drop pure-concept points that no longer earn their place once verðtrygging is contextual rather than the subject.
- **Every retained point keeps its `sources[]`** (the schema enforces `.min(1)` — a sourceless point is a build error).
- `calculator: true` (kept). `basket`: absent/false.
- `lastReviewed: 2026-06-18`. `confidence`: per merged content (currently `high`).

## Files touched

| File | Change |
|---|---|
| `src/content.config.ts` | Add optional `contextNote: loc.optional()`. |
| `src/components/Dossier.astro` | Render `contextNote` callout when present. |
| `src/content/dossiers/husnaedislan.yaml` | Merge content; `order: 1`; add `contextNote`; merged ledger; `lastReviewed`. |
| `src/content/dossiers/verdtrygging.yaml` | **Delete** (removes `/verdtrygging/` + `/en/verdtrygging/`). |
| `src/content/dossiers/grocery-bill.yaml` | `order: 3 → 2`. |
| `src/content/dossiers/job-and-prices.yaml` | `order: 4 → 3`. |
| `src/content/dossiers/fisheries.yaml` | `order: 5 → 4`. |
| `src/content/dossiers/security-energy.yaml` | `order: 7 → 5` (keep numbering contiguous since Home shows it). |

(When farming/sovereignty/natural-resources are built, the national half is renumbered again and security-energy moves to last.)

## Out of scope

- The accession "Start here" intro page (sub-project 2, separate spec).
- National-half ordering / building farming, sovereignty, natural-resources.
- Any change to the calculator, the Stakes component, or the Home page beyond what the reordering/collection change produces automatically.

## i18n

All new/edited user-facing text (the `contextNote` especially) must be bilingual is + en — enforced by `loc`. Build fails otherwise.

## Verification

- `npm run build` green.
- Page count drops by 2 (the removed `/verdtrygging/` + `/en/verdtrygging/`).
- Home page lists chapters with contiguous visible numbers `01 Home loans · 02 Grocery · 03 Jobs · 04 Fisheries · 05 Security & energy` — no gap; Home-loans card leads.
- `/husnaedislan/` and `/en/husnaedislan/` render: the `contextNote` callout appears near the top, calculator still renders, merged ledger points all show source chips.
- `/verdtrygging/` returns 404 (expected — no redirect).
- Existing Vitest suite (`npm test`) still green (loan-math untouched).

## Open items / notes

- **Icelandic copy is AI-draft** (verðtrygging had a first pass by Gísli; húsnæðislán not yet reviewed). The merge produces new combined prose → flag the merged chapter for **Nína's** native review. Update the review-status memory accordingly.
- Research source of truth for the verðtrygging claims: the verified `docs/research/verdtrygging-dossier.md`.
