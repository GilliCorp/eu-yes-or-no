# Chapter 2 Calculator Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the Húsnæðislán calculator to lead with total loan cost and a 3-way comparison (indexed / non-indexed / euro), with familiar bank-style inputs, replacing the household presets.

**Architecture:** Extract the loan math into a pure, unit-tested TypeScript module (`src/lib/loan-math.ts`) consumed by both Vitest and the Calculator island. The Astro component server-renders the result scaffold (labels + empty number/bar slots) and a client module-script imports the math + sourced assumptions, reads the inputs, and fills the slots. This removes the old `define:vars` inline script (which blocked imports) and fixes the earlier scoped-style workaround since cards are now server-rendered.

**Tech Stack:** Astro 6, TypeScript, vanilla DOM (no UI framework), Vitest for unit tests, inline CSS bars (no charting library).

## Global Constraints

- Node ≥ 22.12 (Astro 6). Vitest run via `npx vitest`.
- Every displayed figure is a **range** (low–high) from `src/data/assumptions.ts`; never a bare point estimate.
- Every rate/figure keeps its **source citation** (the assumptions panel stays).
- Permanent **"Skýringardæmi — ekki spá"** disclaimer stays; inflation assumption shown on-screen.
- Bilingual: every user-facing string exists in `is` and `en` via `src/i18n/ui.ts`.
- No charting library; bars are CSS/SVG. No new runtime dependencies (Vitest is devDependencies only).
- Comparison metric = **total in today's krónur (real)**; **nominal** total shown as a label too.

---

### Task 1: Pure loan-math module + Vitest

**Files:**
- Create: `src/lib/loan-math.ts`
- Create: `src/lib/loan-math.test.ts`
- Modify: `package.json` (add devDependency + `test` script)

**Interfaces:**
- Produces: `annuity(principal: number, annualRatePct: number, years: number): number`
- Produces: `computeLoan(kind: LoanKind, principal: number, years: number, rate: Band, inflation: Band): LoanResult`
  where `type LoanKind = 'indexed' | 'nonindexed' | 'euro'`,
  `interface Band { min: number; typ: number; max: number }`,
  `interface Range { lo: number; typ: number; hi: number }`,
  `interface LoanResult { kind: LoanKind; monthlyStart: Range; monthlyAfter10: Range | null; totalNominal: Range; totalReal: Range; principal: number; interestReal: Range }`

- [ ] **Step 1: Add Vitest + test script to package.json**

Edit `package.json`: add to `scripts` a `"test": "vitest run"` entry, and add a `devDependencies` block:

```json
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "test": "vitest run"
  },
  "devDependencies": {
    "vitest": "^2.1.0"
  }
```

Then run: `npm install`
Expected: vitest installed, no errors.

- [ ] **Step 2: Write the failing tests**

Create `src/lib/loan-math.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { annuity, computeLoan, type Band } from './loan-math';

const rate = (min: number, typ: number, max: number): Band => ({ min, typ, max });

describe('annuity', () => {
  it('splits principal evenly at 0% interest', () => {
    expect(annuity(1_200_000, 0, 1)).toBeCloseTo(100_000, 0); // 12 months
  });
  it('is higher than principal/n when rate > 0', () => {
    const p = annuity(10_000_000, 6, 30);
    expect(p).toBeGreaterThan(10_000_000 / 360);
  });
});

describe('computeLoan', () => {
  const P = 40_000_000;
  const infl = rate(2.5, 3.8, 5.1);

  it('non-indexed: nominal total >= real total (discounting reduces real)', () => {
    const r = computeLoan('nonindexed', P, 30, rate(8.75, 9.2, 9.7), infl);
    expect(r.totalNominal.typ).toBeGreaterThan(r.totalReal.typ);
    expect(r.monthlyAfter10).toBeNull();
  });

  it('non-indexed: total nominal equals flat payment times months', () => {
    const r = computeLoan('nonindexed', P, 30, rate(9, 9, 9), rate(0, 0, 0));
    expect(r.totalNominal.typ).toBeCloseTo(r.monthlyStart.typ * 360, -3);
  });

  it('indexed: payment after 10 years exceeds the start payment (grows with inflation)', () => {
    const r = computeLoan('indexed', P, 30, rate(4.49, 4.6, 5.25), infl);
    expect(r.monthlyAfter10!.typ).toBeGreaterThan(r.monthlyStart.typ);
  });

  it('indexed: real total is close to start payment times months (indexation washes out in real terms)', () => {
    const r = computeLoan('indexed', P, 30, rate(4.6, 4.6, 4.6), rate(4, 4, 4));
    expect(r.totalReal.typ).toBeCloseTo(r.monthlyStart.typ * 360, -4);
  });

  it('principal + real interest equals real total', () => {
    const r = computeLoan('euro', P, 30, rate(3.31, 3.44, 3.61), infl);
    expect(r.principal + r.interestReal.typ).toBeCloseTo(r.totalReal.typ, -1);
  });

  it('ranges are ordered lo <= typ <= hi for every figure', () => {
    const r = computeLoan('indexed', P, 30, rate(4.49, 4.6, 5.25), infl);
    for (const k of ['monthlyStart', 'totalNominal', 'totalReal', 'interestReal'] as const) {
      expect(r[k]!.lo).toBeLessThanOrEqual(r[k]!.typ + 1);
      expect(r[k]!.typ).toBeLessThanOrEqual(r[k]!.hi + 1);
    }
  });

  it('euro is cheaper in real terms than non-indexed at the same principal/term', () => {
    const e = computeLoan('euro', P, 30, rate(3.31, 3.44, 3.61), infl);
    const n = computeLoan('nonindexed', P, 30, rate(8.75, 9.2, 9.7), infl);
    expect(e.totalReal.typ).toBeLessThan(n.totalReal.typ);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run src/lib/loan-math.test.ts`
Expected: FAIL — `Failed to resolve import './loan-math'` (module not created yet).

- [ ] **Step 4: Implement `src/lib/loan-math.ts`**

```ts
export type LoanKind = 'indexed' | 'nonindexed' | 'euro';

export interface Band { min: number; typ: number; max: number }
export interface Range { lo: number; typ: number; hi: number }

export interface LoanResult {
  kind: LoanKind;
  monthlyStart: Range;       // month-1 nominal payment
  monthlyAfter10: Range | null; // indexed only
  totalNominal: Range;       // sum of nominal payments over the term
  totalReal: Range;          // total discounted to today's krónur
  principal: number;
  interestReal: Range;       // totalReal - principal
}

/** Standard annuity: fixed monthly payment for `principal` at `annualRatePct` over `years`. */
export function annuity(principal: number, annualRatePct: number, years: number): number {
  const n = years * 12;
  if (n <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  return r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));
}

/** Simulate one loan at a fixed rate + inflation; returns nominal + real totals and start/10yr payment. */
function simulate(
  kind: LoanKind,
  principal: number,
  years: number,
  ratePct: number,
  inflPct: number,
): { totalNominal: number; totalReal: number; monthlyStart: number; monthlyAfter10: number } {
  const months = years * 12;
  const inflM = Math.pow(1 + inflPct / 100, 1 / 12) - 1;
  const basePay = annuity(principal, ratePct, years); // indexed: real annuity; others: nominal flat
  let totalNominal = 0;
  let totalReal = 0;
  for (let m = 1; m <= months; m++) {
    const nominalPay = kind === 'indexed' ? basePay * Math.pow(1 + inflM, m) : basePay;
    totalNominal += nominalPay;
    totalReal += nominalPay / Math.pow(1 + inflM, m);
  }
  const monthlyStart = kind === 'indexed' ? basePay : basePay; // year-0 price level
  const monthlyAfter10 = basePay * Math.pow(1 + (kind === 'indexed' ? inflPct / 100 : 0), 10);
  return { totalNominal, totalReal, monthlyStart, monthlyAfter10 };
}

/** Evaluate a metric across the rate×inflation uncertainty corners → {lo, typ, hi}. */
function bandOf(
  pick: (rate: number, infl: number) => number,
  rate: Band,
  inflation: Band,
): Range {
  const corners = [
    pick(rate.min, inflation.min), pick(rate.min, inflation.max),
    pick(rate.max, inflation.min), pick(rate.max, inflation.max),
  ];
  return { lo: Math.min(...corners), typ: pick(rate.typ, inflation.typ), hi: Math.max(...corners) };
}

export function computeLoan(
  kind: LoanKind,
  principal: number,
  years: number,
  rate: Band,
  inflation: Band,
): LoanResult {
  const sim = (r: number, i: number) => simulate(kind, principal, years, r, i);
  const totalNominal = bandOf((r, i) => sim(r, i).totalNominal, rate, inflation);
  const totalReal = bandOf((r, i) => sim(r, i).totalReal, rate, inflation);
  const monthlyStart = bandOf((r, i) => sim(r, i).monthlyStart, rate, inflation);
  const monthlyAfter10 =
    kind === 'indexed' ? bandOf((r, i) => sim(r, i).monthlyAfter10, rate, inflation) : null;
  const interestReal: Range = {
    lo: totalReal.lo - principal,
    typ: totalReal.typ - principal,
    hi: totalReal.hi - principal,
  };
  return { kind, monthlyStart, monthlyAfter10, totalNominal, totalReal, principal, interestReal };
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/lib/loan-math.test.ts`
Expected: PASS (all tests green).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/lib/loan-math.ts src/lib/loan-math.test.ts
git commit -m "feat: tested pure loan-math module (annuity + total cost bands)"
```

---

### Task 2: Update assumptions + i18n labels

**Files:**
- Modify: `src/data/assumptions.ts` (remove `PRESETS` + `Preset`)
- Modify: `src/i18n/ui.ts` (add new calc labels, both languages)

**Interfaces:**
- Consumes: nothing new.
- Produces: i18n keys used by Task 3 — `calc.purchasePrice`, `calc.equity`, `calc.loanAmount`, `calc.ltv`, `calc.total`, `calc.totalReal`, `calc.totalNominal`, `calc.principal`, `calc.interest`, `calc.indexation`, `calc.monthlyStart`, `calc.termCapNote`, `calc.cheapest`.

- [ ] **Step 1: Remove the now-unused presets from assumptions.ts**

Delete the `Preset` interface and the `PRESETS` export at the bottom of `src/data/assumptions.ts` (the household presets are being removed). Leave `ASSUMPTIONS` and the `Assumption`/`Source` types unchanged.

- [ ] **Step 2: Add the new labels to ui.ts (Icelandic)**

In `src/i18n/ui.ts`, inside the `is:` object, replace the old preset keys (`calc.preset*`) and add the new keys:

```ts
    'calc.title': 'Reiknaðu húsnæðislánið',
    'calc.sub': 'Sjáðu heildarkostnað lánsins — og hvernig verðtryggt, óverðtryggt og evru-lán bera sig saman.',
    'calc.purchasePrice': 'Kaupverð',
    'calc.equity': 'Eigið fé',
    'calc.loanAmount': 'Lánsupphæð',
    'calc.ltv': 'Veðsetning',
    'calc.term': 'Lánstími',
    'calc.years': 'ár',
    'calc.scenario.indexed': 'Verðtryggt',
    'calc.scenario.nonindexed': 'Óverðtryggt',
    'calc.scenario.euro': 'Evru-lán',
    'calc.total': 'Heildargreiðsla',
    'calc.totalReal': 'á verðlagi í dag',
    'calc.totalNominal': 'nafnvirði',
    'calc.principal': 'höfuðstóll',
    'calc.interest': 'vextir',
    'calc.indexation': 'verðbætur',
    'calc.monthlyStart': 'Á mánuði í byrjun',
    'calc.in10': 'eftir 10 ár',
    'calc.cheapest': 'lægsti heildarkostnaður',
    'calc.termCapNote': 'Til samanburðar er sami lánstími notaður; í reynd eru verðtryggð lán oft að hámarki 25 ár og óverðtryggð 40 ár.',
    'calc.rate': 'vextir',
    'calc.disclaimer': 'Skýringardæmi byggt á uppgefnum forsendum — ekki spá. Evru-upptaka er háð skilyrðum og mörg ár í burtu.',
    'calc.assumptions': 'Forsendur og heimildir',
```

(Remove the old `calc.preset`, `calc.preset.alone/couple/family/custom`, `calc.now`, `calc.indexedNote`, `calc.flatNote`, `calc.provisional`, `calc.perMonth` keys.)

- [ ] **Step 3: Add the same keys to ui.ts (English)**

In the `en:` object, mirror them:

```ts
    'calc.title': 'Calculate your home loan',
    'calc.sub': 'See the total cost of the loan — and how indexed, non-indexed and a euro loan compare.',
    'calc.purchasePrice': 'Purchase price',
    'calc.equity': 'Equity',
    'calc.loanAmount': 'Loan amount',
    'calc.ltv': 'Loan-to-value',
    'calc.term': 'Loan term',
    'calc.years': 'yrs',
    'calc.scenario.indexed': 'Indexed',
    'calc.scenario.nonindexed': 'Non-indexed',
    'calc.scenario.euro': 'Euro loan',
    'calc.total': 'Total repaid',
    'calc.totalReal': "in today's krónur",
    'calc.totalNominal': 'nominal',
    'calc.principal': 'principal',
    'calc.interest': 'interest',
    'calc.indexation': 'indexation',
    'calc.monthlyStart': 'Per month at start',
    'calc.in10': 'after 10 yrs',
    'calc.cheapest': 'lowest total cost',
    'calc.termCapNote': 'For comparison the same term is used; in practice indexed loans cap around 25 years and non-indexed around 40.',
    'calc.rate': 'rate',
    'calc.disclaimer': 'Illustrative scenario based on stated assumptions — not a prediction. Euro adoption is conditional and years away.',
    'calc.assumptions': 'Assumptions & sources',
```

- [ ] **Step 4: Typecheck**

Run: `npm run build`
Expected: build succeeds. (If it fails because `Calculator.astro` still references removed keys/PRESETS, that's expected — Task 3 rewrites it. To verify Task 2 alone, instead run `npx astro check` and confirm errors are only in `Calculator.astro`.)

- [ ] **Step 5: Commit**

```bash
git add src/data/assumptions.ts src/i18n/ui.ts
git commit -m "feat: calculator i18n labels for total-cost redesign; drop presets"
```

---

### Task 3: Rewrite Calculator.astro — inputs + computed totals

**Files:**
- Modify (full rewrite): `src/components/Calculator.astro`

**Interfaces:**
- Consumes: `annuity`/`computeLoan` from Task 1; labels from Task 2; `ASSUMPTIONS` from `assumptions.ts`.
- Produces: a working calculator with kaupverð/eigið fé/term inputs and total-cost numbers (bars added in Task 4).

- [ ] **Step 1: Replace the component frontmatter + template**

Overwrite `src/components/Calculator.astro` with the structure below. The client script is a **module** `<script>` (no `define:vars`) so it can `import`. Server-render labels; the script fills `data-fill` spans and bar widths.

```astro
---
import type { Lang } from '../i18n/ui';
import { t } from '../i18n/ui';
import { ASSUMPTIONS } from '../data/assumptions';

interface Props { lang: Lang }
const { lang } = Astro.props;
const loc = lang === 'is' ? 'is-IS' : 'en-GB';
const scenarios = [
  { kind: 'indexed', label: t(lang, 'calc.scenario.indexed') },
  { kind: 'nonindexed', label: t(lang, 'calc.scenario.nonindexed') },
  { kind: 'euro', label: t(lang, 'calc.scenario.euro') },
] as const;
---

<section class="calc" data-locale={loc} aria-labelledby="calc-h">
  <header class="calc-head">
    <p class="eyebrow">⚖ {t(lang, 'calc.title')}</p>
    <h2 id="calc-h">{t(lang, 'calc.sub')}</h2>
  </header>

  <div class="controls">
    <label class="field">
      <span class="ctrl-label">{t(lang, 'calc.purchasePrice')}</span>
      <span class="field-row">
        <input type="number" id="price" min="10000000" max="200000000" step="1000000" value="60000000" />
        <span class="unit">kr.</span>
      </span>
      <input type="range" id="price-range" min="10000000" max="200000000" step="1000000" value="60000000" aria-hidden="true" tabindex="-1" />
    </label>

    <label class="field">
      <span class="ctrl-label">{t(lang, 'calc.equity')}</span>
      <span class="field-row">
        <input type="number" id="equity" min="0" max="200000000" step="1000000" value="16000000" />
        <span class="unit">kr.</span>
      </span>
      <input type="range" id="equity-range" min="0" max="200000000" step="1000000" value="16000000" aria-hidden="true" tabindex="-1" />
    </label>

    <label class="field">
      <span class="ctrl-label">{t(lang, 'calc.term')}</span>
      <span class="field-row">
        <input type="number" id="term" min="5" max="40" step="1" value="30" />
        <span class="unit">{t(lang, 'calc.years')}</span>
      </span>
      <input type="range" id="term-range" min="5" max="40" step="1" value="30" aria-hidden="true" tabindex="-1" />
    </label>
  </div>

  <p class="derived">
    {t(lang, 'calc.loanAmount')}: <strong data-fill="loanAmount"></strong>
    · {t(lang, 'calc.ltv')}: <strong data-fill="ltv"></strong>
  </p>

  <div class="results">
    {scenarios.map((s) => (
      <div class={`rcard ${s.kind}`} data-kind={s.kind}>
        <p class="rlabel">{s.label} <span class="badge" data-fill={`badge-${s.kind}`}></span></p>
        <div class="bar" aria-hidden="true">
          <span class="seg seg-principal" data-bar={`principal-${s.kind}`}></span>
          <span class="seg seg-interest" data-bar={`interest-${s.kind}`}></span>
        </div>
        <p class="total">
          <span class="total-real" data-fill={`real-${s.kind}`}></span>
          <span class="total-sub">{t(lang, 'calc.totalReal')}</span>
        </p>
        <p class="total-nominal">
          {t(lang, 'calc.totalNominal')}: <span data-fill={`nominal-${s.kind}`}></span>
        </p>
        <p class="monthly">
          {t(lang, 'calc.monthlyStart')}: <span data-fill={`monthly-${s.kind}`}></span>
          <span class="m10" data-fill={`monthly10-${s.kind}`}></span>
        </p>
        <p class="rrate" data-fill={`rate-${s.kind}`}></p>
      </div>
    ))}
  </div>

  <p class="legend">
    <span class="key seg-principal"></span>{t(lang, 'calc.principal')}
    <span class="key seg-interest"></span>{t(lang, 'calc.interest')}
    · <span class="muted">{t(lang, 'calc.indexation')} = {t(lang, 'calc.totalNominal')} − {t(lang, 'calc.totalReal')}</span>
  </p>

  <p class="termcap">{t(lang, 'calc.termCapNote')}</p>
  <p class="disclaimer">⚠ {t(lang, 'calc.disclaimer')}</p>

  <details class="assumptions">
    <summary>{t(lang, 'calc.assumptions')}</summary>
    <ul>
      {Object.entries(ASSUMPTIONS).map(([key, a]) => (
        <li>
          <code>{key}</code>: {a.typical}% ({a.min}–{a.max}%)
          <a href={a.source.url} target="_blank" rel="noopener">{a.source.publisher}</a>
        </li>
      ))}
    </ul>
  </details>
</section>
```

- [ ] **Step 2: Add the module client script (below the template, before styles)**

```astro
<script>
  import { computeLoan } from '../lib/loan-math';
  import { ASSUMPTIONS } from '../data/assumptions';

  const root = document.currentScript?.closest('.calc') ?? document.querySelector('.calc');
  if (root) initCalc(root as HTMLElement);

  function initCalc(root: HTMLElement) {
    const loc = root.dataset.locale || 'is-IS';
    const fmt = new Intl.NumberFormat(loc, { maximumFractionDigits: 0 });
    const money = (n: number) => fmt.format(Math.round(n / 1000) * 1000) + ' kr.';
    const rng = (lo: number, hi: number) =>
      Math.abs(hi - lo) / Math.max(hi, 1) < 0.03 ? money(lo) : `${money(lo)} – ${money(hi)}`;

    const $ = (id: string) => root.querySelector<HTMLInputElement>('#' + id)!;
    const fill = (key: string, txt: string) => {
      const el = root.querySelector(`[data-fill="${key}"]`);
      if (el) el.textContent = txt;
    };
    const price = $('price'), priceR = $('price-range');
    const equity = $('equity'), equityR = $('equity-range');
    const term = $('term'), termR = $('term-range');

    const band = (a: { min: number; typical: number; max: number }) =>
      ({ min: a.min, typ: a.typical, max: a.max });

    function compute() {
      const P = Math.max(0, (Number(price.value) || 0) - (Number(equity.value) || 0));
      const yrs = Number(term.value) || 1;
      const infl = band(ASSUMPTIONS.inflation);
      const ltv = Number(price.value) > 0 ? Math.round((P / Number(price.value)) * 100) : 0;
      fill('loanAmount', money(P));
      fill('ltv', ltv + '%');

      const defs = [
        { kind: 'indexed' as const, rate: band(ASSUMPTIONS.indexedReal) },
        { kind: 'nonindexed' as const, rate: band(ASSUMPTIONS.nonIndexedNominal) },
        { kind: 'euro' as const, rate: band(ASSUMPTIONS.euroNominal) },
      ];
      const results = defs.map((d) => computeLoan(d.kind, P, yrs, d.rate, infl));
      const maxReal = Math.max(...results.map((r) => r.totalReal.typ), 1);
      const cheapest = results.reduce((a, b) => (a.totalReal.typ <= b.totalReal.typ ? a : b)).kind;

      for (const r of results) {
        fill(`real-${r.kind}`, rng(r.totalReal.lo, r.totalReal.hi));
        fill(`nominal-${r.kind}`, rng(r.totalNominal.lo, r.totalNominal.hi));
        fill(`monthly-${r.kind}`, rng(r.monthlyStart.lo, r.monthlyStart.hi));
        fill(`monthly10-${r.kind}`,
          r.monthlyAfter10 ? ` → ${rng(r.monthlyAfter10.lo, r.monthlyAfter10.hi)} ${L_in10(loc)}` : '');
        const a = ASSUMPTIONS[r.kind === 'indexed' ? 'indexedReal' : r.kind === 'nonindexed' ? 'nonIndexedNominal' : 'euroNominal'];
        fill(`rate-${r.kind}`, `${L_rate(loc)}: ${a.min}–${a.max}%`);
        fill(`badge-${r.kind}`, r.kind === cheapest ? '★' : '');
        // stacked bar widths (% of widest real total)
        const scale = (r.totalReal.typ / maxReal) * 100;
        const principalPct = (r.principal / r.totalReal.typ) * scale;
        const interestPct = scale - principalPct;
        setBar(`principal-${r.kind}`, principalPct);
        setBar(`interest-${r.kind}`, interestPct);
      }
    }
    function setBar(key: string, pct: number) {
      const el = root.querySelector<HTMLElement>(`[data-bar="${key}"]`);
      if (el) el.style.width = Math.max(0, pct) + '%';
    }
    // tiny locale-aware words for the runtime-only bits
    function L_in10(loc: string) { return loc.startsWith('is') ? 'eftir 10 ár' : 'after 10 yrs'; }
    function L_rate(loc: string) { return loc.startsWith('is') ? 'vextir' : 'rate'; }

    function bindPair(numEl: HTMLInputElement, rangeEl: HTMLInputElement) {
      numEl.addEventListener('input', () => { rangeEl.value = numEl.value; compute(); });
      rangeEl.addEventListener('input', () => { numEl.value = rangeEl.value; compute(); });
    }
    bindPair(price, priceR); bindPair(equity, equityR); bindPair(term, termR);
    compute();
  }
</script>
```

- [ ] **Step 3: Build to verify it compiles and numbers render**

Run: `npm run build`
Expected: build succeeds, 12 pages built.

- [ ] **Step 4: Verify rendered numbers (text)**

Run: `npm run preview &` then
`curl -s http://localhost:4321/eu-yes-or-no/husnaedislan/ | grep -o 'data-fill="real-euro"'`
Expected: the slot exists. Then kill preview. (Visual check is Task 4.)

- [ ] **Step 5: Commit**

```bash
git add src/components/Calculator.astro
git commit -m "feat: calculator inputs (price/equity/LTV) + total-cost math wiring"
```

---

### Task 4: Stacked comparison bars + styling

**Files:**
- Modify: `src/components/Calculator.astro` (the `<style>` block)

**Interfaces:**
- Consumes: the markup + `data-bar`/`data-fill` slots from Task 3.
- Produces: the finished visual — horizontal stacked bars, both totals, secondary monthly.

- [ ] **Step 1: Replace the `<style>` block**

Use the existing token variables (`--paper`, `--ink`, `--brass`, `--gain`, `--loss`, `--slate`, `--mono`, etc., defined globally in `Base.astro`). Because cards are now server-rendered (not innerHTML), styles are normal scoped — no `:global()` needed.

```astro
<style>
  .calc { border: 1px solid var(--line-strong); border-radius: 4px; background: var(--paper-raised); padding: clamp(1.25rem, 4vw, 2rem); margin: 0 0 3rem; }
  .calc-head { margin-bottom: 1.5rem; }
  .calc-head .eyebrow { font-family: var(--mono); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--brass); margin: 0 0 0.4rem; }
  .calc-head h2 { font-size: clamp(1.3rem, 3vw, 1.7rem); margin: 0; max-width: 38rem; }

  .controls { display: grid; grid-template-columns: 1fr; gap: 1.25rem; margin-bottom: 0.75rem; }
  @media (min-width: 38rem) { .controls { grid-template-columns: repeat(3, 1fr); } }
  .ctrl-label { display: block; font-family: var(--mono); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 0.5rem; }
  .field-row { display: flex; align-items: baseline; gap: 0.4rem; }
  .field input[type='number'] { width: 100%; font-family: var(--mono); font-size: 1.05rem; color: var(--ink); background: var(--paper); border: 1px solid var(--line-strong); border-radius: 2px; padding: 0.45rem 0.55rem; }
  .unit { font-family: var(--mono); font-size: 0.8rem; color: var(--muted); }
  .field input[type='range'] { width: 100%; margin-top: 0.6rem; accent-color: var(--slate); }

  .derived { font-family: var(--mono); font-size: 0.85rem; color: var(--slate); margin: 0 0 1.75rem; }
  .derived strong { color: var(--ink); }

  .results { display: grid; grid-template-columns: 1fr; gap: 0.75rem; }
  @media (min-width: 38rem) { .results { grid-template-columns: repeat(3, 1fr); } }
  .rcard { border: 1px solid var(--line-strong); border-radius: 3px; padding: 1rem; background: var(--paper); border-top: 3px solid var(--line-strong); }
  .rcard.indexed { border-top-color: var(--brass); }
  .rcard.nonindexed { border-top-color: var(--loss); }
  .rcard.euro { border-top-color: var(--gain); }
  .rlabel { font-family: var(--display); font-weight: 600; font-size: 1.05rem; margin: 0 0 0.6rem; }
  .badge { color: var(--gain); }

  .bar { display: flex; height: 0.85rem; background: var(--paper-raised); border: 1px solid var(--line); border-radius: 2px; overflow: hidden; margin-bottom: 0.6rem; }
  .seg { height: 100%; transition: width 0.2s ease; }
  .seg-principal { background: var(--slate); }
  .seg-interest { background: var(--brass); }
  @media (prefers-reduced-motion: reduce) { .seg { transition: none; } }

  .total { margin: 0; }
  .total-real { font-family: var(--mono); font-size: 1.15rem; font-weight: 500; color: var(--ink); }
  .total-sub { font-family: var(--mono); font-size: 0.7rem; color: var(--muted); margin-left: 0.3rem; }
  .total-nominal { font-family: var(--mono); font-size: 0.74rem; color: var(--muted); margin: 0.15rem 0 0.6rem; }
  .monthly { font-family: var(--mono); font-size: 0.74rem; color: var(--muted); margin: 0 0 0.4rem; }
  .rrate { font-family: var(--mono); font-size: 0.7rem; color: var(--muted); margin: 0; }

  .legend { font-family: var(--mono); font-size: 0.72rem; color: var(--ink); margin: 1rem 0 0; display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem; }
  .legend .key { display: inline-block; width: 0.8rem; height: 0.8rem; border-radius: 2px; }
  .legend .muted { color: var(--muted); }
  .key.seg-principal { background: var(--slate); }
  .key.seg-interest { background: var(--brass); }

  .termcap { font-size: 0.78rem; color: var(--muted); margin: 1rem 0 0; }
  .disclaimer { font-size: 0.85rem; color: #4a463f; background: #f4e9cf; border: 1px solid #e2cf9c; border-radius: 3px; padding: 0.7rem 0.9rem; margin: 1rem 0 0; }
  .assumptions { margin-top: 1rem; }
  .assumptions summary { font-family: var(--mono); font-size: 0.78rem; color: var(--slate); cursor: pointer; }
  .assumptions ul { list-style: none; margin: 0.85rem 0 0; padding: 0; display: grid; gap: 0.5rem; }
  .assumptions li { font-size: 0.85rem; }
  .assumptions code { font-family: var(--mono); font-size: 0.8rem; color: var(--ink); }
  .assumptions a { margin-left: 0.4rem; font-size: 0.8rem; }
</style>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: build succeeds, 12 pages.

- [ ] **Step 3: Visual verification (Playwright)**

Start `npm run preview`, navigate to `http://localhost:4321/eu-yes-or-no/husnaedislan/`, screenshot the `.calc` element. Confirm: three cards with stacked principal/interest bars, the euro bar shortest with a ★, both total figures present, secondary monthly line, legend, disclaimer. Repeat for `/en/husnaedislan/`. Adjust spacing if needed.

- [ ] **Step 4: Commit**

```bash
git add src/components/Calculator.astro
git commit -m "feat: stacked total-cost comparison bars + styling for calculator"
```

---

### Task 5: Final verification + deploy

**Files:** none (verification + push).

- [ ] **Step 1: Run the unit tests + build together**

Run: `npm test && npm run build`
Expected: vitest PASS, build succeeds.

- [ ] **Step 2: Sanity-check the numbers in the browser**

Preview and try: set price 60M / equity 16M / 30 yr → loan 44M, LTV 73%. Confirm euro total (today's kr) < non-indexed; indexed shows a larger nominal than real; bars scale; numbers move when inputs change; keyboard focus + reduced-motion intact.

- [ ] **Step 3: Push (auto-deploys)**

```bash
git push
```
Expected: GitHub Actions deploys; `https://gillicorp.github.io/eu-yes-or-no/husnaedislan/` shows the new calculator.

---

## Self-Review

- **Spec coverage:** inputs (price/equity/LTV/term) → Task 3; remove presets → Task 2; total-cost hero + both totals → Tasks 1,3; stacked bars/comparison → Task 4; ranges + disclaimer + sourced assumptions → carried throughout; amortisation-over-time graph → correctly OUT of scope (not in any task). ✓
- **Placeholder scan:** all code blocks are complete; no TBD/TODO. ✓
- **Type consistency:** `Band {min,typ,max}` vs `Range {lo,typ,hi}` are distinct by design (inputs vs outputs); `computeLoan` signature matches between Task 1 definition and Task 3 usage; `ASSUMPTIONS[].{min,typical,max}` mapped to `Band` via the `band()` helper. ✓
- **Known reconciliation:** indexation shown as the nominal−real gap (not a third bar segment), because indexation has no real-terms value; legend states this. Flagged to the user at handoff.
