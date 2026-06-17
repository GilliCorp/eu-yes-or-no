# Chapter 3 Grocery-Basket Explainer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A facts-only grocery-basket explainer on chapter 3 that shows, per item, sourced price + protected/free tag + tariff rate, plus the basket total and its share of a median wage — asserting NO fabricated "with-EU" price.

**Architecture:** A pure, tested `basket-math.ts` (total, share-of-wage, protected-count — deliberately no forecast) consumed by a `<Basket>` Astro island. Sourced item/wage data lives in `basket.ts`; verify-links in `grocery-sources.ts`. The component server-renders rows + a client module-script recomputes total/share on quantity change. Mirrors the existing loan `<Calculator>` pattern.

**Tech Stack:** Astro 6, TypeScript, vanilla DOM (no framework), Vitest, inline CSS (no charting lib).

## Global Constraints

- **Facts only — no fabrication.** The tool states sourced facts and figures computed only from sourced inputs. It MUST NOT output a predicted/reduced "with-EU" price or basket total. `basket-math.ts` contains NO forecast/reduction function.
- Every price/rate/wage on screen carries a source; prices are a dated snapshot ("verð frá …").
- Bilingual: every user-facing string in `is` + `en` via `src/i18n/ui.ts`.
- Income anchor = median full-time monthly wage, labelled "miðgildi reglulegra heildarlauna í fullu starfi" — never "household income".
- No new runtime deps (Vitest already a devDependency). Node ≥ 22.12.
- Basket composition/quantities are a labelled editorial example ("dæmi um körfu"), user-adjustable.

---

### Task 1: Pure basket-math module + Vitest

**Files:**
- Create: `src/lib/basket-math.ts`
- Create: `src/lib/basket-math.test.ts`

**Interfaces:**
- Produces: `basketTotal(items: BasketItem[], qty: Record<string, number>): number`
- Produces: `shareOfWagePct(total: number, monthlyWage: number): number`
- Produces: `protectedCount(items: BasketItem[]): number`
- Consumes: `BasketItem` type (defined here as a minimal structural type so the module stays standalone-testable; the full data shape in Task 2 is compatible).

- [ ] **Step 1: Write the failing tests**

Create `src/lib/basket-math.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { basketTotal, shareOfWagePct, protectedCount, type BasketItem } from './basket-math';

const items: BasketItem[] = [
  { id: 'milk', priceISK: 379, protection: 'protected' },
  { id: 'pasta', priceISK: 350, protection: 'free' },
  { id: 'tomato', priceISK: 700, protection: 'seasonal' },
];

describe('basketTotal', () => {
  it('sums price × quantity', () => {
    expect(basketTotal(items, { milk: 2, pasta: 1, tomato: 1 })).toBe(379 * 2 + 350 + 700);
  });
  it('treats a missing quantity as zero', () => {
    expect(basketTotal(items, { milk: 1 })).toBe(379);
  });
});

describe('shareOfWagePct', () => {
  it('expresses total as a percent of monthly wage', () => {
    expect(shareOfWagePct(8260, 826000)).toBeCloseTo(1, 5);
  });
  it('returns 0 when wage is 0 (no divide-by-zero)', () => {
    expect(shareOfWagePct(1000, 0)).toBe(0);
  });
});

describe('protectedCount', () => {
  it('counts protected and seasonal items, not free ones', () => {
    expect(protectedCount(items)).toBe(2);
  });
});

describe('module is intentionally forecast-free', () => {
  it('exports no price-prediction / reduction function', async () => {
    const mod = await import('./basket-math');
    for (const k of Object.keys(mod)) {
      expect(/reduc|forecast|withEu|predict|after/i.test(k)).toBe(false);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/basket-math.test.ts`
Expected: FAIL — `Failed to resolve import './basket-math'`.

- [ ] **Step 3: Implement `src/lib/basket-math.ts`**

```ts
export type Protection = 'protected' | 'free' | 'seasonal';

/** Minimal shape the math needs; the full data record in basket.ts is compatible. */
export interface BasketItem {
  id: string;
  priceISK: number;
  protection: Protection;
}

/** Sum of price × quantity. Missing quantity = 0. No forecasting — current prices only. */
export function basketTotal(items: BasketItem[], qty: Record<string, number>): number {
  return items.reduce((sum, it) => sum + it.priceISK * (qty[it.id] ?? 0), 0);
}

/** Basket total as a percent of the monthly wage. 0 if wage is 0. */
export function shareOfWagePct(total: number, monthlyWage: number): number {
  return monthlyWage > 0 ? (total / monthlyWage) * 100 : 0;
}

/** How many items are tariff-affected (protected or seasonally protected). */
export function protectedCount(items: BasketItem[]): number {
  return items.filter((it) => it.protection !== 'free').length;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/basket-math.test.ts`
Expected: PASS (all green).

- [ ] **Step 5: Commit**

```bash
git add src/lib/basket-math.ts src/lib/basket-math.test.ts
git commit -m "feat: pure, forecast-free basket-math (total, share-of-wage, protected-count)"
```

---

### Task 2: Sourced data + verify-links + i18n labels + schema flag

**Files:**
- Create: `src/data/basket.ts`
- Create: `src/data/grocery-sources.ts`
- Modify: `src/i18n/ui.ts` (add `basket.*` keys, both languages)
- Modify: `src/content.config.ts` (add `basket` flag)

**Interfaces:**
- Produces: `BASKET_ITEMS: BasketDataItem[]`, `MEDIAN_WAGE_ISK: number`, `WAGE_SOURCE`, `SNAPSHOT_DATE`, `GROCERY_SOURCES`.
- `BasketDataItem` extends the Task 1 `BasketItem` shape (`id`, `priceISK`, `protection`) with display fields.

- [ ] **Step 1: Create `src/data/basket.ts`**

```ts
import type { BasketItem } from '../lib/basket-math';

export interface Source { title: string; url: string; publisher: string; }

export interface BasketDataItem extends BasketItem {
  name: { is: string; en: string };
  unit: { is: string; en: string };
  defaultQty: number;
  provenance: 'domestic' | 'imported' | 'mixed';
  tariffNote?: { is: string; en: string }; // shown only for protected/seasonal
  approx?: boolean; // price is approximate → UI prefixes "~"
  source: Source;
}

// Prices: mid-2026 snapshot (see docs/research/grocery-basket-data.md). All ISK.
export const SNAPSHOT_DATE = { is: 'júní 2026', en: 'June 2026' };

export const BASKET_ITEMS: BasketDataItem[] = [
  { id: 'milk', name: { is: 'Nýmjólk', en: 'Whole milk' }, unit: { is: '1 L', en: '1 L' }, priceISK: 379, defaultQty: 4, provenance: 'domestic', protection: 'protected', tariffNote: { is: 'mjólkurtollur ~73%', en: 'dairy tariff ~73%' }, source: { title: 'MS G-mjólk 3,9% 1L', url: 'https://www.neytandinn.is/i/sku/uid-d85dd71b-abaf-4fe0-9543-d7f9981ad757', publisher: 'Neytandinn' } },
  { id: 'skyr', name: { is: 'Skyr', en: 'Skyr' }, unit: { is: '500 g', en: '500 g' }, priceISK: 499, defaultQty: 2, provenance: 'domestic', protection: 'protected', tariffNote: { is: 'mjólkurtollur ~73%', en: 'dairy tariff ~73%' }, source: { title: 'Ísey skyr hreint 500g', url: 'https://kronan.is/vara/100026593-isey-skyr-hreint-500g', publisher: 'Krónan' } },
  { id: 'butter', name: { is: 'Smjör', en: 'Butter' }, unit: { is: '500 g', en: '500 g' }, priceISK: 848, defaultQty: 1, provenance: 'domestic', protection: 'protected', tariffNote: { is: 'mjólkurtollur ~73%', en: 'dairy tariff ~73%' }, source: { title: 'Íslenskt smjör 500g', url: 'https://www.neytandinn.is/i/sku/id-1000057', publisher: 'Neytandinn' } },
  { id: 'cheese', name: { is: 'Ostur (gouda)', en: 'Cheese (gouda)' }, unit: { is: 'kg', en: 'kg' }, priceISK: 2510, defaultQty: 1, provenance: 'domestic', protection: 'protected', tariffNote: { is: 'mjólkurtollur ~73%', en: 'dairy tariff ~73%' }, source: { title: 'MS Gouda mildur 26% (per kg)', url: 'https://kronan.is/vara/100248831-ms-gouda-mildur-26-700gr', publisher: 'Krónan' } },
  { id: 'eggs', name: { is: 'Egg', en: 'Eggs' }, unit: { is: '12 stk', en: '12' }, priceISK: 795, defaultQty: 1, provenance: 'domestic', protection: 'protected', tariffNote: { is: 'eggjatollur ~30%', en: 'egg tariff ~30%' }, source: { title: 'Stjörnuegg meðalstór 12 stk', url: 'https://kronan.is/vara/100218854-stjornuegg-medalstor-brun-egg-12-stk', publisher: 'Krónan' } },
  { id: 'chicken', name: { is: 'Kjúklingabringur', en: 'Chicken breast' }, unit: { is: 'kg', en: 'kg' }, priceISK: 2769, defaultQty: 1, provenance: 'domestic', protection: 'protected', tariffNote: { is: 'kjöttollur ~62–67%', en: 'meat tariff ~62–67%' }, source: { title: 'Ódýrt kjúklingabringur (per kg)', url: 'https://kronan.is/vara/100244878-odyrt-kjuklingabringur', publisher: 'Krónan' } },
  { id: 'beef', name: { is: 'Nautahakk', en: 'Beef mince' }, unit: { is: 'kg', en: 'kg' }, priceISK: 3398, defaultQty: 1, provenance: 'mixed', protection: 'protected', tariffNote: { is: 'kjöttollur ~62–67%', en: 'meat tariff ~62–67%' }, source: { title: 'Ódýrt ungnautahakk (per kg)', url: 'https://kronan.is/vara/100249028-odyrt-ungnautahakk', publisher: 'Krónan' } },
  { id: 'lamb', name: { is: 'Lambalæri', en: 'Leg of lamb' }, unit: { is: 'kg', en: 'kg' }, priceISK: 2699, defaultQty: 1, provenance: 'domestic', protection: 'protected', tariffNote: { is: 'kjöttollur ~62–67%', en: 'meat tariff ~62–67%' }, source: { title: 'Góða lambalæri frosið (per kg)', url: 'https://kronan.is/vara/100132054-goda-lambalaeri-frosid', publisher: 'Krónan' } },
  { id: 'bread', name: { is: 'Brauð', en: 'Bread' }, unit: { is: 'hleifur', en: 'loaf' }, priceISK: 337, defaultQty: 2, provenance: 'domestic', protection: 'free', source: { title: 'Myllan heimilisbrauð 385g', url: 'https://www.neytandinn.is/i/sku/uid-975f5884-a49d-4a8d-bc93-3cb49d82260c', publisher: 'Neytandinn' } },
  { id: 'pasta', name: { is: 'Pasta', en: 'Pasta' }, unit: { is: '500 g', en: '500 g' }, priceISK: 350, defaultQty: 2, provenance: 'imported', protection: 'free', approx: true, source: { title: 'Bónus verðlisti 2026 (pasta 500g)', url: 'https://gonow.is/bonus-grocery-store-iceland/', publisher: 'gonow.is' } },
  { id: 'rice', name: { is: 'Hrísgrjón', en: 'Rice' }, unit: { is: 'kg', en: 'kg' }, priceISK: 380, defaultQty: 1, provenance: 'imported', protection: 'free', source: { title: 'First Price hrísgrjón (per kg)', url: 'https://kronan.is/vara/100179739-first-price-hrisgrjon-i-sudupoka', publisher: 'Krónan' } },
  { id: 'bananas', name: { is: 'Bananar', en: 'Bananas' }, unit: { is: 'kg', en: 'kg' }, priceISK: 338, defaultQty: 1, provenance: 'imported', protection: 'free', source: { title: 'Bananar (per kg)', url: 'https://kronan.is/vara/100253786-bananar', publisher: 'Krónan' } },
  { id: 'apples', name: { is: 'Epli', en: 'Apples' }, unit: { is: 'kg', en: 'kg' }, priceISK: 413, defaultQty: 1, provenance: 'imported', protection: 'free', source: { title: 'Epli rauð (per kg)', url: 'https://kronan.is/vara/100253421-epli-raud', publisher: 'Krónan' } },
  { id: 'tomatoes', name: { is: 'Tómatar', en: 'Tomatoes' }, unit: { is: 'kg', en: 'kg' }, priceISK: 700, defaultQty: 1, provenance: 'mixed', protection: 'seasonal', tariffNote: { is: 'árstíðabundinn tollur', en: 'seasonal tariff' }, approx: true, source: { title: 'Food prices Iceland (tomatoes /kg)', url: 'https://www.numbeo.com/food-prices/country_result.jsp?country=Iceland', publisher: 'Numbeo' } },
  { id: 'coffee', name: { is: 'Kaffi', en: 'Ground coffee' }, unit: { is: '400 g', en: '400 g' }, priceISK: 1350, defaultQty: 1, provenance: 'imported', protection: 'free', source: { title: 'Kaffitár Morgundögg 400g', url: 'https://kronan.is/vara/100222206-kaffitar-morgundogg', publisher: 'Krónan' } },
];

// Median full-time regular monthly wages, 2025. NOT household-disposable income.
export const MEDIAN_WAGE_ISK = 826000;
export const WAGE_SOURCE: Source = {
  title: 'Dreifing launa á íslenskum vinnumarkaði 2025 (miðgildi reglulegra heildarlauna, fullt starf)',
  url: 'https://hagstofa.is/utgafur/frettasafn/laun-og-tekjur/dreifing-launa-a-islenskum-vinnumarkadi-2025/',
  publisher: 'Hagstofa Íslands',
};
```

- [ ] **Step 2: Create `src/data/grocery-sources.ts`**

```ts
export interface GrocerySource { label: { is: string; en: string }; url: string; }

// Survey / statistics sources for verifying real prices — NOT retail stores.
export const GROCERY_SOURCES: GrocerySource[] = [
  { label: { is: 'Eurostat — verðlag eftir löndum', en: 'Eurostat — comparative price levels' }, url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Comparative_price_levels_for_food%2C_beverages_and_tobacco' },
  { label: { is: 'ASÍ verðsjá — verð í íslenskum verslunum', en: 'ASÍ price monitor — Icelandic store prices' }, url: 'https://verdsja.is/' },
  { label: { is: 'Hagstofa — verðlag', en: 'Statistics Iceland — prices' }, url: 'https://hagstofa.is/talnaefni/efnahagur/verdlag/' },
];
```

- [ ] **Step 3: Add `basket` flag to the schema**

In `src/content.config.ts`, inside the dossier `schema` object, beside the existing `calculator` line, add:

```ts
    basket: z.boolean().default(false),
```

- [ ] **Step 4: Add `basket.*` labels to `src/i18n/ui.ts`**

In the `is:` object, after the `calc.*` block, add:

```ts
    'basket.title': 'Matarkarfan og ESB',
    'basket.sub': 'Hvað í körfunni snertir ESB-aðild — og hvað ekki. Dæmi um körfu; breyttu að þínum vana.',
    'basket.tag.protected': 'tollverndað',
    'basket.tag.free': 'tollfrjálst',
    'basket.tag.seasonal': 'árstíðabundið',
    'basket.tariffIsBorder': 'Tollur er gjald á innflutning — ekki spá um verðlækkun.',
    'basket.total': 'Karfan í dag',
    'basket.share': 'af miðgildi mánaðarlauna',
    'basket.split': 'vörur eru tollverndaðar (það sem ESB-aðild snertir); hinar eru þegar tollfrjálsar',
    'basket.euEffect': 'Tollarnir á vernduðu vörunum féllu við ESB-aðild. Hve mikið af því skilar sér í búðarverð er ekki tölusett í heimildum — það veltur á innlendri framleiðslu og álagningu. Tollfrjálsu vörurnar haggast ekki.',
    'basket.snapshot': 'Verð frá',
    'basket.detail': 'Hvernig þetta er reiknað',
    'basket.verifyTitle': 'Sjáðu raunverð sjálf',
    'basket.verifyNote': 'Verð erlendis er ólíkt af fleiri ástæðum en tollum — launum, flutningi og stærð markaðar. Lestu því ekki allt verðbilið sem ESB-áhrif.',
    'basket.qty': 'Fjöldi',
```

In the `en:` object, after the `calc.*` block, add:

```ts
    'basket.title': 'The grocery basket & the EU',
    'basket.sub': "What in the basket EU membership touches — and what it doesn't. A sample basket; adjust it to your own.",
    'basket.tag.protected': 'tariff-protected',
    'basket.tag.free': 'tariff-free',
    'basket.tag.seasonal': 'seasonally protected',
    'basket.tariffIsBorder': 'A tariff is a charge on imports — not a predicted price drop.',
    'basket.total': 'Basket today',
    'basket.share': 'of the median monthly wage',
    'basket.split': 'items are tariff-protected (what EU membership touches); the rest are already tariff-free',
    'basket.euEffect': "The tariffs on the protected items would fall on EU membership. How much of that reaches the shelf price is not quantified in the sources — it depends on domestic production and retail margins. The tariff-free items would not change.",
    'basket.snapshot': 'Prices from',
    'basket.detail': 'How this is calculated',
    'basket.verifyTitle': 'See real prices yourself',
    'basket.verifyNote': "Prices abroad differ for more reasons than tariffs — wages, transport and market size — so don't read the whole price gap as the EU effect.",
    'basket.qty': 'Qty',
```

- [ ] **Step 5: Verify types compile**

Run: `export PATH="/opt/homebrew/bin:$PATH"; npx astro check 2>&1 | tail -20`
Expected: no NEW errors in `basket.ts`, `grocery-sources.ts`, `ui.ts`, or `content.config.ts`. (Errors only appear later in `Basket.astro`, which doesn't exist yet — that's fine.)

- [ ] **Step 6: Commit**

```bash
git add src/data/basket.ts src/data/grocery-sources.ts src/i18n/ui.ts src/content.config.ts
git commit -m "feat: sourced grocery-basket data, verify-link sources, i18n labels, basket schema flag"
```

---

### Task 3: Basket.astro component + Dossier wiring + enable on chapter

**Files:**
- Create: `src/components/Basket.astro`
- Modify: `src/components/Dossier.astro` (import + conditional render)
- Modify: `src/content/dossiers/grocery-bill.yaml` (add `basket: true`)

**Interfaces:**
- Consumes: `BASKET_ITEMS`, `MEDIAN_WAGE_ISK`, `WAGE_SOURCE`, `SNAPSHOT_DATE`, `GROCERY_SOURCES` (Task 2); `basketTotal`, `shareOfWagePct`, `protectedCount` (Task 1).

- [ ] **Step 1: Create `src/components/Basket.astro`**

```astro
---
import type { Lang } from '../i18n/ui';
import { t } from '../i18n/ui';
import { BASKET_ITEMS, MEDIAN_WAGE_ISK, WAGE_SOURCE, SNAPSHOT_DATE, type BasketDataItem } from '../data/basket';
import { GROCERY_SOURCES } from '../data/grocery-sources';

interface Props { lang: Lang }
const { lang } = Astro.props;
const loc = lang === 'is' ? 'is-IS' : 'en-GB';
const tagKey = (p: BasketDataItem['protection']) =>
  p === 'free' ? 'basket.tag.free' : p === 'seasonal' ? 'basket.tag.seasonal' : 'basket.tag.protected';
---

<section class="basket" data-locale={loc} data-wage={MEDIAN_WAGE_ISK} aria-labelledby="basket-h">
  <header class="basket-head">
    <p class="eyebrow">🛒 {t(lang, 'basket.title')}</p>
    <h2 id="basket-h">{t(lang, 'basket.sub')}</h2>
  </header>

  <table class="items">
    <tbody>
      {BASKET_ITEMS.map((it) => (
        <tr data-id={it.id} data-price={it.priceISK} data-protection={it.protection}>
          <td class="name">
            {it.name[lang]} <span class="unit">{it.unit[lang]}</span>
            <a class="src" href={it.source.url} target="_blank" rel="noopener" title={it.source.publisher}>↗</a>
          </td>
          <td class="price">{it.approx ? '~' : ''}<span data-price-fmt={it.id}></span></td>
          <td class="qty">
            <button type="button" class="step" data-step={`${it.id}:-1`} aria-label="−">−</button>
            <input type="number" min="0" max="99" value={it.defaultQty} data-qty={it.id} aria-label={t(lang, 'basket.qty')} />
            <button type="button" class="step" data-step={`${it.id}:1`} aria-label="+">+</button>
          </td>
          <td class="tag">
            <span class={`tag-${it.protection}`}>{t(lang, tagKey(it.protection))}</span>
            {it.tariffNote && <span class="tariff">{it.tariffNote[lang]}</span>}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  <p class="border-note">ℹ {t(lang, 'basket.tariffIsBorder')}</p>

  <div class="summary">
    <p class="total"><strong data-fill="total"></strong> · <span data-fill="share"></span> {t(lang, 'basket.share')}</p>
    <p class="split"><strong data-fill="protectedCount"></strong> / {BASKET_ITEMS.length} {t(lang, 'basket.split')}</p>
    <p class="eu-effect">{t(lang, 'basket.euEffect')}</p>
  </div>

  <details class="detail">
    <summary>{t(lang, 'basket.detail')}</summary>
    <div class="detail-body">
      <p><strong>Tollabandalag vs. innlendir tollar / Customs union vs national tariffs.</strong> ESB-aðild skiptir innlendu tollunum út fyrir sameiginlega tollskrá ESB; verndun á mjólk (~73%), kjöti (~62–67%) og eggjum (~30%) félli, en um 1.000 af 1.793 tollnúmerum eru þegar tollfrjáls.</p>
      <p><strong>Af hverju engin verðspá? / Why no predicted price?</strong> Hve mikið af tollalækkun skilar sér í búðarverð er ekki tölusett í neinni heimild (veltur á álagningu og innlendri framleiðslu). Við spáum ekki tölu sem við getum ekki heimildastutt.</p>
      <p><strong>VSK breytist ekki / VAT does not change.</strong> Virðisaukaskattur er á forræði aðildarríkja innan ESB-ramma; matar-VSK á Íslandi gæti haldist óbreyttur.</p>
      <p><strong>Styrkir hverfa ekki / Subsidies don't vanish.</strong> Stuðningur færist úr verðvernd (greitt í búð) yfir í beingreiðslur CAP (greitt um skatta) — áfram stutt, úr öðrum vasa.</p>
      <p><strong>Samhengi / Context (not a prediction):</strong> OECD metur verð til bænda ~60% yfir heimsmarkaði (NPC 1,60); Eurostat: Ísland með hæsta verð á mjólkurvörum/eggjum af 36 löndum 2024.</p>
      <p class="wage-src">{t(lang, 'basket.snapshot')} {SNAPSHOT_DATE[lang]}. Laun: <a href={WAGE_SOURCE.url} target="_blank" rel="noopener">{WAGE_SOURCE.publisher}</a>.</p>
    </div>
  </details>

  <aside class="verify">
    <p class="verify-title">{t(lang, 'basket.verifyTitle')}</p>
    <p class="verify-note">{t(lang, 'basket.verifyNote')}</p>
    <ul>
      {GROCERY_SOURCES.map((s) => (
        <li><a href={s.url} target="_blank" rel="noopener">{s.label[lang]} ↗</a></li>
      ))}
    </ul>
  </aside>
</section>

<script>
  import { BASKET_ITEMS, MEDIAN_WAGE_ISK } from '../data/basket';
  import { basketTotal, shareOfWagePct, protectedCount } from '../lib/basket-math';

  const root = document.querySelector('.basket');
  if (root) init(root as HTMLElement);

  function init(root: HTMLElement) {
    const loc = root.dataset.locale || 'is-IS';
    const fmt = new Intl.NumberFormat(loc, { maximumFractionDigits: 0 });
    const money = (n: number) => fmt.format(Math.round(n)) + ' kr.';
    const wage = Number(root.dataset.wage) || 0;

    const fill = (k: string, txt: string) => {
      const el = root.querySelector(`[data-fill="${k}"]`); if (el) el.textContent = txt;
    };
    const readQty = (): Record<string, number> => {
      const q: Record<string, number> = {};
      root.querySelectorAll<HTMLInputElement>('[data-qty]').forEach((i) => {
        q[i.dataset.qty as string] = Math.max(0, Number(i.value) || 0);
      });
      return q;
    };

    // static per-item price labels (current prices — never a forecast)
    BASKET_ITEMS.forEach((it) => {
      const el = root.querySelector(`[data-price-fmt="${it.id}"]`);
      if (el) el.textContent = money(it.priceISK);
    });

    function recompute() {
      const qty = readQty();
      const total = basketTotal(BASKET_ITEMS, qty);
      fill('total', money(total));
      fill('share', shareOfWagePct(total, wage).toFixed(1) + '%');
      fill('protectedCount', String(protectedCount(BASKET_ITEMS)));
    }

    root.querySelectorAll<HTMLInputElement>('[data-qty]').forEach((i) =>
      i.addEventListener('input', recompute));
    root.querySelectorAll<HTMLButtonElement>('[data-step]').forEach((b) =>
      b.addEventListener('click', () => {
        const [id, delta] = (b.dataset.step as string).split(':');
        const input = root.querySelector<HTMLInputElement>(`[data-qty="${id}"]`);
        if (input) { input.value = String(Math.max(0, (Number(input.value) || 0) + Number(delta))); recompute(); }
      }));
    recompute();
  }
</script>

<style>
  .basket { border: 1px solid var(--line-strong); border-radius: 4px; background: var(--paper-raised); padding: clamp(1.25rem, 4vw, 2rem); margin: 0 0 3rem; }
  .basket-head { margin-bottom: 1.25rem; }
  .basket-head .eyebrow { font-family: var(--mono); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--brass); margin: 0 0 0.4rem; }
  .basket-head h2 { font-size: clamp(1.2rem, 3vw, 1.6rem); margin: 0; max-width: 40rem; }

  .items { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
  .items td { padding: 0.55rem 0.4rem; border-top: 1px solid var(--line); vertical-align: middle; }
  .items tr:first-child td { border-top: none; }
  .name { font-family: var(--body); }
  .name .unit { color: var(--muted); font-size: 0.8rem; }
  .name .src { text-decoration: none; color: var(--slate-soft); margin-left: 0.25rem; font-size: 0.75rem; }
  .price { font-family: var(--mono); white-space: nowrap; }
  .qty { white-space: nowrap; text-align: center; }
  .qty input { width: 3rem; font-family: var(--mono); text-align: center; border: 1px solid var(--line-strong); border-radius: 2px; padding: 0.2rem; }
  .qty .step { font-family: var(--mono); width: 1.6rem; height: 1.6rem; border: 1px solid var(--line-strong); background: var(--paper); border-radius: 2px; cursor: pointer; }
  .tag span { display: inline-block; font-family: var(--mono); font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.04em; padding: 0.1rem 0.4rem; border-radius: 2px; }
  .tag-protected { background: var(--loss-bg); color: var(--loss); }
  .tag-seasonal { background: #f0e8d6; color: var(--brass); }
  .tag-free { background: var(--gain-bg); color: var(--gain); }
  .tag .tariff { background: none; color: var(--muted); text-transform: none; letter-spacing: 0; font-size: 0.7rem; display: block; padding: 0.1rem 0 0; }
  .border-note { font-size: 0.78rem; color: var(--muted); margin: 0.6rem 0 0; }

  .summary { margin: 1.5rem 0 0; border-top: 2px solid var(--line-strong); padding-top: 1rem; }
  .summary .total { font-family: var(--mono); font-size: 1.1rem; margin: 0 0 0.3rem; }
  .summary .split { font-size: 0.9rem; color: #34322d; margin: 0 0 0.75rem; }
  .summary .eu-effect { font-size: 0.9rem; color: #4a463f; background: #f4e9cf; border: 1px solid #e2cf9c; border-radius: 3px; padding: 0.7rem 0.9rem; margin: 0; }

  .detail { margin-top: 1rem; }
  .detail summary { font-family: var(--mono); font-size: 0.78rem; color: var(--slate); cursor: pointer; }
  .detail-body p { font-size: 0.88rem; color: #34322d; margin: 0.7rem 0 0; }
  .detail-body .wage-src { font-family: var(--mono); font-size: 0.76rem; color: var(--muted); }

  .verify { margin-top: 1.5rem; border-top: 1px solid var(--line-strong); padding-top: 1.25rem; }
  .verify-title { font-family: var(--display); font-weight: 600; font-size: 1rem; margin: 0 0 0.3rem; }
  .verify-note { font-size: 0.85rem; color: #4a463f; margin: 0 0 0.75rem; max-width: 42rem; }
  .verify ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.35rem; }
  .verify a { font-family: var(--mono); font-size: 0.82rem; color: var(--slate); text-decoration: none; }
  .verify a:hover { color: var(--ink); text-decoration: underline; }

  @media (max-width: 34rem) {
    .items td { padding: 0.5rem 0.25rem; }
    .tag span { font-size: 0.6rem; }
  }
</style>
```

- [ ] **Step 2: Wire into `Dossier.astro`**

In `src/components/Dossier.astro` frontmatter, beside the existing `import Calculator from './Calculator.astro';`, add:

```ts
import Basket from './Basket.astro';
```

And beside the existing `{d.calculator && <Calculator lang={lang} />}` line, add:

```astro
  {d.basket && <Basket lang={lang} />}
```

- [ ] **Step 3: Enable the basket on chapter 3**

In `src/content/dossiers/grocery-bill.yaml`, change the line `calculator: false` to also include the basket flag — i.e. ensure these two lines exist near the end:

```yaml
calculator: false
basket: true
```

- [ ] **Step 4: Build**

Run: `export PATH="/opt/homebrew/bin:$PATH"; npm run build 2>&1 | grep -E "error|Error|page\(s\) built"`
Expected: build succeeds, 12 pages built.

- [ ] **Step 5: Verify the basket renders (text)**

Run: `(npm run preview >/tmp/p.out 2>&1 &); sleep 2; curl -s http://localhost:4321/eu-yes-or-no/grocery-bill/ | grep -oE 'basket.title|tollverndað|data-fill="total"' | sort -u; pkill -f 'astro preview'`
Expected: the basket markup is present (e.g. `data-fill="total"`).

- [ ] **Step 6: Commit**

```bash
git add src/components/Basket.astro src/components/Dossier.astro src/content/dossiers/grocery-bill.yaml
git commit -m "feat: grocery-basket component (facts-only) wired into chapter 3"
```

---

### Task 4: Enrich chapter-3 content (eggs/veg tariffs + biosecurity both-sides)

**Files:**
- Modify: `src/content/dossiers/grocery-bill.yaml`

**Interfaces:** none (content only; must satisfy the dossier schema — every claim needs ≥1 source, both `is`/`en`).

- [ ] **Step 1: Add egg + seasonal-vegetable specifics to `today`**

In `grocery-bill.yaml`, replace the `today.is` and `today.en` bodies so they also name eggs and seasonal vegetables. New `today`:

```yaml
today:
  is: >-
    Ísland er nær tollalaust hagkerfi með einni undantekningu: mat. Meðaltollur á
    landbúnaðarvörur er um 20% á móti 0,1% á annað. Hæstu tollarnir eru á
    mjólkurvörur (~73%), kjöt (~62–67%) og egg (~30%), auk tollkvóta og
    verndarákvæða; tómatar, gúrkur og paprika bera hærri tolla á íslenska
    ræktunartímanum til að verja gróðurhúsabændur. Tollarnir beinast að vörum sem
    keppa við innlenda framleiðslu; korn, hrísgrjón, pasta, sykur, olíur og ávextir
    koma tollfrjáls inn (um 1.000 af 1.793 tollnúmerum eru þegar tollfrjáls). OECD
    metur að verndin haldi verði til bænda ~60% yfir heimsmarkaðsverði.
  en: >-
    Iceland is a near-tariff-free economy with one exception: food. The average
    agricultural tariff is about 20% versus 0.1% on everything else. The highest
    tariffs are on dairy (~73%), meat (~62–67%) and eggs (~30%), plus tariff quotas
    and safeguards; tomatoes, cucumbers and peppers carry higher tariffs during the
    Icelandic growing season to protect greenhouse farmers. The tariffs target goods
    that compete with domestic production; grains, rice, pasta, sugar, oils and fruit
    enter tariff-free (about 1,000 of 1,793 tariff lines are already duty-free). The
    OECD estimates this protection keeps farm-gate prices ~60% above world levels.
```

- [ ] **Step 2: Add a biosecurity both-sides item to `uncertain`**

Append this entry to the `uncertain:` list in `grocery-bill.yaml`:

```yaml
  - claim:
      is: "Sérstök reglugerð um dýraheilbrigði er tvíeggjað mál: annars vegar hækka innflutningshömlur (t.d. á hráu kjöti og eggjum) matvælaverð og EFTA-dómstóllinn dæmdi gamla hráakjötsbannið andstætt EES-rétti (mál E-17/15 2016; E-2/17 og E-3/17 2017); hins vegar er Ísland laust við 14 alvarlega dýrasjúkdóma og notar minnst af sýklalyfjum í dýr í Evrópu, sem margir telja verndarvert."
      en: "Iceland's animal-health rules are double-edged: on one hand, import limits (e.g. on raw meat and eggs) raise food prices, and the EFTA Court found the old raw-meat ban breached EEA law (case E-17/15 in 2016; E-2/17 and E-3/17 in 2017); on the other, Iceland is free of 14 serious animal diseases and has the lowest veterinary antibiotic use in Europe, which many consider worth protecting."
    confidence: high
    sources:
      - title: "Joined Cases E-2/17 and E-3/17 (import of raw meat, eggs, dairy)"
        url: "https://eftacourt.int/cases/joined-cases-e-02-17-and-e-03-17/"
        publisher: "EFTA Court"
        tier: primary
      - title: "Iceland authorised to apply special guarantees concerning Salmonella (Jan 2019)"
        url: "https://www.eftasurv.int/newsroom/updates/iceland-must-lift-restrictions-imports-fresh-meat"
        publisher: "EFTA Surveillance Authority"
        tier: primary
```

- [ ] **Step 3: Build to confirm the dossier still validates**

Run: `export PATH="/opt/homebrew/bin:$PATH"; npm run build 2>&1 | grep -E "error|Error|Too small|does not match|page\(s\) built"`
Expected: build succeeds, 12 pages built (every claim has a source + both languages, or the build fails).

- [ ] **Step 4: Commit**

```bash
git add src/content/dossiers/grocery-bill.yaml
git commit -m "content: chapter 3 — egg/veg tariff specifics + biosecurity both-sides"
```

---

### Task 5: Final verification + deploy

**Files:** none (verify + push).

- [ ] **Step 1: Tests + build together**

Run: `export PATH="/opt/homebrew/bin:$PATH"; npm test && npm run build`
Expected: Vitest PASS (basket-math + loan-math), build succeeds (12 pages).

- [ ] **Step 2: Visual check (Playwright)**

Preview, navigate to `http://localhost:4321/eu-yes-or-no/grocery-bill/`, screenshot the `.basket` element. Confirm: item rows with prices + protected/free/seasonal tags + tariff notes; basket total + share-of-wage update when a quantity changes; protected count correct; the "eu-effect" statement shows **no reduced/predicted number**; verify-links + caption present; snapshot date shown. Repeat for `/en/grocery-bill/`.

- [ ] **Step 3: Sanity scan for fabrication**

Run: `grep -riE "myndi lækka um|would fall by|reduced price|með ESB:.*kr" src/components/Basket.astro src/data/basket.ts || echo "clean — no fabricated reduced figure"`
Expected: "clean".

- [ ] **Step 4: Push (auto-deploys)**

(Done on `main` via the finishing-a-development-branch flow, or push the feature branch and open a PR — per the controller's chosen integration.)

---

## Self-Review

- **Spec coverage:** placement+schema flag → Task 2/3; basket tool with per-item sourced facts → Task 3; total + share-of-wage + protected/free split → Tasks 1/3; facts-only "what EU does" statement (no number) → Task 3; two-layer explanation (plain + "Hvernig þetta er reiknað" expander) → Task 3; biosecurity both-sides + egg/veg specifics → Task 4; verify-link sources (not stores) → Task 2/3; snapshot date + caveats → Task 2/3; tested forecast-free math → Task 1. ✓ No fabricated reduced price in any task. ✓
- **Placeholder scan:** all code complete; no TBD/TODO. `[snapshotDate]`-style text is real UI copy ("Verð frá … júní 2026"), not a gap. ✓
- **Type consistency:** `BasketItem` (Task 1: id/priceISK/protection) ⊆ `BasketDataItem` (Task 2 extends it); `Protection` union matches the `protection` field and the tag-key mapping; `basketTotal/shareOfWagePct/protectedCount` signatures match between Task 1 definition and Task 3 usage; `MEDIAN_WAGE_ISK`/`SNAPSHOT_DATE`/`GROCERY_SOURCES` names match between Task 2 and Task 3. ✓
- **Constraint check:** `basket-math.ts` has no forecast function (Task 1 guard test enforces it); income labelled as wage; prices carry sources + snapshot date; bilingual labels; no new runtime deps. ✓
