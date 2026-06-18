# Design — Natural resources chapter (`natural-resources.yaml`)

**Date:** 2026-06-18
**Status:** Approved in brainstorming.
**Type:** New dossier chapter (content-collection YAML) + one renumber. No component/schema change. **The final chapter of the planned 8-topic arc.**

## Context & goal

Build the **Natural resources / auðlindir** chapter from the verified research at `docs/research/natural-resources.md` — the "are we handing the national wealth to foreign hands?" question. It's the economic-sovereignty capstone (the ownership-and-who-profits lens across land, water, energy, minerals, fish-as-asset).

**The defining, honest finding (Gísli explicitly endorsed landing it plainly):** the fear is **largely misdirected at EU membership** — free movement of capital + establishment are already core **EEA** freedoms (since 1994), so foreigners can *already* acquire Icelandic land/energy rights/salmon rivers; full membership changes **very little** on ownership, and Iceland keeps the key levers. The one genuinely live exception is **fisheries-as-asset**. We do NOT force false balance: the ledger honestly leans "little changes," because that's the verified truth, and it corrects a real misconception (which is exactly why the chapter is worth building rather than skipping).

Content build only: new `src/content/dossiers/natural-resources.yaml` + renumber one sibling. No new component/schema, no calculator, **no `stakes` hook** (no single dramatic stat).

## Decisions (locked in brainstorming)

1. **Standard dossier** (`Dossier.astro`), from `natural-resources.md`.
2. **Title:** "Auðlindir / Natural resources."
3. **No `stakes`/`calculator`/`basket`.**
4. **Order:** `natural-resources.yaml` = `order: 7`; **`security-energy.yaml` 7 → 8** (Home contiguous `01 … 06 Fullveldi · 07 Auðlindir · 08 Öryggi og orka`). This completes the arc; security-energy moves to its final slot 08.
5. **Honest "little changes" framing**, carried by the today-vs-as-member compare panel; no forced balance.

## Content structure (from the verified `natural-resources.md`)

- **tldr:** The "foreigners buying our land/rivers/energy" fear is largely misdirected at membership — the EEA already opened it; Iceland keeps the key levers; fisheries-as-asset is the one real exception.
- **summary:** capital/establishment are core EEA freedoms (since 1994) → foreign acquisition already possible; Art. 345 TFEU (= Art. 125 EEA) keeps public ownership safe; resource-rent/tax stays national (veto); the real residual is fisheries-as-asset, never negotiated.
- **today (EEA already governs):** EEA/EFTA nationals already acquire land/energy-rights/rivers (Reg. 702/2002 declaration); capital + non-discrimination disciplines **identical** EEA vs EU; non-EEA foreigners still need permission → the line that matters is **EEA-vs-non-EEA**, which membership doesn't move.
- **asMember:** very little changes on ownership; fisheries-as-asset is the genuine open item.

### Ledger (honestly ~3 gains / 2 losses / 2 uncertain — reassurance-leaning, per the finding)
- **Gains / what's protected:**
  1. **Public ownership is safe** — Art. 345 TFEU (= Art. 125 EEA): the EU is neutral on public vs private ownership; "the Treaties do not preclude nationalisation or privatisation"; Iceland could keep Landsvirkjun public. *(EC free-movement-of-capital case-law guide; Essent C-105/12)* — `high`.
  2. **Resource-rent stays Iceland's call** — taxation is a national competence (EU tax law needs unanimity → Iceland would hold a *veto*); the *veiðigjald* (per-kg catch fee; in **2014** ≈ €52m / 6% of catch value) and the constitutional *auðlindaákvæði* are compatible — rent-capture is an ownership-system choice Art. 345 protects. *(EP factsheet 92; island.is; Venice Commission)* — `high`.
  3. **Non-discriminatory safeguards survive** — the **2020 land cap (10,000 ha, size-based not nationality-based)** is the living proof; triggered by concentrated foreign land-buying (Jim Ratcliffe the named catalyst); non-retroactive. *(Iceland Review; RÚV)* — `medium`.
- **Losses:**
  1. **Fisheries-as-asset must open** — Iceland's <25%-foreign-ownership cap on fishing rights/processing was flagged **acquis-incompatible** (2012 Commission report, verbatim: "restrictions … on freedom of establishment, services and capital movements … not in line with the acquis") and would have to be removed; never negotiated (linked to the never-opened fisheries chapter). *(US State Dept 2025; CELEX:52012SC0337; MFA Summary Conclusions)* — `high`.
  2. **The honest residual:** safeguards **can't single out foreigners** (Art. 345 does not exempt national rules from free movement — Essent), and **most of the ownership opening already happened via the EEA** (EEA/EFTA nationals already acquire land/energy/rivers) — so the "control" was largely ceded in **1994**, not at membership. *(EC case-law guide; government.is; US State Dept)* — `high`.
- **Uncertain:**
  1. **How fisheries-as-asset would actually be resolved** — never negotiated, linked to the never-opened fisheries chapter; no permanent-derogation precedent. *(MFA Summary Conclusions; CELEX:52012SC0337)* — `medium`.
  2. **The *auðlindaákvæði* is a 2020 DRAFT, never enacted** — its status and how it would interact with EU free-movement rules is unresolved. *(Venice Commission CDL-REF(2020)049rev)* — `medium`.

## Caveats baked into the copy (the research insists)

1. **Do NOT say the EEA "overrides" Iceland's land rules** — the one refuted phrasing. EEA favourable treatment is *conditional* on exercising a treaty freedom (+ the Reg. 702/2002 declaration). Use the precise wording.
2. **The 2020 land cap is nationality-NEUTRAL (size-based)** — keep distinct from the *separate* non-EEA property-permit regime (~3.5 ha, ministerial permission; EEA nationals exempt). Don't conflate.
3. **The *auðlindaákvæði* is a 2020 draft, never enacted** — state as proposed/draft, not current law.
4. **The veiðigjald figures are 2014** — phrase "in 2014."
5. **Ratcliffe** = the prominent *catalyst* that crystallised broader concern, not the sole cause; the law names no individual.

## Sourcing

Every ledger point carries ≥1 `source` with a valid URL + tier (build fails otherwise). Tiers: EC/EUR-Lex/EP/government.is/island.is/US State Dept/Venice Commission = `primary`; ScienceDirect study = `academic`; Iceland Review / RÚV = `press`. **Exact URLs come from `natural-resources.md`'s SOURCES section** (all present) — the plan pins them verbatim; the implementer must NOT invent URLs. The CELEX:52012SC0337 quotes are already verbatim-verified (full source preserved at `docs/research/_sources/CELEX_52012SC0337_EN_TXT.md`).

## Out of scope

- No `stakes`/`calculator`/`basket`; no component/schema change.
- Sector mechanics owned by sibling chapters (fisheries = quota mechanics; energy = grid/ACER; farming = subsidies) — this chapter owns only the **ownership/who-profits** lens.
- Forcing false balance — the chapter honestly leans "little changes."

## Verification

- `npm run build` green; page count **+2 → 22 pages**.
- `npm test` 15/15 (no logic touched).
- Home lists `01–08` contiguous, Auðlindir at `07`, Öryggi og orka at `08`.
- `/natural-resources/` + `/en/natural-resources/` render: hero, today/as-member, the ledger, uncertain box, source chips link out; both locales.
- Schema guardrail holds: every ledger point has ≥1 source.

## Notes

- **Icelandic copy is AI-draft** → Nína ([[review-status]]).
- All content from the **verified** `natural-resources.md` — no new research. Discipline points: the "EEA overrides" refuted phrasing, the nationality-neutral land cap vs the non-EEA permit regime, the auðlindaákvæði-is-a-draft flag.
- **This is the last of the 8 planned chapters** — once live, the full arc (Start-here + 8 chapters + Methodology) is complete. Push/deploy user-gated; AI-draft-disclosed/soft-launch precedent applies.
