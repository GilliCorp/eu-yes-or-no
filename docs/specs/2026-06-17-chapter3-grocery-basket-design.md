# Chapter 3 (Matarkarfan) grocery-basket explainer — Design Spec

**Date:** 2026-06-17
**Status:** Approved (design); ready for implementation planning
**Chapter:** 3 — Matarkarfan þín (grocery bill); new `<Basket>` component
**Data foundation:** `docs/research/grocery-basket-data.md`

## Purpose

Help a regular reader see, honestly, **what EU membership would and wouldn't touch on the grocery bill** — without the unfair "Iceland vs Estonia total" comparison that conflates tariffs with wages/transport/scale. Scope is **parts a + b**:
- **a** — a basket explainer/tool showing sourced facts per item (price, protected-vs-free, tariff rate) + the basket total and its share of a median wage.
- **b** — two-layer explanation: plain language up front, mechanism/depth behind an expander.

Part **c** (reusable claim-check cards) is a **separate future spec** — out of scope here.

## GUIDING PRINCIPLE — facts only, no fabrication (non-negotiable)

The tool **states only sourced facts and figures computed directly from sourced inputs.** It must **NOT** assert a fabricated "with-EU" / reduced price or basket total, because the tariff→retail pass-through is **not quantified in any source we found**. Where a number would require an assumption we cannot source, the tool **states the uncertainty instead of guessing.** Every price, rate, and wage on screen carries a citation. This principle overrides any temptation to make the tool more "satisfying."

## Design

### Placement & rendering
- Add `basket: z.boolean().default(false)` to the dossier schema (`src/content.config.ts`), mirroring the existing `calculator` flag.
- `grocery-bill.yaml` sets `basket: true`.
- `Dossier.astro` renders `<Basket lang={lang} />` when `entry.data.basket` is true (after the ledger/uncertain sections).

### The basket tool (a) — hybrid view, facts only
A **sample basket** (the 15 researched items) labelled clearly as an example ("dæmi um körfu — breyttu að þínum vana"), with **adjustable quantities** (simple +/− steppers; sensible default quantities). Per-item row shows, all sourced:
- item name · unit · **price** (dated snapshot) · quantity stepper
- a **tag**: `verndað` (protected) / `tollfrjálst` (already free) / `árstíðabundið` (seasonally protected)
- for protected items, the **tariff rate** (e.g. "tollur ~73%") with a one-line note that this is a *border charge, not a predicted price drop*.

**Headline facts (computed only from sourced data):**
- **Basket total today** = Σ(price × qty).
- **Share of income** = basket total as % of the **median full-time monthly wage (826,000 ISK, 2025)**, labelled precisely as "miðgildi reglulegra heildarlauna í fullu starfi" — *not* "household income".
- **Protected/free split**: "X af N vörum eru tollverndaðar (það sem ESB-aðild snertir); hinar eru þegar tollfrjálsar."

**The "what EU membership does" statement (factual, NO number):**
> "Tollarnir á vernduðu vörunum féllu við aðild. Hve mikið af því skilar sér í búðarverð er ekki tölusett í heimildum — það veltur á innlendri framleiðslu og álagningu. Tollfrjálsu vörurnar haggast ekki. Sjáðu raunverð erlendis sjálf hér að neðan."

No reduced total, no modelled band. The EU-relevant magnitude shown is the **sourced tariff rate per protected item**, nothing invented.

### Two-layer explanation (b) — progressive disclosure
- **Plain layer (always visible):** the per-item tags + a one-paragraph plain summary ("most of your basket is already tariff-free and wouldn't change; the change lands on dairy, meat and eggs").
- **Depth layer (expander "Hvernig þetta er reiknað / Nánar"):** customs union vs national tariffs; protected-vs-free; **why we deliberately show no predicted price** (pass-through not quantified → we won't fabricate); **VAT does not change** (national competence within EU bands); **CAP shifts farm support from the till to taxes** (still subsidised, different pocket); the OECD NPC 1.60 / Eurostat price-level context as *context, not a prediction*; full source list.

### Honest framing / both-sides (special cases the EU touches directly)
Enrich the `grocery-bill.yaml` dossier with:
- **Egg (~30%) and seasonal-vegetable** tariff specifics in `today` (we currently only name dairy/meat).
- A **biosecurity / animal-health** both-sides pair (one `loss`/`uncertain` item + context), stating flatly:
  - **View A:** the import restrictions were partly protectionist; ESA/EFTA Court found the blanket raw-meat ban breached EEA law (E-17/15, 2016; E-2/17 & E-3/17, 2017); protection inflates prices.
  - **View B:** Iceland is free of 14 WOAH-listed diseases, has the **lowest veterinary antibiotic use in Europe**, and kept ESA-approved Salmonella guarantees — a real biosecurity interest.
  All sourced.

### Part B — verify-yourself source links (not stores)
A links block in the component (reusing the `bank-calculators.ts` pattern → new `src/data/grocery-sources.ts`): **Eurostat comparative price levels, ASÍ verðsjá, Hagstofa**, captioned: *"Verð erlendis er ólíkt af fleiri ástæðum en tollum — launum, flutningi, stærð markaðar — svo lestu ekki allt bilið sem ESB-áhrif."* No retail-store links.

### Data & sourcing
- New `src/data/basket.ts`: typed array of items `{ id, name{is,en}, unit{is,en}, priceISK, defaultQty, provenance, protection: 'protected'|'free'|'seasonal', tariffNote{is,en}?, source{title,url,publisher} }`, plus the median-wage constant (value + source) and a `snapshotDate` string. Every price has a source URL + date (from the research doc).
- Prices shown with a visible **"verð frá [snapshotDate]"** stamp and a "skoða núverandi verð hjá ASÍ" link. Manual refresh.
- **Open data caveats surfaced on the page:** no published household-disposable median (we use the labelled wage); chicken provenance to confirm; some prices approximate (pasta, tomatoes, rice); per-item tariffs are category-level.

### Math — tested, trivial by design
- `src/lib/basket-math.ts` (pure): `basketTotal(items, qtys)` and `shareOfWage(total, monthlyWage)` and `protectedCount(items)`. **No reduction/forecast function exists — deliberately.**
- `src/lib/basket-math.test.ts` (Vitest): total = Σ price×qty; share = total/wage; protectedCount counts only `protected`/`seasonal`. These tests also serve as a guard that the module contains **no hidden price-forecast logic.**

### i18n
Add `basket.*` keys to `src/i18n/ui.ts` (both `is`/`en`): title, sub, per-item tags, "tollur", the border-charge note, headline labels (total, share-of-wage, protected/free split), the "what EU does" statement, the depth-panel toggle + body headings, the verify-links caption, the snapshot stamp.

## Files touched
- `src/content.config.ts` — add `basket` flag.
- `src/content/dossiers/grocery-bill.yaml` — `basket: true`; enrich `today` (eggs/veg) + add biosecurity both-sides.
- `src/components/Dossier.astro` — render `<Basket>` when `basket` true.
- `src/components/Basket.astro` — new component (markup + module script + scoped styles).
- `src/lib/basket-math.ts` + `src/lib/basket-math.test.ts` — new pure module + tests.
- `src/data/basket.ts` — new sourced item/wage data.
- `src/data/grocery-sources.ts` — new verify-link data.
- `src/i18n/ui.ts` — new `basket.*` labels.

## Verification
- `npm test` (Vitest) green; `npm run build` green (schema + types).
- Playwright screenshot IS + EN: per-item tags + tariff rates correct, basket total + share-of-wage render, protected/free count correct, **no fabricated "after"/reduced figure anywhere**, verify-links + caveats present.
- Manual: change a quantity → total + share update; counts correct; snapshot date shows.

## Out of scope
- Part c (claim-check cards) — separate spec.
- Any fabricated/predicted reduced price, modelled pass-through band, or cross-country store-total comparison.
- Live price scraping (snapshot only).

## Assumptions stated openly (not hidden)
- The basket **composition and default quantities are an editorial example** ("dæmi um körfu"), clearly labelled and user-adjustable — not a claim about any real household.
- The income anchor is **median full-time wage**, explicitly labelled (household-disposable median is unpublished).
- Chicken provenance (domestic vs imported) to be confirmed during build; if unresolved, tag it honestly ("uppruni óstaðfestur").
