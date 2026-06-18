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
4. **Verðtrygging leads as a clearly-flagged "understand verðtrygging" panel** (the contextNote), not as ledger points (see below).
5. **The panel renders as a distinct callout** via a new optional `contextNote` schema field (option A from brainstorming).
6. **Ledger principle — euro/EU effects only.** The `gains`/`losses`/`uncertain` ledger contains *only* points that are genuine consequences of EU membership / the euro on the mortgage. Facts about verðtrygging *as a domestic phenomenon* (its nature, politics, borrower behavior) are not "gains/losses of joining" and live in the contextNote instead. The existing home-loan points already satisfy this (they're all euro/currency effects); the test for each verðtrygging point is simply "euro effect, or domestic verðtrygging fact?"
7. **Renumber to a contiguous sequence:** Home loans `→ 1`, Grocery `→ 2`, Jobs `→ 3`, Fisheries `→ 4`, Security & energy `→ 5`. The Home page **displays the `order` value as a visible chapter number** (`Home.astro` renders `01`, `02`…), so numbering must stay gap-free — leaving security-energy at 7 would show a broken `04 → 07` jump. When farming / sovereignty / natural-resources are built they'll be inserted in the national half (pushing security-energy to last); we renumber again then. The accession intro is the separate "Starter," so the numbered arc cleanly begins at 1.
8. **No redirect** for the removed `/verdtrygging/` URLs. (Only 3 people have the link; explicitly told it's WIP.)

## The verðtrygging contextNote — an "understand verðtrygging" panel

Rendered as a distinct callout near the top of the chapter. It both frames why verðtrygging is here and absorbs the verðtrygging-as-a-domestic-thing points that don't belong in the euro/EU ledger. Beats, in order:

1. **Not on the table.** Verðtrygging is *not* part of EU accession negotiations and is *not* directly affected by membership — EEA rules already govern it; the EU neither bans nor removes it. **The real pressure is domestic, not from Brussels:** the Supreme Court partly invalidated the banks' rate terms (2025), banks paused indexed loans, and the government plans to reduce their weight from 2027. *(absorbs former point U1)*
2. **Why it's here anyway.** (a) It's the hot-button issue Icelanders most associate with the EU/euro, so an honest site must address it; and (b) it's *indirectly* affected — the euro, over a slow conditional multi-year path (ERM II + Maastricht), removes the high króna inflation that makes verðtrygging bite. (The euro-driven effects themselves are in the ledger below, as gains.)
3. **It's double-edged, not just a burden.** Verðtrygging also *enables* lower monthly payments in a high-rate environment; removing it without rates falling first would make payments heavier. And it's sticky by habit — when rates rose after 2023, households moved *back* toward indexed loans. *(absorbs former points L1 and U3)*
4. **Why it lives in this chapter.** It's inseparable from the home-loan decision — you can't weigh your mortgage without it.

Source material: beats 1, 2 and 4 already exist almost verbatim in the current `verdtrygging.yaml` `tldr` / `summary` / `today` / `asMember`, and beat 3 is reworked from its former ledger points L1/U3 — so the panel is largely relocation, not new prose (bilingual throughout).

## Schema change (`src/content.config.ts`)

Add one optional field to the dossier schema:

```ts
// Optional honest "scope note" callout rendered at the top of a chapter —
// e.g. "this topic isn't directly an EU matter; here's why it's here anyway."
contextNote: loc.optional(),
```

`loc` already enforces bilingual (is + en) text. Optional, so no other chapter is affected.

**Sourcing decision (flag for review):** `contextNote` is plain prose (`loc`), with **no inline source chips** — consistent with the existing narrative fields (`summary` / `today` / `asMember`), which are also unsourced prose. The structural "every claim needs a source" guarantee applies to ledger `point`s and `statBar`s, not narrative. The contextNote's factual statements (2025 rulings, 2027 plans, post-2023 behavior) are the same class of narrative fact the current `verdtrygging.yaml` already states unsourced in `today`; their sources are preserved in the verified `docs/research/verdtrygging-dossier.md` (project source of truth). **Trade-off:** this moves the former U1 point from a *sourced* ledger box to *unsourced* prose. If we'd rather the panel show clickable source chips, the alternative is a structured field — `contextNote: z.object({ body: loc, sources: z.array(source) }).optional()` — rendered with chips like the ledger. Recommendation: start with plain `loc` (YAGNI, matches existing narrative); upgrade to the structured form only if the unsourced facts feel off in review.

## Render change (`src/components/Dossier.astro`)

If `contextNote` is present, render it as a visually distinct callout box near the top of the chapter (after the hero/thesis, before the today-vs-member panels). Styling: reuse the existing "uncertain"/dashed-box or footnote visual vocabulary so it reads as an aside, not a gain/loss. Zero-JS, bilingual via the existing locale plumbing. Must not break chapters without the field.

## Content merge (`src/content/dossiers/husnaedislan.yaml`)

- `order: 1`
- `title`: unchanged.
- `contextNote`: the three-beat verðtrygging framing (from current `verdtrygging.yaml` tldr/summary/asMember).
- `tldr` / `summary` / `today` / `asMember`: keep home-loan focus; light edits so they read as the lead now that verðtrygging context sits in the callout (avoid duplicating the note's content).
- **Ledger (`gains` / `losses` / `uncertain`): euro/EU effects only (per decision 8).** Keep all 5 existing home-loan points. From verðtrygging, carry **only the two genuine euro effects** as gains:
  - **G1** — the euro removes the króna devaluation that drives inflation into indexed loans (the concrete post-2008 story: króna fell >½, ~80% of household debt indexed, the rise hit borrowers directly).
  - **G2** — euro entry *requires* low, stable inflation (Maastricht) — exactly the conditions under which verðtrygging loses its bite.
  - The other three verðtrygging points are **domestic verðtrygging facts, not consequences of joining** → they move to the contextNote (former U1 → beat 1; former L1 + U3 → beat 3), **not** the ledger.
  - **Resulting ledger:** Gains 4 (cost-of-capital, competition, G1, G2) · Losses 3 (shock-absorber, no-magic-fix, ECB-rate) · Uncertain 2 (euro-years-away, rate-vs-concentration). Every box is a real euro/EU effect.
  - **De-dup note:** the former verðtrygging "euro is years away" point is dropped outright — it duplicates the home-loan `uncertain` point verbatim.
- **Every retained point keeps its `sources[]`** (the schema enforces `.min(1)`). G1/G2 carry their existing Central Bank sources; the contextNote beats carry the sources from the verðtrygging dossier where they assert facts (2025 court rulings, 2027 plans, post-2023 behavior).
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
