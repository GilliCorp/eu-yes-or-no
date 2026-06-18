# Design — Farming chapter (`farming.yaml`)

**Date:** 2026-06-18
**Status:** Approved in brainstorming; pending spec review.
**Type:** New dossier chapter (content-collection YAML) + one renumber. No component/schema change.

## Context & goal

Build the **Farming** chapter — the next un-built national-half chapter — as a standard dossier, drawn from the verified research at `docs/research/farming.md` (25/25 claims confirmed). It pairs with the live Fisheries chapter to complete the primary-sector-economics picture. Farming is one of the areas where full membership changes things *materially*, because agriculture sits largely **outside** the EEA.

This is a content build only: a new `src/content/dossiers/farming.yaml` + renumber one sibling. No new component, no schema change, no calculator, no `stakes` hook (decided in brainstorming — agriculture has no single dramatic stat, and it's a declining share of the economy; a bar would underwhelm or mislead).

## Decisions (locked in brainstorming)

1. **Standard dossier**, same schema/rendering as the live chapters (`Dossier.astro`). Drawn from `farming.md`.
2. **Title:** "Landbúnaður / Farming" — NOT "& rural life." The research's rural-community material is thin (the research itself flagged it as an open question), so the title must not over-promise a rural deep-dive we don't have sourced.
3. **No `stakes` hook, no `calculator`, no `basket`.**
4. **Order:** `farming.yaml` = `order: 5`; **`security-energy.yaml` renumbers `5 → 6`** so the Home list stays contiguous (`01 Húsnæðislán · 02 Matarkarfan · 03 Vinnan og verðlagið · 04 Fiskveiðar · 05 Landbúnaður · 06 Öryggi og orka`). Home displays the order as a visible `0N` number, so no gaps. (When sovereignty + natural-resources are built later, the national half renumbers again.)
5. **Three caveats baked into the copy** (see below).

## Content structure (drawn from the verified `farming.md`)

Standard dossier fields. Icelandic is AI-draft → Nína review.

- **tldr:** Unlike most of the EEA, farming changes *materially* — Iceland's quantitative import tariffs (*magntollar*) give way to the CAP (income support via decoupled, area-based payments). Honest, sector-split outcome.
- **summary:** The *magntollar* model (≈no imports outside tariff quotas) vs the CAP (€387bn 2021–27; ~70% decoupled direct payments). Iceland's own ~2009 analysis = mixed/sector-split; the agriculture chapter was never finished before the 2013 suspension; no permanent derogations from the common policy.
- **today (EEA + Iceland's tariff system):** *magntollar* give "substantial protection" (virtually no imports outside quotas) *(FM ch.20)*; agriculture is largely **outside** the EEA *(contrast the verðtrygging story)*; **animal-health friction already exists** — the prior-authorisation regime for raw meat/eggs/dairy was repeatedly found unlawful under Directive 89/662/EEC (EFTA Court **E-2/17 & E-3/17**, 14 Nov 2017; **E-17/15**) *(ESA; EFTA Court)*.
- **asMember (CAP):** adopt the common policy; border protection **moves to the EU external border** (lose internal protection / free EU farm trade) *(USDA ERS; Summary Conclusions)*; CAP supports **income** via decoupled direct payments (~70%, area-based), BISS conditional on GAEC/environmental/social standards *(EC; EP factsheet 109)*.

### Ledger
- **Gains:**
  1. **Income support for the sectors that qualify** — area-based environmental + hard-farming/LFA payments would help **sheep, dairy, beef** ("better than other sectors"). *(FM ch.20)* — `confidence: high`.
  2. **Substantial EU co-financing — but a dated estimate.** Total support could exceed **5bn ISK with the EU share 65–70%**, *if* Iceland's LFA/eligible-production definitions resembled northern Sweden/Finland's. **The qualifier travels inline with the number** (per brainstorming: no footnote system): the sentence states this is the **Foreign Ministry's ~2009 accession-era estimate, not a present-day forecast under the current 2023–27 CAP.** *(FM ch.20)* — `confidence: medium`.
  3. **A *possible* permanent disease-based safeguard — hedged.** Iceland *might* keep restricting live-animal / raw-meat / unpasteurised-milk imports on its disease-risk status — **but only if scientifically justified under WTO/SPS rules, and its current rules have already been struck down in court.** Written as conditional, not a promised win. *(FM ch.20; WTO SPS Art. 5)* — `confidence: medium`.
- **Losses:**
  1. **Loss of border protection** that underpins domestic production — free EU imports leave the food industry hard-pressed. *(FM ch.20)* — `high`.
  2. **Whole sectors left unsupported** — pork, poultry, eggs get essentially no CAP funding *and* lose tariff protection. *(FM ch.20)* — `high`.
  3. **No permanent derogations** from the common policy — only temporary ones; a permanent "special solution" must be written into the accession treaty. *(Summary Conclusions)* — `high`. (Consistent with the accession + fisheries dossiers.)
  4. **Income drops sharply before CAP partly offsets** — e.g. dairy income falls by over half in the ch.20 modelling. *(FM ch.20)* — `medium` (same ~2009-modelling caveat applies; note it's that report's modelling).
- **Uncertain / mixed:**
  1. **Bændasamtök (Farmers' Association) isn't monolithically anti-change** — has argued existing tariff protection "no longer has its intended effect." **Caveat baked in: this concerns Iceland's standalone EEA trade framework, not accession directly.** *(Althingi doc 433; umsögn 157-1038)* — `medium`.
  2. **The 2010–13 record is a blank, not a verdict** — the agriculture negotiating position was never finished (likely internal disagreement); one of four chapters with no position at suspension. *(Summary Conclusions)* — `high`.

## The three caveats (handling, agreed in brainstorming)

1. **The 5bn ISK / 65–70% figure is a ~2009-era estimate, not a present-day forecast.** Handled **inline in the claim sentence** (no asterisk/footnote — the renderer has none, and there's no precedent for footnotes on the site). `confidence: medium`. The same "that report's modelling" qualifier attaches to the dairy-income-drop loss. (CAP *structure* figures — €387bn, ~70% direct payments, BISS ~51% — are current and fine to state plainly.)
2. **Don't conflate** the 2015 bilateral tariff deal or Bændasamtök statements with the accession talks — they concern Iceland's **standalone EEA trade framework**, not the 2010–13 negotiations. The relevant claim text says so explicitly.
3. **The disease-based safeguard is hypothetical + conditional** on WTO/SPS scientific justification; phrased as conditional, not a promise; `confidence: medium`. Animal-health constraints **already bind** Iceland under the EEA — membership **deepens, not creates** them.

## Sourcing

Every claim carries ≥1 `source` with a valid URL and tier (build fails otherwise). Tiers: laws/treaties/court rulings/statistics/official accession docs = `primary`; Bændasamtök stakeholder statements = `advocacy` (used only for the both-sides framing, never as proof of fact). **The implementation plan must pin exact, real source URLs** (from `farming.md`'s KEY SOURCES + canonical EUR-Lex/EC/EP/EFTA-Court/government.is URLs) — the implementer must NOT invent URLs. EUR-Lex URLs are fine as `href`s.

## Out of scope

- No `stakes`/`calculator`/`basket`.
- No new component or schema change (uses the existing dossier collection + `Dossier.astro`).
- The research's "rural life / depopulation" open question (not sourced in depth) — not covered; the title reflects that.
- Sovereignty + natural-resources chapters (later).

## Verification

- `npm run build` green; page count **+2** (a new chapter = `/farming/` + `/en/farming/`), i.e. **18 pages**.
- `npm test` 15/15 (no logic touched).
- Home lists `01–06` contiguous, Farming at `05`, Fisheries `04`, Security & energy `06`.
- `/farming/` + `/en/farming/` render: hero, today/as-member compare, gains/losses ledger, uncertain box, source chips link out; both locales.
- Schema guardrail holds: every ledger point has ≥1 source (build proves it).

## Notes

- **Icelandic copy is AI-draft** → flag for Nína ([[review-status]]).
- All content is from the **verified** `farming.md` (25/25) — no new research needed. The one place to stay disciplined is the ~2009-estimate caveat (inline) and not over-stating the disease safeguard.
- Push/deploy is user-gated as always, though the established AI-draft-disclosed/soft-launch precedent applies.
