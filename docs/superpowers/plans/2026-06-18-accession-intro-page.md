# Accession "Start here" Intro Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone, sourced "Start here" framing page at `/start-here` (both locales) that answers the "kíkja í pakkann" question, and link it from the Home page and footer.

**Architecture:** Follow the Methodology pattern (bilingual data file + render-only `.astro` component + two route wrappers), but sourced. First extract a shared `SourceChips.astro` from `Dossier.astro` (DRY), then build the data, the component, the routes, and the links. Zero-JS, bilingual `Loc` everywhere.

**Tech Stack:** Astro 6, TypeScript data modules, scoped `.astro` styles, existing `t()` i18n + `tierLabel` helpers. No new deps. Vitest suite untouched.

## Global Constraints

- **Bilingual or build-fails:** every user-facing string is `Loc = { is: string; en: string }`, both non-empty.
- **Sourced factual claims:** every `SourcedPoint`/`Precedent` carries ≥1 `Source` rendered as a tier-badged chip (reuse `tierLabel` from `src/i18n/tiers.ts`).
- **Section 4 (the ⅔ myth-buster) ships ONLY the three already-verified beats** (see Task 2). The page must NOT state: the enumerated list of which 11 chapters were closed; that "chapters can reopen"; or any restart-procedure mechanics. Those are deferred.
- **Standalone page, not a numbered chapter** — it is NOT in the `dossiers` content collection; it has its own route + component.
- **Slug `start-here`** for both locales (`/start-here`, `/en/start-here`), via `getRelativeLocaleUrl(lang, 'start-here')`.
- **No length disclaimer; no reading-time chip.** A positive role-signal line in the hero lead instead.
- **Node ≥ 22.12.** Verification = `npm run build` green + `npm test` (15/15) + visual check. No `.astro` unit-test harness.
- **EUR-Lex URLs are JS-only** — fine as `href`s (users' browsers render them); don't try to fetch them in tooling.
- **Icelandic copy is AI-draft** → flag for Nína review; not a deploy gate.
- Conventional commits, ending with the `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>` trailer.

---

### Task 1: Extract `SourceChips.astro` and refactor `Dossier.astro` to use it

**Files:**
- Create: `src/components/SourceChips.astro`
- Modify: `src/components/Dossier.astro` (replace 3 inline chip blocks; delete now-unused `.srcs/.chip/.tier` CSS)

**Interfaces:**
- Produces: `<SourceChips sources={Source[]} lang={Lang} />` where `Source = { title: string; url: string; publisher?: string; tier: string }`. Renders a `.srcs` wrapper of `.chip` anchors, each a tier badge + publisher/title, opening in a new tab.

- [ ] **Step 1: Create the shared component**

Create `src/components/SourceChips.astro` with exactly the markup + styles currently inlined in `Dossier.astro`:

```astro
---
import { tierLabel } from '../i18n/tiers';
import type { Lang } from '../i18n/ui';

interface Source {
  title: string;
  url: string;
  publisher?: string;
  tier: string;
}
const { sources, lang } = Astro.props as { sources: Source[]; lang: Lang };
---

<div class="srcs">
  {sources.map((s) => (
    <a class="chip" href={s.url} target="_blank" rel="noopener">
      <span class="tier">{tierLabel[s.tier]?.[lang] ?? s.tier}</span>
      {s.publisher ?? s.title}
    </a>
  ))}
</div>

<style>
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

- [ ] **Step 2: Import it in `Dossier.astro`**

Add to the frontmatter imports of `src/components/Dossier.astro` (near the other component imports, after `import Stakes from './Stakes.astro';`):

```astro
import SourceChips from './SourceChips.astro';
```

- [ ] **Step 3: Replace the three inline chip blocks**

In `src/components/Dossier.astro`, there are three identical blocks of the form:

```astro
            <div class="srcs">
              {p.sources.map((s) => (
                <a class="chip" href={s.url} target="_blank" rel="noopener">
                  <span class="tier">{tierLabel[s.tier]?.[lang] ?? s.tier}</span>
                  {s.publisher ?? s.title}
                </a>
              ))}
            </div>
```

(in the `gains` list, the `losses` list, and the `uncertain` list). Replace each of the three with:

```astro
            <SourceChips sources={p.sources} lang={lang} />
```

- [ ] **Step 4: Delete the now-unused CSS from `Dossier.astro`**

In the `<style>` block of `Dossier.astro`, delete the `.srcs { ... }`, `.chip { ... }`, `.chip:hover { ... }`, and `.chip .tier { ... }` rules (they now live in `SourceChips.astro`). Leave all other styles untouched. (The `tierLabel` import in `Dossier.astro` may now be unused — if so, remove it too; if `astro check` reports it unused, remove it.)

- [ ] **Step 5: Build and verify dossier chips still render**

Run: `npm run build`
Expected: PASS (14 pages). Then confirm chips still render in the built output:

```bash
grep -c 'class="chip"' dist/husnaedislan/index.html
```
Expected: a non-zero count (the home-loans chapter has sourced points, so chips render via the new component).

- [ ] **Step 6: Commit**

```bash
git add src/components/SourceChips.astro src/components/Dossier.astro
git commit -m "refactor(dossier): extract shared SourceChips component

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Create the page content data module `src/data/accession.ts`

**Files:**
- Create: `src/data/accession.ts`

**Interfaces:**
- Produces (all consumed by `Accession.astro` in Task 3):
  `Loc`, `Source`, `SourcedPoint { text: Loc; sources: Source[] }`, `Precedent { deal: Loc; instrument: Loc; permanence: 'permanent'|'temporary'|'none'; sources: Source[] }`, `Section { heading: Loc; body: Loc[]; points?: SourcedPoint[] }`; and the exports `header`, `bottomLine: Loc[]`, `sections: Section[]`, `fixed: SourcedPoint[]`, `negotiable: SourcedPoint[]`, `precedents: Precedent[]`, `decisive: SourcedPoint`, `close: { body: Loc[] }`.

- [ ] **Step 1: Create the data file**

Create `src/data/accession.ts` with exactly this content (Icelandic is AI-draft for later review; sources are verbatim from `docs/research/accession-process.md`):

```ts
/** Bilingual content for the "Start here / What's in the package?" intro page. Prose here; the component renders it. */
export interface Loc { is: string; en: string }
export interface Source { title: string; url: string; publisher?: string; tier: 'primary' | 'academic' | 'advocacy' | 'press' }
export interface SourcedPoint { text: Loc; sources: Source[] }
export interface Precedent {
  deal: Loc;
  instrument: Loc;
  permanence: 'permanent' | 'temporary' | 'none';
  sources: Source[];
}
export interface Section { heading: Loc; body: Loc[]; points?: SourcedPoint[] }

// --- Sources (verbatim from the verified accession-process dossier) ---
const MFA: Source = { title: 'Summary Conclusions of the accession negotiations', url: 'https://www.government.is/media/utanrikisraduneyti-media/media/esb/Summary-Conclusions.pdf', publisher: 'Iceland MFA', tier: 'primary' };
const EP_BRIEFING: Source = { title: 'Iceland and the EU (briefing)', url: 'https://www.europarl.europa.eu/RegData/etudes/briefing_note/join/2014/522331/EXPO-AFET_SP(2014)522331_EN.pdf', publisher: 'European Parliament', tier: 'primary' };
const EC_CHAPTERS: Source = { title: 'Chapters of the acquis', url: 'https://enlargement.ec.europa.eu/enlargement-policy/conditions-membership/chapters-acquis_en', publisher: 'European Commission', tier: 'primary' };
const EC_STEPS: Source = { title: 'Steps towards joining', url: 'https://enlargement.ec.europa.eu/enlargement-policy/steps-towards-joining_en', publisher: 'European Commission', tier: 'primary' };
const TURKEY_FRAMEWORK: Source = { title: 'Negotiating Framework (permanent safeguards contemplated)', url: 'https://enlargement.ec.europa.eu/system/files/2018-12/st20002_05_tr_framedoc_en.pdf', publisher: 'Council of the EU', tier: 'primary' };
const MALTA_P6: Source = { title: 'Protocol No 6 — secondary residences in Malta', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:12003T/PRO/06', publisher: 'EUR-Lex', tier: 'primary' };
const ALAND_P2: Source = { title: 'Protocol No 2 — the Åland Islands', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:11994N/PRO/02', publisher: 'EUR-Lex', tier: 'primary' };
const SNUS_DIR: Source = { title: 'Directive 2014/40/EU, Article 17 (oral tobacco)', url: 'https://www.legislation.gov.uk/eudr/2014/40/article/17', publisher: 'legislation.gov.uk', tier: 'primary' };
const NORTHERN_DEC: Source = { title: 'Commission Decision 95/196/EC — northern (Art. 142) aid', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:31995D0196', publisher: 'European Commission', tier: 'primary' };
const ACT_2003: Source = { title: '2003 Act of Accession (transitional provisions)', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:12003T/TXT', publisher: 'EUR-Lex', tier: 'primary' };
const EPRS_REBATE: Source = { title: 'The UK rebate', url: 'https://www.europarl.europa.eu/RegData/etudes/BRIE/2016/577973/EPRS_BRI(2016)577973_EN.pdf', publisher: 'European Parliament', tier: 'primary' };
const EP_FS114: Source = { title: 'The Common Fisheries Policy: origins and development', url: 'https://www.europarl.europa.eu/factsheets/en/sheet/114/the-common-fisheries-policy-origins-and-development', publisher: 'European Parliament', tier: 'primary' };

export const header: { eyebrow: Loc; title: Loc; lead: Loc } = {
  eyebrow: { is: 'Byrjaðu hér', en: 'Start here' },
  title: { is: 'Hvað er í pakkanum?', en: "What's in the package?" },
  lead: {
    is: 'Þessi síða sýnir hvar Ísland stendur raunverulega — áður en þú lest kaflana. Hver kafli tekur svo eitt efni fyrir í þaula; þeir eru styttri og þú mátt lesa þá í hvaða röð sem er.',
    en: 'This page shows where Iceland actually stands — before you read the chapters. Each chapter then takes one topic in depth; they are shorter, and you can read them in any order.',
  },
};

export const bottomLine: Loc[] = [
  {
    is: 'Ísland er nú þegar um tveir þriðju „inni“ í ESB gegnum EES-samninginn. Þjóðaratkvæðagreiðslan snýst aðeins um hvort hefja eigi viðræður á ný — ekki um aðild sjálfa.',
    en: 'Iceland is already about two-thirds "in" the EU through the EEA Agreement. The referendum is only about whether to reopen talks — not about membership itself.',
  },
  {
    is: 'Að „kíkja í pakkann“ skuldbindur ekki til neins: hægt er að ganga frá borði, eins og Ísland gerði 2013–2015. En það sem ekki er í boði er að velja úr reglubókinni — aðild þýðir að taka upp regluverk ESB í heild. Varanlegar sérlausnir eru til, en sjaldgæfar og þröngar.',
    en: 'Peeking in the package commits you to nothing — you can walk away, as Iceland did in 2013–2015. What is not on offer is cherry-picking the rulebook: membership means adopting the EU acquis in full. Permanent carve-outs exist, but they are rare and narrow.',
  },
];

export const sections: Section[] = [
  {
    heading: { is: 'Hvað þýðir það að hefja viðræður?', en: 'What opening talks actually means' },
    body: [
      { is: 'Að opna viðræður bindur Ísland ekki til að ganga í ESB. Ferlið er afturkræft.', en: 'Opening negotiations does not bind Iceland to join the EU. The process is reversible.' },
    ],
    points: [
      {
        text: { is: 'Ísland opnaði viðræður í júní 2011; ný ríkisstjórn stöðvaði þær í maí 2013 og umsóknin var lögð til hliðar. Það sýnir að hægt er að hefja viðræður og ganga svo frá borði.', en: 'Iceland opened talks in June 2011; a new government halted them in May 2013 and the application was set aside. You can open talks and then walk away.' },
        sources: [MFA, EP_BRIEFING],
      },
    ],
  },
  {
    heading: { is: 'Erum við ekki búin að festa tvo þriðju í sessi?', en: "Haven't we already locked in two-thirds?" },
    body: [
      { is: 'Nei. Þessir tveir þriðju eru EES-reglur sem Ísland beitir nú þegar — það myndi flýta fyrir aðild, en festir ekkert í sessi.', en: 'No. That two-thirds is EEA law Iceland already applies — it would make accession faster, but it locks nothing in.' },
    ],
    points: [
      {
        text: { is: 'Að hafa þegar tekið upp stóran hluta regluverksins flýtir ferlinu en veitir enga sérstöðu: stjórnvöld sögðu sjálf að engin augljós ástæða væri til að ætla að formlega ferlið yrði hraðað.', en: "Already applying much of the acquis speeds the process but grants no special standing: Iceland's own government said there was \"no obvious reason to assume\" the formal process could be accelerated." },
        sources: [MFA],
      },
      {
        text: { is: 'Ekkert verður bindandi fyrr en fullgerður aðildarsamningur er undirritaður og fullgiltur af öllum aðildarríkjum og Evrópuþinginu. Kaflarnir sem Ísland „lokaði til bráðabirgða“ bundu því ekkert.', en: 'Nothing becomes binding until a complete Accession Treaty is signed and ratified by every member state and the European Parliament. So the chapters Iceland "provisionally closed" bound nothing.' },
        sources: [EC_STEPS],
      },
      {
        text: { is: 'Og erfiðasti þriðjungurinn var aldrei ræddur: sjávarútvegur, landbúnaður, frjálst flæði fjármagns og staðfesturéttur voru aldrei opnuð.', en: 'And the hardest third was never negotiated: fisheries, agriculture, free movement of capital and right of establishment were never opened.' },
        sources: [MFA, EP_BRIEFING],
      },
    ],
  },
];

export const fixed: SourcedPoint[] = [
  {
    text: { is: 'Þú tekur upp allt regluverk ESB (35 kaflar). Samið er um hvernig og hvenær — ekki hvort.', en: 'You adopt the entire EU acquis (35 chapters). You negotiate how and when — not whether.' },
    sources: [EC_CHAPTERS, EC_STEPS],
  },
];

export const negotiable: SourcedPoint[] = [
  {
    text: { is: 'Aðlögunartímabil (tímabundin) til að innleiða reglur í áföngum.', en: 'Transition periods (temporary) to phase rules in over time.' },
    sources: [ACT_2003, TURKEY_FRAMEWORK],
  },
  {
    text: { is: 'Varanlegar undanþágur eða bókanir — sjaldgæfar; krefjast einróma samþykkis allra aðildarríkja, samþykkis Evrópuþingsins og fullgildingar.', en: 'Permanent derogations or protocols — rare; they require unanimous agreement of all members, EP consent, and ratification.' },
    sources: [TURKEY_FRAMEWORK],
  },
];

export const precedents: Precedent[] = [
  { deal: { is: 'Malta — sumarhús/aukabúseta', en: 'Malta — second homes' }, instrument: { is: 'Bókun nr. 6, aðildarsamningur 2003', en: 'Protocol No 6, 2003 Act of Accession' }, permanence: 'permanent', sources: [MALTA_P6] },
  { deal: { is: 'Álandseyjar — fasteignir og staðfesturéttur', en: 'Åland Islands — property & establishment' }, instrument: { is: 'Bókun nr. 2, aðildarsamningur 1994', en: 'Protocol No 2, 1994 Act of Accession' }, permanence: 'permanent', sources: [ALAND_P2] },
  { deal: { is: 'Svíþjóð — snus (munntóbak)', en: 'Sweden — snus (oral tobacco)' }, instrument: { is: '151. gr. aðildarsamnings 1994; tilskipun 2014/40/ESB, 17. gr.', en: 'Art. 151, 1994 Act of Accession; Directive 2014/40/EU, Art. 17' }, permanence: 'permanent', sources: [SNUS_DIR] },
  { deal: { is: 'Finnland/Svíþjóð — norðlægur landbúnaðarstuðningur', en: 'Finland/Sweden — northern farm aid' }, instrument: { is: '142. gr. aðildarsamnings 1994', en: 'Art. 142, 1994 Act of Accession' }, permanence: 'permanent', sources: [NORTHERN_DEC] },
  { deal: { is: 'Pólland — kaup á landbúnaðarlandi', en: 'Poland — farmland acquisition' }, instrument: { is: 'Aðlögunartími (12 ár, til 2016), aðildarsamningur 2003', en: 'Transition period (12 yrs, to 2016), 2003 Act of Accession' }, permanence: 'temporary', sources: [ACT_2003] },
  { deal: { is: '2004-ríkin — frjáls för launafólks', en: '2004 entrants — free movement of workers' }, instrument: { is: '„2+3+2“ aðlögun (lauk 2011), aðildarsamningur 2003', en: '"2+3+2" transition (ended 2011), 2003 Act of Accession' }, permanence: 'temporary', sources: [ACT_2003] },
  { deal: { is: 'Bretland — endurgreiðsla úr sameiginlegum sjóðum', en: 'United Kingdom — budget rebate' }, instrument: { is: 'Fontainebleau-fundurinn 1984 / ákvörðun um eigin tekjur 1985 — EKKI aðildarskilmáli', en: '1984 Fontainebleau Council / 1985 Own Resources Decision — NOT an accession term' }, permanence: 'none', sources: [EPRS_REBATE] },
];

export const decisive: SourcedPoint = {
  text: { is: 'Ekkert aðildarríki hefur nokkru sinni fengið varanlega undanþágu frá sameiginlegu sjávarútvegs- eða landbúnaðarstefnunni. Noregur (1994) komst næst — og hafnaði aðild.', en: 'No acceding state has ever obtained a permanent derogation from the Common Fisheries or Agricultural Policy. Norway (1994) came closest — and rejected membership.' },
  sources: [EP_FS114],
};

export const close: { body: Loc[] } = {
  body: [
    { is: 'Niðurstaðan: að hefja viðræður er ódýrt og afturkræft — en það sem ekki er hægt er að velja úr reglubókinni. Lestu kaflana til að sjá hvað breytist, efni fyrir efni.', en: 'Bottom line: opening talks is low-cost and reversible — but you cannot cherry-pick the rulebook. Read the chapters to see what changes, topic by topic.' },
  ],
};
```

- [ ] **Step 2: Verify it type-checks and builds**

Run: `npm run build`
Expected: PASS (still 14 pages — nothing imports this module yet; this step just proves the module compiles and is type-valid).

- [ ] **Step 3: Commit**

```bash
git add src/data/accession.ts
git commit -m "feat(accession): bilingual data module for the Start-here page

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Build `Accession.astro` + the two route wrappers + page-title i18n key

**Files:**
- Create: `src/components/Accession.astro`
- Create: `src/pages/start-here.astro`
- Create: `src/pages/en/start-here.astro`
- Modify: `src/i18n/ui.ts` (add `accession.navTitle` to both locales)

**Interfaces:**
- Consumes: everything exported from `src/data/accession.ts` (Task 2); `<SourceChips>` (Task 1); `getRelativeLocaleUrl`, `t`, `Lang`.
- Produces: a rendered page at `/start-here` and `/en/start-here`.

- [ ] **Step 1: Add the page-title i18n key**

In `src/i18n/ui.ts`, add to the `is` block (near the other `nav.*`/page keys):

```ts
    'accession.navTitle': 'Hvað er í pakkanum?',
```

and to the `en` block:

```ts
    'accession.navTitle': "What's in the package?",
```

- [ ] **Step 2: Create the render-only component**

Create `src/components/Accession.astro`:

```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n';
import type { Lang } from '../i18n/ui';
import SourceChips from './SourceChips.astro';
import { header, bottomLine, sections, fixed, negotiable, precedents, decisive, close } from '../data/accession';

interface Props { lang: Lang }
const { lang } = Astro.props;
const homeHref = getRelativeLocaleUrl(lang, '');

const permanenceLabel: Record<string, { is: string; en: string }> = {
  permanent: { is: 'Varanlegt', en: 'Permanent' },
  temporary: { is: 'Tímabundið — rann út', en: 'Temporary — expired' },
  none: { is: 'Ekki aðildarskilmáli', en: 'Not an accession term' },
};
const readChapters = { is: 'Lesa kaflana', en: 'Read the chapters' };
const fixedLabel = { is: 'Fast — ekki samningsatriði', en: 'Fixed — not negotiable' };
const negotiableLabel = { is: 'Samningsatriði', en: 'What you can bargain for' };
const precedentsLabel = { is: 'Hvað fengu önnur ríki?', en: 'What other countries actually got' };
---

<article class="accession">
  <header class="a-hero">
    <p class="eyebrow">{header.eyebrow[lang]}</p>
    <h1>{header.title[lang]}</h1>
    <p class="lead">{header.lead[lang]}</p>
  </header>

  <aside class="bottom-line">
    {bottomLine.map((p) => <p>{p[lang]}</p>)}
  </aside>

  {sections.map((s) => (
    <section class="a-section">
      <h2>{s.heading[lang]}</h2>
      {s.body.map((p) => <p class="body">{p[lang]}</p>)}
      {s.points && (
        <ul class="points">
          {s.points.map((pt) => (
            <li>
              <p class="claim">{pt.text[lang]}</p>
              <SourceChips sources={pt.sources} lang={lang} />
            </li>
          ))}
        </ul>
      )}
    </section>
  ))}

  <section class="a-section split">
    <div class="col fixed">
      <h3>{fixedLabel[lang]}</h3>
      <ul class="points">
        {fixed.map((pt) => (
          <li><p class="claim">{pt.text[lang]}</p><SourceChips sources={pt.sources} lang={lang} /></li>
        ))}
      </ul>
    </div>
    <div class="col negotiable">
      <h3>{negotiableLabel[lang]}</h3>
      <ul class="points">
        {negotiable.map((pt) => (
          <li><p class="claim">{pt.text[lang]}</p><SourceChips sources={pt.sources} lang={lang} /></li>
        ))}
      </ul>
    </div>
  </section>

  <section class="a-section">
    <h2>{precedentsLabel[lang]}</h2>
    <ul class="precedents">
      {precedents.map((p) => (
        <li class={`prec ${p.permanence}`}>
          <span class={`tag ${p.permanence}`}>{permanenceLabel[p.permanence][lang]}</span>
          <span class="deal">{p.deal[lang]}</span>
          <span class="instrument">{p.instrument[lang]}</span>
          <SourceChips sources={p.sources} lang={lang} />
        </li>
      ))}
    </ul>
  </section>

  <aside class="decisive">
    <p class="claim">{decisive.text[lang]}</p>
    <SourceChips sources={decisive.sources} lang={lang} />
  </aside>

  <section class="a-close">
    {close.body.map((p) => <p>{p[lang]}</p>)}
    <a class="read-chapters" href={homeHref}>{readChapters[lang]} →</a>
  </section>
</article>

<style>
  .accession { max-width: 48rem; margin: 0 auto; padding: 2.5rem clamp(1rem, 5vw, 2.5rem) 4rem; }
  .a-hero { margin-bottom: 2rem; }
  .eyebrow {
    font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.14em;
    color: var(--brass); margin: 0 0 0.75rem;
  }
  .a-hero h1 { font-size: clamp(2rem, 5.5vw, 3rem); margin: 0 0 1rem; }
  .lead {
    font-family: var(--display); font-weight: 500; font-size: clamp(1.15rem, 2.5vw, 1.45rem);
    line-height: 1.35; color: var(--ink); margin: 0;
  }

  .bottom-line {
    border: 1px solid var(--line-strong); border-left: 4px solid var(--brass);
    background: var(--paper-raised); border-radius: 4px;
    padding: 1.25rem clamp(1rem, 3vw, 1.6rem); margin: 0 0 3rem;
  }
  .bottom-line p { margin: 0 0 0.75rem; font-size: 1.0625rem; }
  .bottom-line p:last-child { margin-bottom: 0; }

  .a-section { margin-bottom: 2.75rem; }
  .a-section h2 { font-size: 1.5rem; margin: 0 0 0.75rem; }
  .a-section h3 { font-size: 1.15rem; margin: 0 0 0.75rem; }
  .a-section .body { font-size: 1.0625rem; margin: 0 0 1rem; }

  .points { list-style: none; margin: 0; padding: 0; }
  .points li { padding: 0.9rem 0; border-top: 1px solid var(--line); }
  .points li:first-child { border-top: none; }
  .claim { margin: 0 0 0.6rem; font-size: 1.02rem; }

  .split { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .col.fixed { border-left: 3px solid var(--loss-bg); padding-left: 1rem; }
  .col.negotiable { border-left: 3px solid var(--gain-bg); padding-left: 1rem; }

  .precedents { list-style: none; margin: 0; padding: 0; }
  .prec {
    display: grid; grid-template-columns: auto 1fr; gap: 0.35rem 0.9rem; align-items: baseline;
    padding: 0.9rem 0; border-top: 1px solid var(--line);
  }
  .prec:first-child { border-top: none; }
  .prec .tag {
    grid-row: 1 / span 1; font-family: var(--mono); font-size: 0.62rem; text-transform: uppercase;
    letter-spacing: 0.06em; padding: 0.15rem 0.45rem; border-radius: 2px; white-space: nowrap; align-self: start;
  }
  .prec .tag.permanent { color: var(--gain); border: 1px solid var(--gain-bg); }
  .prec .tag.temporary { color: var(--brass); border: 1px solid var(--line-strong); }
  .prec .tag.none { color: var(--muted); border: 1px solid var(--line-strong); }
  .prec .deal { font-family: var(--display); font-weight: 600; }
  .prec .instrument { grid-column: 2; font-size: 0.95rem; color: #34322d; }
  .prec :global(.srcs) { grid-column: 2; margin-top: 0.2rem; }

  .decisive {
    border: 1px solid var(--loss); border-left: 4px solid var(--loss);
    background: var(--paper-raised); border-radius: 4px;
    padding: 1.25rem clamp(1rem, 3vw, 1.6rem); margin: 0 0 3rem;
  }
  .decisive .claim { font-family: var(--display); font-weight: 500; font-size: 1.15rem; }

  .a-close p { font-size: 1.0625rem; margin: 0 0 1rem; }
  .read-chapters {
    font-family: var(--mono); font-size: 0.85rem; color: var(--slate);
    text-decoration: none; border-bottom: 1px solid var(--line-strong);
  }
  .read-chapters:hover { color: var(--ink); }

  @media (max-width: 40rem) {
    .split { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 3: Create the route wrappers**

Create `src/pages/start-here.astro`:

```astro
---
import Base from '../layouts/Base.astro';
import Accession from '../components/Accession.astro';
import { t } from '../i18n/ui';
---

<Base lang="is" title={t('is', 'accession.navTitle')}>
  <Accession lang="is" />
</Base>
```

Create `src/pages/en/start-here.astro`:

```astro
---
import Base from '../../layouts/Base.astro';
import Accession from '../../components/Accession.astro';
import { t } from '../../i18n/ui';
---

<Base lang="en" title={t('en', 'accession.navTitle')}>
  <Accession lang="en" />
</Base>
```

- [ ] **Step 4: Build and verify the page renders in both locales**

Run: `npm run build`
Expected: PASS, **16 pages** (14 + the two new routes). Then:

```bash
test -e dist/start-here/index.html && echo "OK: /start-here"
test -e dist/en/start-here/index.html && echo "OK: /en/start-here"
grep -q "What's in the package" dist/en/start-here/index.html && echo "OK: en title renders"
grep -q "Hvað er í pakkanum" dist/start-here/index.html && echo "OK: is title renders"
grep -c 'class="chip"' dist/en/start-here/index.html
```
Expected: both `OK:` route lines, both title lines, and a non-zero chip count (the page is sourced).

- [ ] **Step 5: Commit**

```bash
git add src/components/Accession.astro src/pages/start-here.astro src/pages/en/start-here.astro src/i18n/ui.ts
git commit -m "feat(accession): Start-here page component + routes

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Link the page from Home (banner) and the footer

**Files:**
- Modify: `src/components/Home.astro` (banner above the chapter list + styles)
- Modify: `src/layouts/Base.astro` (footer link)
- Modify: `src/i18n/ui.ts` (`nav.startHere`, `home.startHere.title`, `home.startHere.lead`)

**Interfaces:**
- Consumes: the `/start-here` route (Task 3); `getRelativeLocaleUrl`, `t`.

- [ ] **Step 1: Add the i18n keys**

In `src/i18n/ui.ts` `is` block:

```ts
    'nav.startHere': 'Byrjaðu hér',
    'home.startHere.title': 'Nýtt hér? Byrjaðu á þessu.',
    'home.startHere.lead': 'Hvað er eiginlega í pakkanum sem kosið er um? Hvar Ísland stendur, áður en þú lest kaflana.',
```

In the `en` block:

```ts
    'nav.startHere': 'Start here',
    'home.startHere.title': 'New here? Start with this.',
    'home.startHere.lead': "What's actually in the package being voted on? Where Iceland stands, before you read the chapters.",
```

- [ ] **Step 2: Add the Home banner**

In `src/components/Home.astro`, insert this block between the `</section>` that closes `.hero` and the `<h2 class="section-label">` line:

```astro
  <a class="start-here" href={getRelativeLocaleUrl(lang, 'start-here')}>
    <span class="sh-eyebrow">{t(lang, 'nav.startHere')} →</span>
    <span class="sh-title">{t(lang, 'home.startHere.title')}</span>
    <span class="sh-lead">{t(lang, 'home.startHere.lead')}</span>
  </a>
```

Then add these rules to the `<style>` block in `Home.astro`:

```css
  .start-here {
    display: block; text-decoration: none; color: inherit;
    border: 1px solid var(--line-strong); border-left: 4px solid var(--brass);
    background: var(--paper-raised); border-radius: 4px;
    padding: 1.25rem clamp(1rem, 3vw, 1.6rem); margin: 0 0 2.5rem;
    transition: border-color 0.15s;
  }
  .start-here:hover { border-color: var(--slate); }
  .sh-eyebrow {
    display: block; font-family: var(--mono); font-size: 0.72rem; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--brass); margin-bottom: 0.4rem;
  }
  .sh-title { display: block; font-family: var(--display); font-weight: 600; font-size: 1.2rem; margin-bottom: 0.3rem; }
  .sh-lead { display: block; color: #34322d; font-size: 1rem; }
```

(Confirm `getRelativeLocaleUrl` and `t` are already imported in `Home.astro` — they are, since the chapter list uses both.)

- [ ] **Step 3: Add the footer link**

In `src/layouts/Base.astro`, in the `.footer-links` nav, add the Start-here link **before** the Methodology link:

```astro
        <a class="method" href={getRelativeLocaleUrl(lang, 'start-here')}>{t(lang, 'nav.startHere')}</a>
        <a class="method" href={getRelativeLocaleUrl(lang, 'methodology')}>{t(lang, 'nav.methodology')}</a>
```

(Reuse the existing `.method` class — no new CSS needed.)

- [ ] **Step 4: Build and verify the links**

Run: `npm run build`
Expected: PASS (16 pages). Then:

```bash
grep -q 'class="start-here"' dist/index.html && echo "OK: is Home banner"
grep -q 'class="start-here"' dist/en/index.html && echo "OK: en Home banner"
grep -c 'start-here' dist/index.html
```
Expected: both banner lines; and the count ≥ 2 (banner link + footer link on the is Home page).

- [ ] **Step 5: Commit**

```bash
git add src/components/Home.astro src/layouts/Base.astro src/i18n/ui.ts
git commit -m "feat(accession): link Start-here from Home banner + footer

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Full verification + memory update

**Files:**
- Modify: project memory (`review-status.md`, `project-overview.md`) — controller does this; see steps.

- [ ] **Step 1: Full build + test**

Run: `npm run build && npm test`
Expected: build green at **16 pages**; Vitest **15/15** (no logic touched).

- [ ] **Step 2: Visual gate (Playwright)**

Navigate the preview build to `/start-here/`, `/en/start-here/`, and `/` (Home) and confirm: hero + eyebrow; the bottom-line box; "what opening talks means"; the ⅔ section showing only the three verified beats (NO 11-chapter list, NO restart-procedure text); the fixed/negotiable split; the precedents list with permanence tags + source chips; the decisive box; the "Read the chapters →" link; and the Home "Start here" banner above the `01–05` list. Also confirm a dossier chapter's chips still render (the SourceChips refactor). (Fonts won't load in the sandbox tool — verify content/layout.)

- [ ] **Step 3: Update memory**

Update `review-status.md` (the new Start-here page + banner/footer strings are AI-draft → Nína) and `project-overview.md` (Start-here page built; sub-project 2 done). Controller task.

- [ ] **Step 4: Commit any memory/docs that live in-repo** (none expected — memory is external). If the working tree is clean, skip.

---

## Notes for the executor

- **Task order matters:** Task 1 (SourceChips) before Task 3 (Accession uses it); Task 2 (data) before Task 3 (component imports it).
- **Section 4 constraint is a hard requirement** — the data file already encodes only the three verified beats; do not add the excluded specifics anywhere.
- The `.prec :global(.srcs)` rule in `Accession.astro` reaches into the child `SourceChips` wrapper to position it in the grid — this is intentional (scoped-style + child component).
- Icelandic prose is AI-draft; structural correctness + accurate sources are what matter. Do not agonize over wording.
- This is **sub-project 2 of 2**; nothing here touches chapter content or the calculator.
