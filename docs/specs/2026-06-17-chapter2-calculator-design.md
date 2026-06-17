# Chapter 2 (Húsnæðislán) calculator redesign — Design Spec

**Date:** 2026-06-17
**Status:** Approved (design); ready for implementation planning
**Chapter:** 2 — Húsnæðislán (home loans); component `src/components/Calculator.astro`

## Purpose

Reorient the home-loan calculator from a **monthly-payment** focus to a **total-cost + comparison**
focus, using the input conventions Icelanders already know from bank calculators (Íslandsbanki, Arion).
The differentiator vs the banks stays: we compare a **euro loan** as a third option alongside the
familiar verðtryggt / óverðtryggt — and we make **what you pay in the end** the hero.

## Decisions locked in (from brainstorming)

1. **Remove the household preset buttons** (alone/couple/family/custom) — they only set the loan
   amount, so they're noise. Drop `PRESETS` from `assumptions.ts`.
2. **Total cost + comparison is the hero**; monthly payment becomes secondary context.
3. **Indexed total shown BOTH ways** — nominal (krónur actually paid, inflation included) AND in
   today's krónur (real, inflation-adjusted) — side by side. This is the core neutrality choice.
4. Adopt the **familiar bank input layout**: purchase price + equity → loan amount + LTV.
5. **Payment method = annuity (jafnar greiðslur)** only; ignore special cases (first-buyer,
   equal-installments).

## Out of scope (parked for a separate brainstorm)

- **Amortisation-over-time graph** ("capital down / interest up over the loan period"). It's a
  distinct visualization with its own design questions and will be its own iteration. NOT built here.
- Affordability vs income (the banks' 35%/40% rule), first-buyer terms, refinancing, foreign-currency
  loans.

## Design

### Inputs (replaces presets)
- **Kaupverð** (purchase price) — number + range slider.
- **Eigið fé** (equity) — number + range slider.
- Derived, shown read-only: **Lánsupphæð** (= kaupverð − eigið fé) and **Veðsetning / LTV %**.
- **Lánstími** (term, years) — one slider applied to all three loan types for a fair comparison;
  small note that in practice indexed loans cap ~25 yr and non-indexed ~40 yr.
- Payment method implicit: annuity.

### Output — hero: total cost comparison (with chart)
Three loan types remain: **Verðtryggt · Óverðtryggt · Evru-lán**. Layout leads with total cost:
- **Horizontal comparison bars = total paid over the term**, in **today's krónur** (fair
  apples-to-apples), with the **nominal** total labelled alongside each bar.
- Each bar is **stacked**: höfuðstóll (principal) / vextir (interest) / verðbætur (indexation) — shows
  how little of the total is the actual house.
- **Monthly payment** (start; plus after-10-years for indexed) drops to a small secondary line per
  loan type — retained, no longer the headline.
- Bars are lightweight inline CSS/SVG (no charting library) to keep the page fast and match the
  existing vanilla-JS island.

### Math
- Monthly payment: standard annuity at the loan type's rate over the term.
- **Non-indexed / euro:** nominal payment is flat; total nominal = payment × months; total real =
  payments discounted at the inflation range.
- **Indexed (verðtryggt):** annuity computed at the REAL rate; nominal payment grows with inflation
  each year; total nominal = sum of inflated payments; total real ≈ discounted back to today (≈
  principal + real interest, with indexation washing out in real terms).
- **All figures are ranges** (low–high) driven by `assumptions.ts` rate/inflation bands; totals show a
  low–high band. The euro comes out cheapest; indexed-vs-non-indexed depends on inflation — shown
  honestly via the ranges, not rigged.

### Neutrality guardrails (unchanged)
- Permanent **"Skýringardæmi — ekki spá"** disclaimer; the inflation assumption (2.5–5.1%) shown on
  the chart.
- Expandable **sourced-assumptions panel** stays (Hagstofa, Vísir/bank rates, ECB, govt report).

## Files touched
- `src/components/Calculator.astro` — rewrite inputs (kaupverð/eigið fé/LTV/term) and output
  (total-cost stacked comparison bars + secondary monthly); add real+nominal total math.
- `src/data/assumptions.ts` — remove `PRESETS` (no longer used).
- `src/i18n/ui.ts` — add labels: kaupverð, eigið fé, lánsupphæð, veðsetning, heildargreiðsla,
  á verðlagi í dag, nafnvirði, höfuðstóll, vextir, verðbætur, term-cap note.
- `src/content/dossiers/husnaedislan.yaml` — unchanged (still `calculator: true`).

## Verification
- `npm run build` green (schema + types).
- Playwright screenshot of the redesigned calculator (IS + EN), check stacked bars + both totals.
- Manual sanity checks: total nominal ≥ total real; euro cheapest; numbers move sensibly with inputs;
  LTV computes correctly; reduced-motion / keyboard focus retained.

## Open question deferred
- Term-cap handling: one shared term (chosen) vs per-loan caps — revisit only if the comparison reads
  as misleading.
