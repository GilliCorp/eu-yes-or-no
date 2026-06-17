# Chapter 4 (Fiskveiðar) fisheries dossier + stakes visual — Design Spec

**Date:** 2026-06-17
**Status:** Approved (design); ready for implementation planning
**Chapter:** Fisheries (`fisheries.yaml`); new generic `<Stakes>` component + `stakes` schema field
**Data foundation:** `docs/research/fisheries.md` (deep-research pass, 22/25 claims confirmed, 3 refuted)

## Purpose

Port the verified fisheries research into the standard dossier structure — the same shape as every other chapter (`tldr → summary → today → asMember → gains/losses/uncertain`, every claim sourced) — plus **one** signature, fully-sourced "stakes" visual as the opening hook. Fisheries is the classic Icelandic sticking point and the issue that effectively ended the 2010–2013 talks; the chapter must convey *why* it matters that much while staying strictly neutral and sourced.

## GUIDING PRINCIPLES (non-negotiable)

1. **Facts-only, no fabrication** (inherited from ch3). Every figure on screen is sourced or trivially derived from a sourced figure. **We do NOT invent Iceland's hypothetical quota shares** — what shares Iceland would actually receive under relative stability is explicitly an open question in the research (no EU catch-history exists for its EEZ). Inventing them would be the same sin ch3 forbids.
2. **No false balance.** The verified research leans skeptical: the losses are concrete and well-sourced; the pro-case is genuinely thinner. We present the pro-case at *full strength* but do **not** manufacture extra pro-arguments to even the count. Neutrality here = honest structure + honest uncertainty, not a forced 50/50.
3. **Same structure as every other chapter** (confirmed with Gísli) — no bespoke layout; fisheries uses the standard dossier render, with the new `stakes` visual being a *generic, reusable* addition, not a one-off.

## Design

### A. Dossier content (`src/content/dossiers/fisheries.yaml`)

`order: 5` — sorts after jobs (4), before security-energy (7). Full renumbering (to insert farming/sovereignty/natural-resources and push security to the end per the agreed national-half order: Fisheries → Farming → Sovereignty → Natural resources → Security & energy) happens when those chapters are built. `order` is only a sort key, so this is safe.

`calculator: false`, `basket: false`, `confidence: high`, `lastReviewed: 2026-06-17`.

**`title`** — is: "Fiskveiðar" / en: "Fisheries".

**`tldr`** — The biggest change and the classic sticking point: fisheries management moves from Reykjavík to the EU, quota shares would track historic catch, and no permanent exemption has ever been granted to any joining country.

**`summary`** — plain paragraph: under the CFP (Reg. (EU) 1380/2013) the conservation of marine resources — setting TACs, technical measures, allocating quotas — becomes an EU *exclusive competence* decided at Union level. Shares are split by "relative stability" (fixed percentages anchored to historic catch). Outside 12 nm the default is equal access for all EU vessels — the heart of the "control of our waters" fear — but actual catch stays bound by quota shares (equal access ≠ unlimited foreign catch). No accession candidate has ever won a permanent derogation. The chapter was never even opened in 2010–13.

**`today`** (EEA / current reality) — Fisheries management in Icelandic waters is an exclusively national matter: Iceland sets its own TACs, runs its own quota system, and advocates **independently** in international fora (NEAFC; the mackerel disputes). This is *not* governed by the EEA — it is one of the areas a full membership would genuinely change.

**`asMember`** — CFP exclusive competence; TAC-setting and quota allocation decided at Union level (Council, annually); relative stability locks shares to historic catch (1983 key, ref. years 1973–78, unchanged by the 2013 reform); equal access outside the 12 nm coastal band (derogation extended to **31 Dec 2032** by Reg. (EU) 2022/2495) — with catch still quota-bound.

**`gains[]`** (presented at full strength; 2 items):
1. *The reformed CFP is more decentralised and — per the Icelandic Institute of Economic Studies (IES) report — compatible with Iceland's quota-based system.*
   - Source: EP briefing EXPO-AFET_SP(2014)522331 (De Micco, 2014) — **primary**.
   - `confidence: medium` (single source; the same briefing's overall tone is skeptical — note honestly).
2. *Quota shares are predictable and stable: relative stability gives each state a fixed percentage over time, and equal access does not mean unlimited foreign catch — actual catch stays quota-bound.*
   - Sources: Reg. (EU) 1380/2013 (Art. 16(1), Art. 5(1)); EP factsheet 114 — **primary**.
   - `confidence: high`.

**`losses[]`** (3 items):
1. *Loss of autonomy over setting TACs: catch limits would be decided at Union level, where a small state's negotiating weight would be very small.*
   - Sources: EP briefing EXPO-AFET_SP(2014)522331; Summary Conclusions — **primary**. `confidence: high`.
2. *No permanent derogation from a common policy has ever been granted to a joining country — only temporary derogations (changeable at Union level); any permanent special solution must be written into the accession treaty itself. Malta's 25-nm zone is the small-state precedent, but it is a regulated-access measure for small vessels, amendable at Union level — not a flag-based exclusion.*
   - Sources: Summary Conclusions; Council Reg. (EC) 813/2004 — **primary**. `confidence: high`.
3. *Outside 12 nm, EU vessels would have equal access to Icelandic waters (the core "control of our waters" concern) — though catch remains bound by quota shares.*
   - Sources: Reg. (EU) 1380/2013 (Art. 5); EP factsheet 114 — **primary**. `confidence: high`.

> **No 4th loss.** The "loss of independent international advocacy" concern is **not** added as a padded loss — it lives in the uncertain bucket (uncertain #3), where it honestly belongs, since *how* shared-stock/coastal-state disputes (the mackerel war, the NEAFC seat) would be handled post-accession is genuinely unresolved. Padding the loss column with a medium-confidence item to make the ledger look fuller would be the opposite of the honesty this chapter is built on.

**`uncertain[]`** (3 items):
1. *What quota shares Iceland would actually receive is unknown — most of its key stocks (cod, capelin, mackerel) are not currently shared EU stocks and there is no EU historic-catch record in its EEZ to base a key on.* (Source: Reg. 1380/2013 relative-stability principle + research open question.) `confidence: low`.
2. *Whether a bespoke "Icelandic management zone" modelled on Malta's 25-nm zone could realistically scale to a 200-nm EEZ and a large industrial fleet — the Malta precedent is limited to small (<12 m) non-towed-gear vessels.* (Source: Council Reg. (EC) 813/2004.) `confidence: low`.
3. *How shared/straddling stocks and coastal-state disputes (e.g. the mackerel war) would be handled, and what precedent exists for the loss of independent advocacy.* (Source: Summary Conclusions + research open question.) `confidence: low`.

**Refuted claims — stay OUT** (already fenced in the dossier "DO NOT PUBLISH" section): the 12-nm-expired-2022 framing; the verbatim-IES no-derogation attribution; the Malta "non-discriminatory by nationality" claim.

**Tracked needs-source item (do NOT add yet):** tariff-free single-market access for Icelandic seafood is a genuine, politically hot pro-argument but is **not** in our verified sources. Per facts-only it is excluded until sourced. Logged in "Open / follow-up" below so it is not forgotten. *(Gísli confirmed: excluding it for now is correct.)*

### B. The stakes visual (opening hook)

Placement: rendered at the **top of the dossier, immediately after `summary`, before the today/as-member panels** — frames the stakes before any mechanism detail.

Content: two horizontal sourced bars —
- **~40%** — "Share of goods exports" (40% in 2012; 39.3% in 2011).
- **~7%** — "Share of all jobs" (2012).

Honest caption baked in (not a footnote to miss): *"40% is the share of GOODS (merchandise) exports; including services the share is lower (~17%, 2017). The primary sector — agriculture, fisheries and mining — is 6.8% of GDP."* Plus a one-line framing sentence: *"This is why fisheries can decide the whole debate — it earns a huge share of the country's export income while employing very few people."*

Source for all of the above: EP briefing EXPO-AFET_SP(2014)522331 (De Micco, 2014) — **primary** (figures quoted verbatim; order-of-magnitude corroborated by Statistics Iceland). No computed/forecast numbers — bars render the sourced percentages directly.

### C. Implementation mechanics (generic, reusable — approved)

**Schema (`src/content.config.ts`):** add an optional, sourced stat-bar array so the build *enforces* a citation on every bar (same neutrality guarantee as `point`):

```ts
const statBar = z.object({
  label: loc,
  valuePct: z.number().min(0).max(100),
  caption: loc,
  sources: z.array(source).min(1), // 🔒 a bar with no source is a build error
});
// in the dossier schema object:
stakes: z.array(statBar).optional(),
```

This is reusable by later chapters (sovereignty → voting weight; natural-resources → ownership), so it is not a one-off hack.

**Component (`src/components/Stakes.astro`):** new lightweight, zero-JS Astro component. Props: `bars` (the `stakes` array) + `lang`. Renders a titled block; each bar shows label, a CSS bar filled to `valuePct`, the `%` value, the `caption`, and clickable source chips with tier badges (reuse the existing chip/badge markup from `Dossier.astro`). Section heading from a new global i18n key (so all chapters share it). Respects the existing visual identity (mono labels, the forest/brick neutral palette — bars use a *neutral* accent, not gain/loss coloring, since a stat is neither). a11y: bars are decorative; the number + label carry the meaning; include reduced-motion friendliness (no animated fill, or gate it behind `prefers-reduced-motion`).

**Render hook (`src/components/Dossier.astro`):** render `<Stakes bars={entry.data.stakes} lang={lang} />` when `entry.data.stakes?.length`, positioned after the summary block and before the today/as-member compare panels.

**i18n (`src/i18n/ui.ts`):** add `stakes.title` (is/en, e.g. "Hvað er í húfi" / "What's at stake"). All per-bar text (labels, captions) lives in the dossier data (bilingual), not in `ui.ts`.

**No math module.** Nothing is computed or forecast; the bars are sourced percentages. (Deliberate — mirrors ch3's "no hidden forecast logic" stance.)

### D. Icelandic copy

All Icelandic text in `fisheries.yaml` and the new `ui.ts` key is **AI-drafted at build time and must be flagged for native review** (Nína / Gísli) per `review-status` — same as every other chapter. English drafted alongside.

## Files touched
- `src/content.config.ts` — add `statBar` schema + optional `stakes` field.
- `src/content/dossiers/fisheries.yaml` — **new** dossier (full bilingual content above; `stakes` array with the two bars).
- `src/components/Stakes.astro` — **new** generic sourced stat-bar component.
- `src/components/Dossier.astro` — render `<Stakes>` when `stakes` present (after summary).
- `src/i18n/ui.ts` — add `stakes.title` (is/en).

## Verification
- `npm run build` green (schema accepts the new field; types check; the `.min(1)` source guard on bars verified by a deliberate no-source build failure during dev).
- `npm test` green (existing Vitest suite unaffected; no new math module).
- Playwright screenshots **IS + EN**: stakes hook renders with both bars + caption + source chips; today/as-member panels and the gains/losses/uncertain ledger render; every claim and every bar shows a source chip with a tier badge; the 3 refuted claims appear nowhere; chapter sorts into position (order 5).
- Manual: confirm the bars read as neutral (not gain/loss colored), the goods-vs-services caveat is visible (not hidden), and reduced-motion is respected.

## Out of scope
- Any interactive quota/share calculator or invented "Iceland's shares would be X%" figure.
- The tariff-free single-market pro-argument (excluded until sourced — see follow-up).
- Renumbering the other chapters' `order` values (done when farming/sovereignty/natural-resources are built).
- Map-based "waters/access" visual (considered and dropped in favor of the stakes hook).

## Open / follow-up
1. **Source the single-market access argument.** Targeted check (EUR-Lex/EEAS/SFS) for whether/at-what-tariff Icelandic seafood enters the single market today vs as a member; if sourced, add as a `gains` point. Until then, excluded.
2. **Live data:** the 39–40% / 7% figures are 2011–2012 (the accession-era EP briefing); set the chapter's `lastReviewed` and refresh against Statistics Iceland before launch if newer figures exist.
3. ~~Optional 4th loss (independent advocacy)~~ — **dropped**; covered in uncertain #3 (no padding).
4. **Methodology page principle (site-wide, separate task):** add a short "we don't pad the weaker side to fake balance — count the sources, not the bullet points" statement so the loss-leaning shape of chapters like fisheries is explained once, globally, rather than per-chapter.

## Assumptions stated openly
- The chapter is intentionally **asymmetric** (more/stronger losses than gains) because that is what the sourced record shows; this is honest, not biased. The structure (forced gains/losses/uncertain buckets) and the uncertainty box carry the neutrality.
- **No per-chapter "we lean losses" note** (decided with Gísli). Neutrality stays *structural* — no narrator voice on the chapter. The "we don't pad the weaker side to fake balance; count the sources, not the bullet points" principle is stated **once, site-wide, on the Methodology page** (a separate future task — logged in follow-up #4). This keeps fisheries clean while putting the honest explanation exactly where a skeptic looks.
- The stakes bars are a **sourced snapshot** (2011–2012), clearly dated, with the goods-vs-total-exports caveat on-screen.
