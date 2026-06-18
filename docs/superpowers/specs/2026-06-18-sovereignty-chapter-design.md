# Design — Sovereignty chapter (`sovereignty.yaml`)

**Date:** 2026-06-18
**Status:** Approved in brainstorming.
**Type:** New dossier chapter (content-collection YAML) + one renumber. No component/schema change.

## Context & goal

Build the **Sovereignty** chapter from the verified research at `docs/research/sovereignty.md` (25/25 confirmed + a gap-closure pass that nailed the veto list, the constitutional transfer-of-powers question, and the EEA-law-share figure). It's the "fax democracy / vote-and-veto" chapter, and its honest finding is **a genuine trade, not a win for either side** — reframed as **"EEA rule-taker today vs full member with a vote,"** not "in vs out."

Content build only: a new `src/content/dossiers/sovereignty.yaml` + renumber one sibling. No new component, no schema change, no calculator, **no `stakes` hook** (decided in brainstorming — the dramatic numbers, 0.08% of population / 6-of-720 MEPs, render as invisible slivers on a 0–100% bar, and a single hook stat would tilt the "genuine trade" framing; the numbers instead live *in the losses ledger* with their counterweights in the gains column).

## Decisions (locked in brainstorming)

1. **Standard dossier**, same schema/rendering as the live chapters (`Dossier.astro`). From `sovereignty.md`.
2. **Title:** "Fullveldi / Sovereignty."
3. **No `stakes` hook, no `calculator`, no `basket`.**
4. **Order:** `sovereignty.yaml` = `order: 6`; **`security-energy.yaml` renumbers `6 → 7`** (Home shows the order as a visible `0N` number → contiguous `01 … 06 Fullveldi · 07 Öryggi og orka`). (Natural-resources later slots 07 and security-energy → 08.)
5. **The 0.08% number is shown prominently in the LOSSES column**, balanced by the gains column (over-representation, surviving veto, shelter) — not as a hook.
6. **Balanced ledger** (~4 gains / 3 losses / 3 uncertain) — reflects the "genuine trade, no winner" verdict.

## Content structure (from the verified `sovereignty.md`)

Standard dossier fields. Icelandic is AI-draft → Nína review.

- **tldr:** Not "in vs out" but "EEA rule-taker today vs member with a vote." A genuine trade.
- **summary:** Today Iceland already adopts single-market law with no seat/vote/MEPs ("fax democracy"); membership converts rule-taking into rule-shaping (vote, ~6 MEPs, Commissioner, presidency) but formally transfers sovereignty in areas outside the EEA; Iceland would be a tiny minority (~0.08%) — yet over-represented, with vetoes surviving in the sensitive areas. No evidentiary winner.
- **today ("fax democracy"):** no access to Council/Parliament/European Council — decision-*shaping* only (EEA Art. 99/100 expert groups + comitology, advisory); law incorporated every few weeks via the Joint Committee (Art. 102); no clean veto. **Caveat baked in:** Iceland *won* the Icesave case at the EFTA Court (28 Jan 2013) — the EU's crisis-era pressure was political, not a legal defeat.
- **asMember:** gain a Council vote, ~6 MEPs, a Commissioner, the rotating presidency; but areas outside the EEA (agriculture, fisheries, customs union, common trade policy, CFSP, monetary union) move under EU competence.

### Ledger
- **Gains:**
  1. **A real vote & seat** — Council vote, ~6 MEPs (the floor — *note: "~6" is a modelled EU-40 scenario*), own Commissioner, rotating presidency — replacing today's no-vote rule-taking. *(EP MEPs; Treaty of Nice summary; OAPEN)* — `high`.
  2. **The system over-represents small states** — degressive proportionality (Art. 14(2) TEU): a small-state vote carries ~10× the per-capita MEP weight of a German's. *(EP study IPOL_IDA(2024)759467)* — `high`.
  3. **A veto survives where it matters most** — unanimity (so even Iceland holds a veto) in CFSP, tax harmonisation, treaty change, enlargement, the budget/own-resources & MFF, and new citizen rights. *(Consilium "unanimity")* — `high`.
  4. **Punch-above-weight + "shelter"** — small states can punch above their weight via selective, persuasion-based diplomacy (Panke); and multilateral "shelter" is more reliable than going alone (Thorhallsson, presented as his theory). *(Panke; Thorhallsson)* — `medium`.
- **Losses:**
  1. **Tiny voting weight** — ~**0.08% of the EU's ~449m population** (~382k), **~6 of 720 MEPs**, and **outvotable in the ~80% of legislation decided by QMV** (55% of states + 65% of population; blocking minority needs ≥4 states). *(EP MEPs; Consilium QMV)* — `high`. **(Front-and-centre, per brainstorming.)**
  2. **The structural "double challenge"** — fewer votes, less economic weight, fewer experts/administrative resources → negotiating disadvantage, plus limited ability to threaten blockage where QMV applies (most policy). *(Panke; OAPEN)* — `high`.
  3. **Formal transfer of sovereignty** — areas now outside the EEA (agriculture, fisheries, trade, CFSP, monetary union) move under EU competence. *(EFTA Q&A — what the EEA doesn't cover; government.is)* — `high`.
- **Uncertain:**
  1. **Constitutional transfer-of-powers** — Iceland's constitution has **no** explicit transfer-of-powers clause (only Art. 21 + Art. 2); full membership is widely argued to need an **amendment first** (Art. 79: two successive parliaments + an intervening election). *(Constitution of Iceland; Iceland Review)* — `medium`. **Trap to avoid in copy:** do NOT cite the "revocable transfer + referendum" clause as current — that's the FAILED 2011 draft, never enacted. (Simplest safe handling: don't mention the draft at all; state only that the in-force constitution lacks a clause.)
  2. **EEA-vs-EU primacy is contested** — dualist defence (EEA doesn't transfer legislative power) vs the Protocol 35 dispute (ESA infringement proceedings; the Icelandic Supreme Court has set EEA law aside). Present as a live debate, no winner. *(ESA Protocol 35 reasoned opinion; Méndez-Pinedo)* — `medium`.
  3. **How much EU law Iceland already takes via the EEA** — EFTA's count is **~5,000 acts in force** (of >9,500 ever incorporated); the popular **"two-thirds"** is Commissioner Rehn's *contested* estimate of acquis uptake, not a measured share of Icelandic law. *(EFTA EEA-Lex)* — `medium`.

## Caveats baked into the copy (the research insists)

1. **The "revocable transfer + referendum" constitutional clause is the FAILED 2011 draft — never enacted.** Do not state it as current law. (Handled by simply not citing the draft; the uncertain point states only that the *in-force* constitution lacks a transfer clause.)
2. **"~6 MEPs" is a modelled EU-40 scenario, not enacted law** — phrase as "~6 / likely the floor."
3. **Icesave:** Iceland *won* at the EFTA Court — the EU's crisis pressure was political, not a legal verdict. (In the `today` narrative.)
4. **Avoid the pre-Lisbon Hosli figures** — the over-representation gain uses the current EP degressive-proportionality study, not Hosli's pre-Lisbon Council numbers (keeps it clean + current).

## Sourcing

Every ledger point carries ≥1 `source` with a valid URL + tier (build fails otherwise). Tiers: Council/EP/Commission/EUR-Lex/EFTA/government.is/Constitution = `primary`; Thorhallsson, Panke, OAPEN, Méndez-Pinedo (academic interpretation) = `academic`; Iceland Review = `press`. **Exact URLs come from `sovereignty.md`'s SOURCES section** (all present) — the implementation plan pins them verbatim; the implementer must NOT invent URLs.

## Out of scope

- No `stakes`/`calculator`/`basket`; no component or schema change.
- Natural-resources chapter (next/last).
- Re-opening the contested constitutional/primacy debate to a verdict — it's presented as contested.

## Verification

- `npm run build` green; page count **+2 → 20 pages**.
- `npm test` 15/15 (no logic touched).
- Home lists `01–07` contiguous, Sovereignty at `06`, Security & energy at `07`.
- `/sovereignty/` + `/en/sovereignty/` render: hero, today/as-member, the balanced gains/losses ledger (0.08% prominent in losses), uncertain box, source chips link out; both locales.
- Schema guardrail holds: every ledger point has ≥1 source.

## Notes

- **Icelandic copy is AI-draft** → Nína ([[review-status]]).
- All content from the **verified** `sovereignty.md` — no new research. Discipline points: the 2011-draft trap, the "~6 MEPs is modelled," and keeping the primacy/constitutional question *contested* (no verdict).
- Push/deploy user-gated, AI-draft-disclosed/soft-launch precedent applies.
