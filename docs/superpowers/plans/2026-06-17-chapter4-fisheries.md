# Chapter 4 — Fisheries dossier + stakes visual — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Fisheries chapter as a standard dossier, plus a generic, reusable, fully-sourced "stakes" stat-bar visual rendered as the chapter's opening hook.

**Architecture:** The chapter is a content-collection entry (`fisheries.yaml`) using the existing dossier schema and `Dossier.astro` renderer — same shape as every other chapter. The only new mechanism is an optional `stakes` field on the dossier schema (an array of sourced stat-bars) and a new zero-JS `Stakes.astro` component that renders it after the hero, before the today/as-member panels. No interactive island, no math module — the bars render sourced percentages directly.

**Tech Stack:** Astro 6 (zero-JS static), Zod content-collection schema, TypeScript, bilingual i18n via `src/i18n/ui.ts`. Build = `npm run build`; typecheck = `npx astro check`.

## Global Constraints

Every task implicitly includes these (verbatim from the spec):

- **Facts-only, no fabrication.** No invented quota shares or any number not in a source. The bars show only sourced percentages.
- **Every claim AND every stat bar carries ≥1 source.** The schema enforces this (`.min(1)`); a source-less point or bar is a build error.
- **Bilingual `is` + `en` required** on all user-facing text; the build fails otherwise.
- **No false balance / no padding.** The chapter is intentionally asymmetric (more/stronger losses than gains) because that is what the sources show. Do not invent gains to even the count.
- **Refuted claims must never appear:** the 12-nm-expired-2022 framing; the verbatim-IES no-derogation attribution; the Malta "non-discriminatory by nationality" claim.
- **Stakes bars are visually neutral** (not gain-green / loss-red) — a statistic is neither a gain nor a loss.
- **Icelandic copy is AI-drafted** and must be flagged for native review (Nína / Gísli) — it is not final.
- **`order: 5`** (free; sorts after jobs=4, before security-energy=7).

---

### Task 1: Add the `stakes` field to the dossier schema

**Files:**
- Modify: `src/content.config.ts` (add `statBar` after the `point` definition ~line 35; add `stakes` to the dossier schema object ~line 56)

**Interfaces:**
- Produces: `statBar` Zod object `{ label: loc, valuePct: number(0–100), caption: loc, sources: source[] (min 1) }`; optional dossier field `stakes?: statBar[]`. Consumed by Task 2 (data) and Task 3 (`Stakes.astro`).

- [ ] **Step 1: Add the `statBar` schema** — insert immediately after the `point` definition (after its closing `});`, before the `dossiers` collection comment):

```ts
/**
 * A sourced statistic shown as a labelled bar (e.g. "fisheries = 40% of goods
 * exports"). Generic + reusable across chapters. Like `point`, `sources` has
 * `.min(1)` — a bar with no source is a BUILD ERROR. 🔒
 */
const statBar = z.object({
  label: loc,
  valuePct: z.number().min(0).max(100),
  caption: loc,
  sources: z.array(source).min(1),
});
```

- [ ] **Step 2: Add the optional `stakes` field** — inside the dossier `schema: z.object({ ... })`, add this line right after `uncertain: z.array(point).default([]),`:

```ts
    // Optional sourced "what's at stake" stat-bars, rendered as the chapter hook.
    stakes: z.array(statBar).optional(),
```

- [ ] **Step 3: Build to confirm existing dossiers still pass**

Run: `npm run build`
Expected: build completes with no schema errors (existing 5 dossiers have no `stakes` field; it is optional). Output ends with `[build] Complete!` and a page count (currently 12 pages: home ×2 + 5 chapters ×2).

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts
git commit -m "feat(schema): add optional sourced 'stakes' stat-bar field to dossiers"
```

---

### Task 2: Create the fisheries dossier content

**Files:**
- Create: `src/content/dossiers/fisheries.yaml`

**Interfaces:**
- Consumes: the `stakes` schema field from Task 1.
- Produces: a dossier entry with `id: "fisheries"` → routes `/fisheries` and `/en/fisheries`; auto-listed on the home page (Home.astro sorts the collection by `order`). The `stakes` array (2 bars) is consumed by Task 3's render.

- [ ] **Step 1: Write the full dossier file** (complete bilingual content — Icelandic is AI-draft, flagged for review):

```yaml
order: 5

title:
  is: "Fiskveiðar"
  en: "Fisheries"

tldr:
  is: "Stærsta breytingin og klassíska ásteytingarefnið: stjórn fiskveiða færðist frá Reykjavík til ESB, kvótahlutdeild réðist af veiðireynslu, og engin varanleg undanþága hefur nokkru sinni fengist."
  en: "The biggest change and the classic sticking point: fisheries management would move from Reykjavík to the EU, quota shares would track historic catch, and no permanent exemption has ever been granted to a joining country."

summary:
  is: >-
    Sjávarútvegur er svæðið þar sem aðild breytir mestu — og ástæðan fyrir því að
    viðræðurnar 2010–2013 stöðvuðust í raun. Samkvæmt sameiginlegu
    sjávarútvegsstefnunni (reglugerð (ESB) nr. 1380/2013) verður verndun auðlinda
    hafsins — að ákveða leyfilegan heildarafla (TAC), tæknilegar verndarráðstafanir
    og úthlutun kvóta — að einkavaldssviði ESB sem ákveðið er á sambandsstigi, ekki í
    Reykjavík. Aflanum er skipt eftir reglunni um „hlutfallslegan stöðugleika“: hvert
    ríki fær fasta prósentu sem byggð er á sögulegri veiðireynslu. Utan 12 sjómílna er
    meginreglan jafn aðgangur allra ESB-skipa — kjarni óttans um „yfirráð yfir
    miðunum“ — en raunverulegur afli takmarkast áfram af kvótahlutdeild (jafn aðgangur
    þýðir ekki ótakmarkaðan afla erlendra skipa). Ekkert umsóknarríki hefur nokkru
    sinni fengið varanlega undanþágu, og sjávarútvegskaflinn var aldrei opnaður í
    viðræðunum 2010–2013.
  en: >-
    Fisheries is the area where membership changes the most — and the reason the
    2010–2013 talks effectively died. Under the Common Fisheries Policy (Regulation
    (EU) No 1380/2013) the conservation of marine resources — setting the total
    allowable catch (TAC), technical conservation measures and the allocation of
    quotas — becomes an EU exclusive competence decided at Union level, not in
    Reykjavík. The catch is divided by the principle of "relative stability": each
    state gets a fixed percentage anchored to its historic catch record. Outside 12
    nautical miles the default is equal access for all EU vessels — the heart of the
    "control of our waters" fear — but actual catch stays bound by quota shares (equal
    access does not mean unlimited foreign catch). No candidate country has ever won a
    permanent derogation, and the fisheries chapter was never even opened in the
    2010–2013 negotiations.

today:
  is: >-
    Stjórn fiskveiða í íslenskri lögsögu er alfarið innlent mál. Ísland ákveður sjálft
    leyfilegan heildarafla, rekur eigið kvótakerfi og talar sjálfstætt fyrir hagsmunum
    sínum á alþjóðavettvangi (t.d. í NEAFC og í makríldeilunum). Ólíkt flestum öðrum
    sviðum fellur þetta ekki undir EES-samninginn — þetta er eitt af því sem full
    aðild myndi raunverulega breyta.
  en: >-
    Fisheries management in Icelandic waters is an entirely national matter. Iceland
    sets its own total allowable catch, runs its own quota system and advocates
    independently for its interests internationally (e.g. in NEAFC and the mackerel
    disputes). Unlike most other areas this is not covered by the EEA Agreement — it
    is one of the things full membership would genuinely change.

asMember:
  is: >-
    Sjávarútvegsstefnan yrði einkavaldssvið ESB: leyfilegur heildarafli og úthlutun
    kvóta yrðu ákveðin á sambandsstigi (af ráðinu, árlega). Reglan um hlutfallslegan
    stöðugleika festir hlutdeild Íslands við sögulega veiðireynslu (úthlutunarlykill
    frá 1983, viðmiðunarárin 1973–78, óbreyttur eftir endurskoðunina 2013). Utan 12
    sjómílna gildir jafn aðgangur ESB-skipa (strandveiðiundanþágan framlengd til 31.
    desember 2032), en aflinn er áfram bundinn kvótahlutdeild.
  en: >-
    The Common Fisheries Policy would be an EU exclusive competence: the total
    allowable catch and the allocation of quotas would be decided at Union level (by
    the Council, annually). The principle of relative stability locks Iceland's share
    to its historic catch record (the 1983 allocation key, reference years 1973–78,
    left unchanged by the 2013 reform). Outside 12 nautical miles equal access for EU
    vessels applies (the coastal derogation extended to 31 December 2032), but the
    catch remains bound by quota shares.

stakes:
  - label:
      is: "Hlutur sjávarafurða í vöruútflutningi"
      en: "Share of goods exports"
    valuePct: 40
    caption:
      is: "40% er hlutur af VÖRUútflutningi (2012; 39,3% árið 2011). Að meðtöldum þjónustuútflutningi er hlutfallið lægra (~17%, 2017)."
      en: "40% is the share of GOODS exports (2012; 39.3% in 2011). Including services exports the share is lower (~17%, 2017)."
    sources:
      - title: "Iceland and the EU — accession briefing (economic weight of fisheries)"
        url: "https://www.europarl.europa.eu/RegData/etudes/briefing_note/join/2014/522331/EXPO-AFET_SP(2014)522331_EN.pdf"
        publisher: "European Parliament"
        tier: primary
  - label:
      is: "Hlutur sjávarútvegs í störfum"
      en: "Share of all jobs"
    valuePct: 7
    caption:
      is: "Um 7% af vinnuafli (2012). Frumvinnslugreinar samtals (landbúnaður, sjávarútvegur, námuvinnsla) eru 6,8% af landsframleiðslu."
      en: "About 7% of the workforce (2012). The primary sector together (agriculture, fisheries, mining) is 6.8% of GDP."
    sources:
      - title: "Iceland and the EU — accession briefing (economic weight of fisheries)"
        url: "https://www.europarl.europa.eu/RegData/etudes/briefing_note/join/2014/522331/EXPO-AFET_SP(2014)522331_EN.pdf"
        publisher: "European Parliament"
        tier: primary

gains:
  - claim:
      is: "Eftir endurskoðun stefnunnar 2013 er stjórnkerfi ESB í sjávarútvegi dreifstýrðara og — samkvæmt skýrslu Hagfræðistofnunar (IES) — samrýmanlegt íslenska kvótakerfinu."
      en: "After the 2013 reform the EU's fisheries management system is more decentralised and — according to the Institute of Economic Studies (IES) report — compatible with Iceland's quota system."
    affects: ["everyone"]
    confidence: medium
    sources:
      - title: "Iceland and the EU — accession briefing"
        url: "https://www.europarl.europa.eu/RegData/etudes/briefing_note/join/2014/522331/EXPO-AFET_SP(2014)522331_EN.pdf"
        publisher: "European Parliament"
        tier: primary
  - claim:
      is: "Kvótahlutdeild yrði fyrirsjáanleg og stöðug: hlutfallslegur stöðugleiki tryggir hverju ríki fasta prósentu yfir tíma, og jafn aðgangur þýðir ekki ótakmarkaðan afla — raunafli helst bundinn kvóta."
      en: "Quota shares would be predictable and stable: relative stability guarantees each state a fixed percentage over time, and equal access does not mean unlimited catch — actual catch stays quota-bound."
    affects: ["everyone"]
    confidence: high
    sources:
      - title: "Regulation (EU) No 1380/2013 on the Common Fisheries Policy (Art. 16(1), Art. 5(1))"
        url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32013R1380"
        publisher: "EUR-Lex"
        tier: primary
      - title: "The Common Fisheries Policy: origins and development (fact sheet 114)"
        url: "https://www.europarl.europa.eu/factsheets/en/sheet/114/the-common-fisheries-policy-origins-and-development"
        publisher: "European Parliament"
        tier: primary

losses:
  - claim:
      is: "Tap á forræði yfir ákvörðun heildarafla: aflamörk yrðu ákveðin á sambandsstigi, þar sem vægi smáríkis í atkvæðagreiðslu væri mjög lítið."
      en: "Loss of control over setting the total allowable catch: catch limits would be decided at Union level, where a small state's voting weight would be very small."
    affects: ["everyone"]
    confidence: high
    sources:
      - title: "Iceland and the EU — accession briefing"
        url: "https://www.europarl.europa.eu/RegData/etudes/briefing_note/join/2014/522331/EXPO-AFET_SP(2014)522331_EN.pdf"
        publisher: "European Parliament"
        tier: primary
      - title: "Summary Conclusions — Iceland's EU accession negotiations"
        url: "https://www.government.is/media/utanrikisraduneyti-media/media/esb/Summary-Conclusions.pdf"
        publisher: "Government of Iceland"
        tier: primary
  - claim:
      is: "Engin varanleg undanþága frá sameiginlegri stefnu hefur nokkru sinni verið veitt umsóknarríki — aðeins tímabundnar (breytanlegar á sambandsstigi); varanleg sérlausn verður að standa í aðildarsamningnum sjálfum. 25 sjómílna svæði Möltu er fordæmi smáríkis, en það er stýrður aðgangur fyrir lítil skip, breytanlegur á sambandsstigi — ekki útilokun eftir fána."
      en: "No permanent derogation from a common policy has ever been granted to a joining country — only temporary ones (changeable at Union level); a permanent special solution must be written into the accession treaty itself. Malta's 25-nautical-mile zone is the small-state precedent, but it is regulated access for small vessels, amendable at Union level — not a flag-based exclusion."
    affects: ["everyone"]
    confidence: high
    sources:
      - title: "Summary Conclusions — Iceland's EU accession negotiations"
        url: "https://www.government.is/media/utanrikisraduneyti-media/media/esb/Summary-Conclusions.pdf"
        publisher: "Government of Iceland"
        tier: primary
      - title: "Council Regulation (EC) No 813/2004 — Malta fisheries management zone"
        url: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32004R0813R(01)"
        publisher: "EUR-Lex"
        tier: primary
  - claim:
      is: "Utan 12 sjómílna fengju ESB-skip jafnan aðgang að íslenskum miðum (kjarni óttans um yfirráð yfir miðunum) — þó afli helist bundinn kvótahlutdeild."
      en: "Outside 12 nautical miles, EU vessels would have equal access to Icelandic waters (the core 'control of our waters' concern) — though catch remains bound by quota shares."
    affects: ["everyone"]
    confidence: high
    sources:
      - title: "Regulation (EU) No 1380/2013 on the Common Fisheries Policy (Art. 5)"
        url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32013R1380"
        publisher: "EUR-Lex"
        tier: primary
      - title: "The Common Fisheries Policy: origins and development (fact sheet 114)"
        url: "https://www.europarl.europa.eu/factsheets/en/sheet/114/the-common-fisheries-policy-origins-and-development"
        publisher: "European Parliament"
        tier: primary

uncertain:
  - claim:
      is: "Óvíst er hvaða kvótahlutdeild Ísland fengi í raun — flestir helstu stofnar (þorskur, loðna, makríll) eru ekki sameiginlegir ESB-stofnar í dag og engin ESB-veiðireynsla er til í íslenskri lögsögu til að byggja úthlutunarlykil á."
      en: "It is uncertain what quota share Iceland would actually receive — most of its key stocks (cod, capelin, mackerel) are not currently shared EU stocks, and there is no EU catch record in its waters on which to base an allocation key."
    confidence: low
    sources:
      - title: "Regulation (EU) No 1380/2013 on the Common Fisheries Policy (relative stability)"
        url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32013R1380"
        publisher: "EUR-Lex"
        tier: primary
  - claim:
      is: "Óvíst er hvort sérstakt „íslenskt stjórnunarsvæði“ að fyrirmynd 25 sjómílna svæðis Möltu gæti raunhæft náð yfir 200 sjómílna lögsögu og stóran iðnaðarflota — fordæmi Möltu nær aðeins til lítilla skipa (undir 12 m) með kyrrstæð veiðarfæri."
      en: "It is uncertain whether a bespoke 'Icelandic management zone' modelled on Malta's 25-nautical-mile zone could realistically cover a 200-nautical-mile EEZ and a large industrial fleet — the Malta precedent only covers small vessels (under 12 m) using non-towed gear."
    confidence: low
    sources:
      - title: "Council Regulation (EC) No 813/2004 — Malta fisheries management zone"
        url: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32004R0813R(01)"
        publisher: "EUR-Lex"
        tier: primary
  - claim:
      is: "Óvíst er hvernig farið yrði með deilistofna og deilur strandríkja (t.d. makríldeiluna), og hvort sjálfstæð málsvörn Íslands rynni inn í eitt sameiginlegt sæti ESB í alþjóðastofnunum eins og NEAFC."
      en: "It is uncertain how shared/straddling stocks and coastal-state disputes (e.g. the mackerel war) would be handled, and whether Iceland's independent advocacy would be subsumed into the EU's single seat in international bodies such as NEAFC."
    confidence: low
    sources:
      - title: "Summary Conclusions — Iceland's EU accession negotiations"
        url: "https://www.government.is/media/utanrikisraduneyti-media/media/esb/Summary-Conclusions.pdf"
        publisher: "Government of Iceland"
        tier: primary

calculator: false
basket: false
lastReviewed: 2026-06-17
confidence: high
```

- [ ] **Step 2: Build to confirm the dossier validates (schema, both locales, source guard)**

Run: `npm run build`
Expected: build completes; page count rises by 2 (now 14: home ×2 + 6 chapters ×2). Routes `dist/fisheries/index.html` and `dist/en/fisheries/index.html` are produced. No "is/en required" or "sources min 1" errors.

- [ ] **Step 3: Confirm the new chapter renders its content and is listed on home**

Run: `grep -l "Relative stability" dist/en/fisheries/index.html && grep -c "Fisheries" dist/en/index.html`
Expected: the fisheries page path is printed (claim text present) and the home page contains "Fisheries" at least once (auto-listed). (The stakes bars are NOT rendered yet — that is Task 3.)

- [ ] **Step 4: Verify the source guard actually bites (TDD safety check)**

Temporarily delete the two `sources:` lines under the first `stakes` bar (leaving `sources: []`), then run `npm run build`.
Expected: build FAILS with a Zod error on `stakes.0.sources` (Array must contain at least 1 element). Then **restore** the sources exactly as written in Step 1 and re-run `npm run build` → green. This confirms the 🔒 guard is live.

- [ ] **Step 5: Commit**

```bash
git add src/content/dossiers/fisheries.yaml
git commit -m "content: chapter 4 fisheries dossier (verified research; is/en, sourced)"
```

---

### Task 3: Build the `Stakes.astro` component and render it as the hook

**Files:**
- Create: `src/i18n/tiers.ts` (shared `tierLabel` map — extracted for DRY)
- Modify: `src/i18n/ui.ts` (add `stakes.title` to both `is` and `en` blocks)
- Create: `src/components/Stakes.astro`
- Modify: `src/components/Dossier.astro` (import `tierLabel` from the new shared module + remove its inline copy; import + render `Stakes` after the hero)

**Interfaces:**
- Consumes: the `stakes` array from `entry.data.stakes` (Task 2 data, Task 1 schema); the `t()` helper and `Lang` type from `src/i18n/ui.ts`; the shared `tierLabel` from `src/i18n/tiers.ts`.
- Produces: `tierLabel` (exported from `src/i18n/tiers.ts`, used by both `Dossier.astro` and `Stakes.astro`); `<Stakes bars={...} lang={...} />` — a zero-JS section rendering each bar's label, percentage, neutral fill bar, caption, and source chips.

- [ ] **Step 1a: Create the shared `tierLabel` module** — create `src/i18n/tiers.ts` (DRY: single source of truth for source-tier display labels, consumed by both `Dossier.astro` and `Stakes.astro`):

```ts
/** Source-tier display labels (primary/academic/press/advocacy), bilingual. */
export const tierLabel: Record<string, { is: string; en: string }> = {
  primary: { is: 'frumheimild', en: 'primary' },
  academic: { is: 'fræðigrein', en: 'academic' },
  press: { is: 'fjölmiðill', en: 'press' },
  advocacy: { is: 'málsvari', en: 'advocacy' },
};
```

- [ ] **Step 1: Add the i18n key** — in `src/i18n/ui.ts`, add to the `is` block (e.g. right after the `'dossier.back': 'Allir kaflar',` line):

```ts
    'stakes.title': 'Hvað er í húfi',
```

and to the `en` block (right after `'dossier.back': 'All chapters',`):

```ts
    'stakes.title': "What's at stake",
```

- [ ] **Step 2: Create `src/components/Stakes.astro`** with this exact content:

```astro
---
import type { Lang } from '../i18n/ui';
import { t } from '../i18n/ui';
import { tierLabel } from '../i18n/tiers';

interface Bar {
  label: { is: string; en: string };
  valuePct: number;
  caption: { is: string; en: string };
  sources: { title: string; url: string; publisher?: string; tier: string }[];
}
interface Props {
  bars: Bar[];
  lang: Lang;
}
const { bars, lang } = Astro.props;
---

<section class="stakes" aria-label={t(lang, 'stakes.title')}>
  <p class="s-label">{t(lang, 'stakes.title')}</p>
  <ul>
    {bars.map((b) => (
      <li class="bar-row">
        <div class="bar-head">
          <span class="bar-label">{b.label[lang]}</span>
          <span class="bar-val">{b.valuePct}%</span>
        </div>
        <div class="track" aria-hidden="true">
          <div class="fill" style={`width:${b.valuePct}%`} />
        </div>
        <p class="caption">{b.caption[lang]}</p>
        <div class="srcs">
          {b.sources.map((s) => (
            <a class="chip" href={s.url} target="_blank" rel="noopener">
              <span class="tier">{tierLabel[s.tier]?.[lang] ?? s.tier}</span>
              {s.publisher ?? s.title}
            </a>
          ))}
        </div>
      </li>
    ))}
  </ul>
</section>

<style>
  .stakes {
    border: 1px solid var(--line-strong); border-radius: 4px;
    padding: 1.5rem clamp(1rem, 3vw, 1.75rem); margin-bottom: 4rem;
    background: var(--paper-raised);
  }
  .s-label { font-family: var(--display); font-weight: 600; font-size: 1.15rem; margin: 0 0 1.25rem; }
  .stakes ul { list-style: none; margin: 0; padding: 0; }
  .bar-row { padding: 0.9rem 0; border-top: 1px solid var(--line); }
  .bar-row:first-child { border-top: none; }
  .bar-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem; }
  .bar-label { font-size: 1.02rem; }
  .bar-val { font-family: var(--mono); font-weight: 600; font-size: 1.1rem; color: var(--ink); }
  /* Neutral fill — a statistic is neither a gain nor a loss. */
  .track { height: 0.6rem; background: var(--line); border-radius: 2px; overflow: hidden; }
  .fill { height: 100%; background: var(--slate); border-radius: 2px; }
  .caption { font-size: 0.9rem; color: var(--muted); margin: 0.55rem 0 0.6rem; }
  .srcs { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .chip {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-family: var(--mono); font-size: 0.72rem; text-decoration: none; color: var(--slate);
    background: var(--paper); border: 1px solid var(--line-strong); border-radius: 2px;
    padding: 0.22rem 0.5rem; line-height: 1.3;
  }
  .chip:hover { border-color: var(--slate); background: var(--paper-raised); }
  .chip .tier {
    font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--brass);
    border-right: 1px solid var(--line-strong); padding-right: 0.4rem;
  }
</style>
```

- [ ] **Step 3: Wire it into `Dossier.astro`** — three edits:

(a) Add the imports beside the existing component imports (after `import Basket from './Basket.astro';` on line 7):

```astro
import Stakes from './Stakes.astro';
import { tierLabel } from '../i18n/tiers';
```

(b) **Remove** the now-duplicated inline `tierLabel` const from `Dossier.astro`'s frontmatter (the block at lines 28–33):

```astro
const tierLabel: Record<string, { is: string; en: string }> = {
  primary: { is: 'frumheimild', en: 'primary' },
  academic: { is: 'fræðigrein', en: 'academic' },
  press: { is: 'fjölmiðill', en: 'press' },
  advocacy: { is: 'málsvari', en: 'advocacy' },
};
```

(The existing `tierLabel[s.tier]?.[lang] ?? s.tier` usages in the chip markup now resolve to the imported map — no change needed at the call sites.)

(c) Render `Stakes` between the closing `</header>` (line 56) and the `<!-- Today vs. As a member -->` comment (line 58):

```astro
  </header>

  {d.stakes && d.stakes.length > 0 && <Stakes bars={d.stakes} lang={lang} />}

  <!-- Today vs. As a member: the before/after spine -->
```

- [ ] **Step 4: Typecheck**

Run: `npx astro check`
Expected: `0 errors` (the `stakes.title` key resolves through `t()`; `Stakes` props type-match the data).

- [ ] **Step 5: Build and confirm the bars render in BOTH locales**

Run: `npm run build`
Expected: build green (14 pages).

Run: `grep -o "What's at stake" dist/en/fisheries/index.html | head -1 && grep -o "Share of goods exports" dist/en/fisheries/index.html | head -1 && grep -o "width:40%" dist/en/fisheries/index.html | head -1`
Expected: all three strings print (heading, bar label, the 40% fill width).

Run: `grep -o "Hvað er í húfi" dist/fisheries/index.html | head -1 && grep -o "width:7%" dist/fisheries/index.html | head -1`
Expected: both strings print (Icelandic heading + the 7% fill width).

- [ ] **Step 6: Confirm no refuted claim leaked in**

Run: `grep -ci "non-discriminatory\|expired 31 December 2022\|expires 31 December 2022" dist/en/fisheries/index.html`
Expected: `0`.

- [ ] **Step 7: Commit**

```bash
git add src/i18n/tiers.ts src/i18n/ui.ts src/components/Stakes.astro src/components/Dossier.astro
git commit -m "feat: generic Stakes stat-bar component (shared tierLabel), fisheries hook"
```

---

### Task 4: Visual verification and final review

**Files:** none (verification only; uses the built site).

- [ ] **Step 1: Serve the production build**

Run: `npm run preview`
Expected: a local preview URL (note the base path — pages live under `/eu-yes-or-no/`, e.g. `http://localhost:4321/eu-yes-or-no/fisheries` and `/eu-yes-or-no/en/fisheries`).

- [ ] **Step 2: Screenshot the Icelandic chapter** (Playwright MCP: navigate + full-page screenshot of `/eu-yes-or-no/fisheries`). Confirm visually:
  - The "Hvað er í húfi" stakes block appears **after the hero summary and before the Staðan í dag / Sem aðildarríki panels** (the hook position).
  - Two bars: ~40% (longer) and ~7% (short); fills are **neutral slate**, not green/red.
  - Each bar shows its caption (the goods-vs-services caveat is visible, not clipped) and a clickable source chip with a `frumheimild` tier badge.
  - The gains (2) / costs (3) ledger and the dashed uncertainty box (3) all render with source chips.

- [ ] **Step 3: Screenshot the English chapter** (`/eu-yes-or-no/en/fisheries`). Confirm the same, with English copy ("What's at stake", "Share of goods exports", `primary` badges).

- [ ] **Step 4: Confirm the home listing** — navigate to `/eu-yes-or-no/` and `/eu-yes-or-no/en/`; confirm a chapter card "Fiskveiðar" / "Fisheries" appears in order position 05.

- [ ] **Step 5: Mobile reflow check** — resize to 375px wide on the IS chapter; confirm the stakes bars and bar-heads stay readable (label/value on one row, bar full-width) and nothing overflows.

- [ ] **Step 6: Final commit (docs/state) if any screenshots or notes are saved; otherwise nothing to commit.** The chapter is complete locally.

> **Going live:** the chapter publishes on `git push` (auto-deploy). The Icelandic copy is **AI-draft** — before/at push, flag `fisheries.yaml` for native review (Nína / Gísli) per the review-status memory, exactly like the other chapters (the home page already shows the "work in progress — sourced but not yet copy-edited" badge). Push is a separate, user-confirmed step — do not push without Gísli's go-ahead.

---

## Self-Review

**1. Spec coverage:**
- Dossier content (tldr/summary/today/asMember/gains/losses/uncertain, sourced, bilingual) → Task 2. ✅
- `order: 5` → Task 2. ✅
- Generic sourced `stakes` schema field → Task 1. ✅
- `Stakes.astro` component, neutral bars, rendered as opening hook → Task 3. ✅
- i18n `stakes.title` → Task 3. ✅
- Facts-only / no invented shares → no quota-share number anywhere in Task 2 data; uncertain #1 states the shares are unknown. ✅
- No padded 4th loss; advocacy in uncertain → Task 2 (3 losses, advocacy is uncertain #3). ✅
- Single-market argument excluded → not present in Task 2 data; remains a spec follow-up. ✅
- Refuted claims absent → Task 3 Step 6 greps for them = 0. ✅
- Source guard enforced → Task 2 Step 4 proves the build fails without sources. ✅
- Methodology-page asymmetry note → out of scope here (separate site-wide task, logged in spec follow-up #4); correctly NOT in this plan. ✅
- Build + typecheck + visual IS/EN verification → Tasks 1–4. ✅

**2. Placeholder scan:** No TBD/TODO/"handle appropriately"/"similar to" — all code and commands are literal. ✅

**3. Type consistency:** `statBar` fields (`label`, `valuePct`, `caption`, `sources`) in Task 1 match the YAML keys in Task 2 and the `Bar` interface in Task 3's `Stakes.astro`. The `t(lang, 'stakes.title')` key added in Task 3 Step 1 matches the call in `Stakes.astro`. The `<Stakes bars={d.stakes} lang={lang} />` props match the component's `Props`. ✅
