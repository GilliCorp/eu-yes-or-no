# Verðtrygging → Home-loans Merge — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate the orphaned `verdtrygging` chapter into the `husnaedislan` (home-loans) chapter — verðtrygging becomes an honest "understand verðtrygging" callout, home loans stays the star, the ledger holds only euro/EU effects, and chapters renumber to a contiguous `01–05`.

**Architecture:** Add one optional bilingual `contextNote` field to the dossier Zod schema; render it as a distinct callout near the top of `Dossier.astro`. Then rewrite `husnaedislan.yaml` (merge content + relocate verðtrygging's two euro-effect gains), delete `verdtrygging.yaml`, and renumber the remaining chapters. Pure content + a small render addition — no new framework, no JS.

**Tech Stack:** Astro 6 content collections (`glob` loader), Zod schema (`astro/zod`), bilingual `loc` objects, Vitest (existing, untouched), zero-JS `.astro` components.

## Global Constraints

- **Bilingual or build-fails:** every user-facing string is a `loc = { is, en }` with both non-empty. The new `contextNote` is `loc.optional()`.
- **Sources on ledger points only:** every `point` in `gains`/`losses`/`uncertain` keeps `sources` with `.min(1)` — a sourceless point is a build error. The `contextNote` is unsourced narrative prose (like `summary`/`today`/`asMember`), by design.
- **Node ≥ 22.12** (Astro 6). Use the repo's existing toolchain.
- **Home displays `order` as a visible `01`/`02`… number** — numbering must stay gap-free.
- **Verification = `npm run build` green + `npm test` green + visual check.** There is no unit-test harness for `.astro` rendering; "tests" here are the build (schema + type validation) plus grep/visual checks of `dist/`.
- **Icelandic copy is AI-draft** → the merged chapter is flagged for Nína's native review (not blocking).
- **Conventional-commit messages**, end with the `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>` trailer.

---

### Task 1: Add the `contextNote` field, i18n label, and callout render

**Files:**
- Modify: `src/content.config.ts` (add field to the dossier schema, ~line 70)
- Modify: `src/i18n/ui.ts` (add `dossier.contextNote` to both `is` and `en`)
- Modify: `src/components/Dossier.astro` (render the callout + scoped CSS)

**Interfaces:**
- Produces: schema field `contextNote?: { is: string; en: string }` on dossier entries; UI key `'dossier.contextNote'`; a `.context-note` callout that renders only when `d.contextNote` is present.
- Consumes: existing `loc` Zod object; existing `t(lang, key)` helper; existing CSS custom properties (`--brass`, `--line-strong`, `--paper-raised`).

- [ ] **Step 1: Add the optional schema field**

In `src/content.config.ts`, inside the `dossiers` `schema: z.object({ ... })`, add the field immediately after `asMember: loc,` (keep it grouped with the narrative fields, before `gains`):

```ts
    asMember: loc, // what changes with full EU membership
    // Optional unsourced "scope note" callout rendered near the top of a chapter —
    // narrative prose (like summary/today), NOT a sourced ledger point. Used to flag
    // a topic that isn't directly an EU matter but earns a place for context.
    contextNote: loc.optional(),
    gains: z.array(point).default([]),
```

- [ ] **Step 2: Add the bilingual UI label**

In `src/i18n/ui.ts`, add one key to BOTH language blocks. In the `is` block, after `'dossier.asMemberSub': 'Það sem breytist með fullri aðild',`:

```ts
    'dossier.contextNote': 'Rétt að hafa í huga',
```

In the `en` block, after `'dossier.asMemberSub': 'What changes with full membership',`:

```ts
    'dossier.contextNote': 'Worth knowing',
```

- [ ] **Step 3: Render the callout in `Dossier.astro`**

In `src/components/Dossier.astro`, insert the callout between the closing `</header>` (currently line 51) and the `{d.stakes && ...}` line (currently line 53):

```astro
  </header>

  {d.contextNote && (
    <aside class="context-note">
      <p class="cn-label">{t(lang, 'dossier.contextNote')}</p>
      <p class="cn-body">{d.contextNote[lang]}</p>
    </aside>
  )}

  {d.stakes && d.stakes.length > 0 && <Stakes bars={d.stakes} lang={lang} />}
```

- [ ] **Step 4: Add scoped styles**

In the `<style>` block of `Dossier.astro`, add after the `/* Hero */` rules (after the `.summary { ... }` line, ~line 173):

```css
  /* Context note — an unsourced aside, distinct from the gain/loss ledger */
  .context-note {
    border: 1px solid var(--line-strong); border-left: 4px solid var(--brass);
    border-radius: 4px; background: var(--paper-raised);
    padding: 1.25rem clamp(1rem, 3vw, 1.6rem); margin: 0 0 3.5rem; max-width: 44rem;
  }
  .cn-label {
    font-family: var(--mono); font-size: 0.72rem; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--brass); margin: 0 0 0.6rem;
  }
  .cn-body { margin: 0; font-size: 1rem; color: #34322d; }
```

- [ ] **Step 5: Build to verify no regression (no chapter uses the field yet)**

Run: `npm run build`
Expected: PASS (green). No existing chapter sets `contextNote`, so the callout renders nowhere yet and all existing pages are unchanged. The optional field must not break the schema.

- [ ] **Step 6: Commit**

```bash
git add src/content.config.ts src/i18n/ui.ts src/components/Dossier.astro
git commit -m "feat(dossier): optional contextNote callout field + render

Adds an optional bilingual contextNote to the dossier schema and renders it
as a distinct (unsourced, brass-accented) aside near the top of a chapter.
Reusable by any chapter needing a scope note; no chapter uses it yet.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Merge verðtrygging into `husnaedislan.yaml`; delete `verdtrygging.yaml`

**Files:**
- Modify: `src/content/dossiers/husnaedislan.yaml` (order → 1, add `contextNote`, add 2 gains, bump `lastReviewed`)
- Delete: `src/content/dossiers/verdtrygging.yaml`

**Interfaces:**
- Consumes: the `contextNote` field + callout from Task 1; the two existing `gains` entries in `verdtrygging.yaml` (copied verbatim, with their Central Bank / ECB sources).
- Produces: a single home-loans chapter at `order: 1` whose ledger is 4 gains / 3 losses / 2 uncertain, all euro/EU effects, with a verðtrygging contextNote.

- [ ] **Step 1: Set `order: 1` and bump the review date**

In `src/content/dossiers/husnaedislan.yaml`, change the first line `order: 2` → `order: 1`, and change `lastReviewed: 2026-06-17` → `lastReviewed: 2026-06-18`.

- [ ] **Step 2: Add the `contextNote` field**

In `src/content/dossiers/husnaedislan.yaml`, insert the `contextNote` block immediately after the `asMember:` block and before `gains:` (match the file's existing 2-space indentation and `>-` folded-scalar style):

```yaml
contextNote:
  is: >-
    Verðtrygging — vísitölubinding lána — er ekki hluti af aðildarviðræðum við ESB,
    og aðild myndi hvorki banna hana né breyta henni beint; EES-reglurnar sem gilda um
    hana eru þegar í gildi, og mesti þrýstingurinn á hana í dag er innlendur (dómar
    Hæstaréttar 2025, tímabundið hlé á verðtryggðum lánum og áform stjórnvalda um að
    minnka vægi þeirra frá 2027). Hún á heima í þessum kafla af tveimur heiðarlegum
    ástæðum: hún er það sem Íslendingar tengja helst við evruna, og hún verður fyrir
    óbeinum áhrifum — á löngu, margra ára evruferli myndi lág verðbólga fjarlægja það
    sem lætur verðtrygginguna bíta (þau evruáhrif eru í ávinningnum hér að neðan). Og
    hún er tvíeggjuð: verðtrygging heldur mánaðarlegum greiðslum lægri þegar vextir eru
    háir, og venjan er lífseig — þegar vextir hækkuðu eftir 2023 færðu heimili sig aftur
    í verðtryggð lán.
  en: >-
    Verðtrygging — the CPI-indexing of loans — is not part of the EU accession talks,
    and membership would neither ban nor change it directly; the EEA rules that govern
    it already apply, and today's real pressure on it is domestic (2025 Supreme Court
    rulings, a pause in indexed lending, and a government plan to cut its weight from
    2027). It earns a place in this chapter for two honest reasons: it's the issue
    Icelanders most associate with the euro, and it's indirectly affected — over a slow,
    multi-year euro path, low inflation would remove what makes indexing bite (those
    euro effects are the gains below). And it's double-edged, not just a burden:
    indexing keeps monthly payments lower when rates are high, and habit makes it
    sticky — when rates rose after 2023, households moved back toward indexed loans.
```

- [ ] **Step 3: Relocate verðtrygging's two euro-effect gains into the home-loans `gains` list**

Open `src/content/dossiers/verdtrygging.yaml`, copy its **two `gains` entries verbatim** (each full block: `claim` is/en, `affects`, `confidence`, `sources`), and append them to the **end of the existing `gains:` list** in `husnaedislan.yaml`. They are:

```yaml
  - claim:
      is: "Evran fjarlægir gengisfall krónunnar sem keyrir verðbólgu beint inn í verðtryggð lán. Eftir hrunið 2008 féll krónan um meira en helming og um 80% skulda heimila voru verðtryggð — hækkunin lenti beint á lántökum."
      en: "The euro removes the króna devaluation that drives inflation straight into indexed loans. After the 2008 crash the króna fell by more than half and about 80% of household debt was indexed — the rise landed directly on borrowers."
    affects: ["homeowners", "borrowers"]
    confidence: high
    sources:
      - title: "Economic Affairs No. 6 — Iceland's currency and exchange rate policy options"
        url: "https://www.cb.is/library/Skraarsafn---EN/Economic-Affairs/Economic%20Affairs_no%206.pdf"
        publisher: "Central Bank of Iceland"
        tier: primary
  - claim:
      is: "Til að taka upp evru þarf lága og stöðuga verðbólgu (Maastricht-skilyrðin) — einmitt þær aðstæður þar sem verðtryggingin missir tilgang sinn."
      en: "Adopting the euro requires low, stable inflation (the Maastricht criteria) — exactly the conditions under which verðtrygging loses its purpose."
    affects: ["borrowers"]
    confidence: high
    sources:
      - title: "Convergence criteria for joining the euro area"
        url: "https://www.ecb.europa.eu/ecb/orga/escb/html/convergence-criteria.en.html"
        publisher: "European Central Bank"
        tier: primary
```

Leave `husnaedislan.yaml`'s existing `losses` (3) and `uncertain` (2) lists unchanged. Do **not** copy verðtrygging's `losses`/`uncertain` — those are domestic-verðtrygging facts now represented by the `contextNote` (L1 + U3 in beat 3, U1 in beat 1), and verðtrygging's "euro is years away" uncertain point duplicates the home-loan one.

- [ ] **Step 4: Delete the standalone chapter**

```bash
git rm src/content/dossiers/verdtrygging.yaml
```

- [ ] **Step 5: Build and verify the merge**

Run: `npm run build`
Expected: PASS. Then verify the structural outcomes:

```bash
test ! -e dist/verdtrygging/index.html && echo "OK: /verdtrygging removed"
test ! -e dist/en/verdtrygging/index.html && echo "OK: /en/verdtrygging removed"
# Icelandic label on the is page (/), English label on the en page (/en/):
grep -q "Rétt að hafa í huga" dist/husnaedislan/index.html && echo "OK: is contextNote label"
grep -q "Worth knowing" dist/en/husnaedislan/index.html && echo "OK: en contextNote label"
grep -q "indexed loans" dist/en/husnaedislan/index.html && echo "OK: relocated gain text present"
```
Expected: all five `OK:` lines print — the two `/verdtrygging/` routes are gone and the merged home-loans page carries the callout label (per locale) and the relocated gain.

- [ ] **Step 6: Visually confirm the callout + ledger**

Run: `npm run preview` (on the fresh build) and open `/en/husnaedislan/` (or use the Playwright MCP `browser_navigate` + `browser_snapshot`). Confirm: the "Worth knowing" callout appears near the top (brass left border), the calculator still renders, and the gains column now shows the two euro/indexation points alongside the original two.

- [ ] **Step 7: Commit**

```bash
git add src/content/dossiers/husnaedislan.yaml
git commit -m "feat(content): merge verdtrygging into home-loans chapter

verdtrygging is now an 'understand verdtrygging' contextNote (not on the EU
table; domestic pressure; double-edged; inseparable from the mortgage). Its two
genuine euro effects (devaluation->indexed inflation; Maastricht low inflation)
move into the home-loans gains ledger. order: 1. verdtrygging.yaml deleted (no
redirect). Icelandic copy AI-draft -> Nina review.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Renumber the remaining chapters to `01–05` contiguous

**Files:**
- Modify: `src/content/dossiers/grocery-bill.yaml` (`order: 3 → 2`)
- Modify: `src/content/dossiers/job-and-prices.yaml` (`order: 4 → 3`)
- Modify: `src/content/dossiers/fisheries.yaml` (`order: 5 → 4`)
- Modify: `src/content/dossiers/security-energy.yaml` (`order: 7 → 5`)

**Interfaces:**
- Consumes: `husnaedislan.yaml` at `order: 1` (Task 2).
- Produces: contiguous chapter ordering `01 Home loans · 02 Grocery · 03 Jobs · 04 Fisheries · 05 Security & energy`, displayed gap-free on the Home page.

- [ ] **Step 1: Edit the four `order` values**

Change the top-of-file `order:` line in each:
- `src/content/dossiers/grocery-bill.yaml`: `order: 3` → `order: 2`
- `src/content/dossiers/job-and-prices.yaml`: `order: 4` → `order: 3`
- `src/content/dossiers/fisheries.yaml`: `order: 5` → `order: 4`
- `src/content/dossiers/security-energy.yaml`: `order: 7` → `order: 5`

- [ ] **Step 2: Build and verify contiguous numbering**

Run: `npm run build`
Expected: PASS. Then confirm the Home page lists five chapters with no number gap:

```bash
grep -oE 'class="num">[0-9]{2}' dist/index.html | sort -u
```
Expected: `01`, `02`, `03`, `04`, `05` (exactly five, contiguous — no `06`/`07`).

- [ ] **Step 3: Commit**

```bash
git add src/content/dossiers/grocery-bill.yaml src/content/dossiers/job-and-prices.yaml src/content/dossiers/fisheries.yaml src/content/dossiers/security-energy.yaml
git commit -m "chore(content): renumber chapters 01-05 after verdtrygging merge

Home loans 1, Grocery 2, Jobs 3, Fisheries 4, Security & energy 5 (was 7) —
contiguous since Home displays the order as a visible number. National-half
chapters (farming/sovereignty/natural-resources) reslot when built.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Full verification + update memory/docs

**Files:**
- Modify: memory `review-status.md` and `project-overview.md` (status notes — see steps)

**Interfaces:**
- Consumes: the completed merge (Tasks 1–3).
- Produces: a green build + test run, and updated project memory reflecting the merge.

- [ ] **Step 1: Full build + existing test suite**

Run: `npm run build && npm test`
Expected: build green (page count is 2 fewer than before the merge — the removed `/verdtrygging/` + `/en/verdtrygging/`); Vitest green (the `loan-math` suite is untouched).

- [ ] **Step 2: Screenshot both locales of the merged chapter + Home (visual gate)**

Use the Playwright MCP (`browser_navigate` to the preview URLs, `browser_take_screenshot`) for: `/husnaedislan/`, `/en/husnaedislan/`, and `/` — confirm the contextNote callout, the 4-gain ledger, the calculator, and the contiguous `01–05` Home list. (Google Fonts won't load in the sandbox screenshot tool — that's expected; verify layout/content, not font rendering.)

- [ ] **Step 3: Update the review-status memory**

In `/Users/gilli/.claude/projects/-Users-gilli-Repos-github-gillicorp-eu-yes-or-no/memory/review-status.md`, replace the Ch1/Ch2 line with a note that verðtrygging and húsnæðislán are now **one merged chapter** ("Húsnæðislán", order 1, with the verðtrygging contextNote) whose combined Icelandic copy — including the new `contextNote` and the relocated gains — is AI-draft awaiting Nína's review. Keep the MEMORY.md index line accurate.

- [ ] **Step 4: Update the project-overview memory**

In `/Users/gilli/.claude/projects/-Users-gilli-Repos-github-gillicorp-eu-yes-or-no/memory/project-overview.md`, add a dated note: the verðtrygging chapter was merged into húsnæðislán (verðtrygging now a contextNote; ledger = euro/EU effects only; chapters renumbered 01–05; `/verdtrygging/` removed, no redirect). Reference the spec + plan paths. Note the accession "Start here" intro page is the next build (sub-project 2).

- [ ] **Step 5: Final commit + push**

```bash
git add -A
git commit -m "docs: record verdtrygging->home-loans merge in project memory

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
git push
```

---

## Notes for the executor

- **Order matters:** Task 1 (the field + render) must land before Task 2 (content that uses it), or the build rejects the unknown `contextNote` key.
- **YAML hygiene:** match the existing file's indentation (2 spaces) and the `>-` folded-scalar style for prose. A stray tab or wrong indent fails the YAML parse at build time.
- **No redirect** for `/verdtrygging/` is intentional (only 3 people have the link; told it's WIP). Don't add one.
- **Icelandic prose is AI-draft.** Don't agonize over the wording — it's flagged for Nína. Correctness of structure/sources is what matters here.
- This is **sub-project 1 of 2**. The accession "Start here" intro page is a separate spec/plan, not in scope here.
