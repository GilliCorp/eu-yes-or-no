# Methodology Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual `/methodology` trust page describing the site's real method (schema-enforced sourcing, source tiers, the 2009–15 accession backbone, the adversarial research process, the honesty rules), linked from the footer on every page.

**Architecture:** Page copy lives in a typed bilingual data file (`src/data/methodology.ts`); a render-only zero-JS component (`Methodology.astro`) renders it; two thin route wrappers (`/methodology`, `/en/methodology`) mirror the existing `index` → `Home` pattern; a footer link in the shared `Base.astro` layout makes it reachable everywhere.

**Tech Stack:** Astro 6 (zero-JS static), TypeScript, bilingual i18n via `src/i18n/ui.ts`. Build = `npm run build`; typecheck = `npx astro check`.

## Global Constraints

Every task implicitly includes these (verbatim from the spec):

- **Describe only what we actually do — no overselling.** Do NOT claim a Sources index exists. State honestly that the Icelandic copy is currently AI-drafted and under native review. Don't overstate verification beyond "checked against primary sources / cross-examined."
- **NO chapter-specific references.** The page (and the code/comments) must not name, cite, or allude to any individual chapter. Principles are stated as universal rules. Generic phrasing like "each chapter" (referring to the site's structure) is fine; naming a specific topic is not.
- **Bilingual `is` + `en` on every line** of user-facing text.
- **Zero-JS static.** No client scripts/islands. Reuse the existing CSS variables and type styles from `Base.astro` (`--display`, `--mono`, `--ink`, `--muted`, `--line`, `--slate`, `--slate-soft`, `--brass`).
- **Footer link is locale-aware** via `getRelativeLocaleUrl(lang, 'methodology')`.
- **Slug is `methodology` for both locales** (Icelandic at `/methodology`, English at `/en/methodology`) — mirrors the existing `index` routing.
- **Icelandic copy is AI-draft**, flagged for native (Nína/Gísli) review — not final.

---

### Task 1: Content data file + i18n label

**Files:**
- Create: `src/data/methodology.ts`
- Modify: `src/i18n/ui.ts` (add `nav.methodology` to both `is` and `en` blocks)

**Interfaces:**
- Produces: `export const header: { title: Loc; lead: Loc }` and `export const sections: Section[]` from `src/data/methodology.ts`, where `interface Loc { is: string; en: string }`, `interface MethodologyLink { label: Loc; url: string }`, `interface Section { heading: Loc; body: Loc[]; links?: MethodologyLink[] }`. Consumed by `Methodology.astro` (Task 2). Also the `nav.methodology` i18n key, consumed by the route wrappers (Task 2) and the footer (Task 3).

- [ ] **Step 1: Create `src/data/methodology.ts`** with this exact content:

```ts
/** Bilingual content for the Methodology page. Prose lives here; the component renders it. */
export interface Loc {
  is: string;
  en: string;
}
export interface MethodologyLink {
  label: Loc;
  url: string;
}
export interface Section {
  heading: Loc;
  body: Loc[];
  links?: MethodologyLink[];
}

export const header: { title: Loc; lead: Loc } = {
  title: { is: 'Aðferðafræði', en: 'Methodology' },
  lead: {
    is: 'Þessi síða biður þig ekki að treysta skoðunum okkar — hún sýnir hvernig hún er byggð. Hér er aðferðin.',
    en: "This site doesn't ask you to trust our opinions — it shows how it's built. Here is the method.",
  },
};

export const sections: Section[] = [
  {
    heading: { is: 'Um hvað þessi síða snýst', en: 'What this site is about' },
    body: [
      {
        is: 'Ísland er nú þegar um tveir þriðju „inni“ í Evrópusambandinu gegnum EES-samninginn og Schengen. Spurningin er því ekki „ESB eða ekkert“ — heldur hvað raunverulega breytist ef við göngum alla leið.',
        en: "Iceland is already about two-thirds 'in' the European Union through the EEA Agreement and Schengen. So the question is not 'EU or nothing' — it's what actually changes if we go all the way.",
      },
      {
        is: 'Þess vegna er hver kafli byggður á samanburði: staðan í dag (það sem er þegar satt undir EES) borin saman við stöðuna sem fullt aðildarríki.',
        en: 'That is why every chapter is built on a comparison: the situation today (what is already true under the EEA) set against the situation as a full member.',
      },
    ],
  },
  {
    heading: { is: 'Hlutleysi er þvingað fram, ekki lofað', en: 'Neutrality is enforced, not promised' },
    body: [
      {
        is: 'Við biðjum þig ekki að treysta góðum ásetningi okkar. Síðan er byggð þannig að hver einasta staðreyndafullyrðing verður að vísa í að minnsta kosti eina heimild — fullyrðing án heimildar veldur því að síðan byggist alls ekki upp.',
        en: "We don't ask you to trust our good intentions. The site is built so that every single factual claim must cite at least one source — a claim with no source makes the site fail to build.",
      },
      {
        is: 'Sama regla krefst þess að allur texti sé bæði á íslensku og ensku. Ef við brytum hlutleysi myndi síðan einfaldlega ekki þýðast.',
        en: 'The same rule requires every piece of text in both Icelandic and English. If we broke neutrality, the site simply would not compile.',
      },
    ],
  },
  {
    heading: { is: 'Hvernig við flokkum heimildir', en: 'How we rank sources' },
    body: [
      {
        is: 'Hver heimild ber flokk: frumheimild (lög, sáttmálar, dómar, hagstofur og opinber aðildargögn), fræðigrein (háskólar og rannsóknastofnanir), fjölmiðill (fréttamiðlar) og málsvari (talsmenn með og á móti aðild).',
        en: 'Every source carries a tier: primary (laws, treaties, court rulings, statistics offices and official accession documents), academic (universities and research institutes), press (news media), and advocacy (campaigners for and against membership).',
      },
      {
        is: 'Málsvaraheimildir eru aðeins notaðar til að setja fram sterkustu rök hvorrar hliðar á sanngjarnan hátt — aldrei sem sönnun fyrir staðreynd. Staðreyndir hvíla á frumheimildum.',
        en: "Advocacy sources are used only to present each side's strongest argument fairly — never as proof of a fact. Facts rest on primary sources.",
      },
    ],
  },
  {
    heading: { is: 'Raunveruleg reynsla: 2009–2015', en: 'The real negotiation: 2009–2015' },
    body: [
      {
        is: 'Ísland sótti formlega um aðild að ESB árið 2009, samdi um aðild á árunum 2010–2013 og dró umsóknina til baka árið 2015. Það skildi eftir sig frumgögn um nákvæmlega það sem var í boði.',
        en: 'Iceland formally applied for EU membership in 2009, negotiated membership in 2010–2013, and withdrew the application in 2015. That left behind primary documents of exactly what was on the table.',
      },
      {
        is: 'Þetta er burðarásinn í hlutleysi okkar: þar sem hægt er vísum við í það sem raunverulega var samið um, frekar en getgátur.',
        en: 'This is the backbone of our neutrality: where we can, we cite what was actually negotiated rather than speculation.',
      },
    ],
    links: [
      {
        label: {
          is: 'Samantekt stjórnvalda um aðildarviðræðurnar',
          en: 'Government summary of the accession negotiations',
        },
        url: 'https://www.government.is/media/utanrikisraduneyti-media/media/esb/Summary-Conclusions.pdf',
      },
    ],
  },
  {
    heading: { is: 'Hvernig hver kafli verður til', en: 'How each chapter is researched' },
    body: [
      {
        is: 'Fyrir hvert efni leitum við vísvitandi að sterkustu rökunum með og á móti, og könnum hvort tveggja gagnvart frumheimildum. Fullyrðingar eru sannreyndar með mörgum óháðum yfirferðum; þær sem standast ekki eru fjarlægðar, ekki mildaðar.',
        en: "For each topic we deliberately seek the strongest arguments for and against, and check both against primary sources. Claims are verified through multiple independent reviews; those that don't hold up are removed, not softened.",
      },
      {
        is: 'Fullyrðing sem lifir aðeins í málsvaraheimildum er merkt sem óvissa frekar en sett fram sem staðreynd. Við notum sjálfvirk rannsóknartól til að safna og sannreyna heimildir, en hver birt fullyrðing er á endanum bundin við heimild sem hægt er að vísa í.',
        en: 'A claim that survives only in advocacy sources is flagged as uncertain rather than stated as fact. We use automated research tooling to gather and fact-check sources, but every published claim ultimately ties back to a citable source.',
      },
    ],
  },
  {
    heading: { is: 'Heiðarleikareglur okkar', en: 'Our honesty rules' },
    body: [
      {
        is: 'Við fyllum ekki veikari hliðina til að falsa jafnvægi. Sum efni hafa einfaldlega sterkari rök í aðra áttina; við sýnum það sem heimildirnar styðja og leyfum ójafnvæginu að standa. Teldu heimildirnar, ekki liðina.',
        en: "We don't pad the weaker side to fake balance. Some topics simply have a stronger case one way; we show what the sources support and let the imbalance stand. Count the sources, not the bullet points.",
      },
      {
        is: 'Óvissureitur: hver kafli merkir heiðarlega það sem við vitum ekki.',
        en: "The uncertain box: every chapter honestly flags what we don't know.",
      },
      {
        is: 'Dagsetningar um síðustu yfirferð: hver kafli er dagsettur — staðreyndir úreldast.',
        en: 'Last-reviewed dates: every chapter is dated — facts go stale.',
      },
      {
        is: 'Íslenski textinn er sem stendur saminn af gervigreind og í yfirlestri hjá íslenskumælandi einstaklingi; við merkjum það heiðarlega þar til því er lokið.',
        en: "The Icelandic text is currently written by AI and under review by a native speaker; we flag this honestly until it's done.",
      },
      {
        is: 'Allt er opið: hver heimild tengir út, og öll síðan — ásamt breytingasögu hennar — er aðgengileg á GitHub. Ef við höfum rangt fyrir okkur geturðu séð það og bent á það.',
        en: "It's all open: every source links out, and the whole site — including its edit history — is public on GitHub. If we're wrong, you can see it and point it out.",
      },
    ],
  },
];
```

- [ ] **Step 2: Add the `nav.methodology` i18n key** — in `src/i18n/ui.ts`, add to the `is` block (e.g. right after `'dossier.back': 'Allir kaflar',`):

```ts
    'nav.methodology': 'Aðferðafræði',
```

and to the `en` block (right after `'dossier.back': 'All chapters',`):

```ts
    'nav.methodology': 'Methodology',
```

- [ ] **Step 3: Typecheck**

Run: `npx astro check`
Expected: `0 errors` (the data file is valid TS; the new i18n key resolves through `t()`). Pre-existing hints unrelated to these files may remain — only new errors matter.

- [ ] **Step 4: Build to confirm nothing breaks**

Run: `npm run build`
Expected: build green, still 14 pages (no route added yet; the data file is not yet imported anywhere).

- [ ] **Step 5: Commit**

```bash
git add src/data/methodology.ts src/i18n/ui.ts
git commit -m "feat(methodology): bilingual content data + nav.methodology label"
```

---

### Task 2: Methodology component + route wrappers

**Files:**
- Create: `src/components/Methodology.astro`
- Create: `src/pages/methodology.astro`
- Create: `src/pages/en/methodology.astro`

**Interfaces:**
- Consumes: `header`, `sections` from `src/data/methodology.ts` (Task 1); `Lang` + `t` from `src/i18n/ui.ts`; `Base.astro` layout.
- Produces: routes `/methodology` (is) and `/en/methodology` (en) rendering the trust page.

- [ ] **Step 1: Create `src/components/Methodology.astro`** with this exact content:

```astro
---
import type { Lang } from '../i18n/ui';
import { header, sections } from '../data/methodology';

interface Props {
  lang: Lang;
}
const { lang } = Astro.props;
---

<article class="methodology">
  <header class="m-hero">
    <h1>{header.title[lang]}</h1>
    <p class="lead">{header.lead[lang]}</p>
  </header>

  {sections.map((s) => (
    <section class="m-section">
      <h2>{s.heading[lang]}</h2>
      {s.body.map((p) => <p>{p[lang]}</p>)}
      {s.links && (
        <ul class="m-links">
          {s.links.map((l) => (
            <li>
              <a href={l.url} target="_blank" rel="noopener">{l.label[lang]}</a>
            </li>
          ))}
        </ul>
      )}
    </section>
  ))}
</article>

<style>
  .methodology { max-width: 44rem; margin: 0 auto; padding: 2.5rem clamp(1rem, 5vw, 2.5rem) 4rem; }
  .m-hero { margin-bottom: 2.5rem; }
  .m-hero h1 { font-size: clamp(2rem, 5.5vw, 3rem); margin: 0 0 1rem; }
  .lead {
    font-family: var(--display); font-weight: 500; font-size: clamp(1.15rem, 2.5vw, 1.45rem);
    line-height: 1.35; color: var(--ink); margin: 0;
  }
  .m-section { margin-bottom: 2.5rem; }
  .m-section h2 { font-size: 1.4rem; margin: 0 0 0.75rem; }
  .m-section p { margin: 0 0 0.9rem; font-size: 1.0625rem; }
  .m-links { list-style: none; padding: 0; margin: 0.4rem 0 0; }
  .m-links a {
    font-family: var(--mono); font-size: 0.8rem; color: var(--slate);
    text-underline-offset: 2px;
  }
</style>
```

- [ ] **Step 2: Create `src/pages/methodology.astro`** (Icelandic route) with this exact content:

```astro
---
import Base from '../layouts/Base.astro';
import Methodology from '../components/Methodology.astro';
import { t } from '../i18n/ui';
---

<Base lang="is" title={t('is', 'nav.methodology')}>
  <Methodology lang="is" />
</Base>
```

- [ ] **Step 3: Create `src/pages/en/methodology.astro`** (English route) with this exact content:

```astro
---
import Base from '../../layouts/Base.astro';
import Methodology from '../../components/Methodology.astro';
import { t } from '../../i18n/ui';
---

<Base lang="en" title={t('en', 'nav.methodology')}>
  <Methodology lang="en" />
</Base>
```

- [ ] **Step 4: Typecheck + build**

Run: `npx astro check && npm run build`
Expected: 0 errors; build green; page count rises to **16** (was 14 + `/methodology` + `/en/methodology`).

- [ ] **Step 5: Confirm both locale pages render their sections**

Run: `grep -o "Neutrality is enforced, not promised" dist/en/methodology/index.html | head -1 && grep -o "Our honesty rules" dist/en/methodology/index.html | head -1`
Expected: both strings print (English headings render).

Run: `grep -o "Hlutleysi er þvingað fram" dist/methodology/index.html | head -1 && grep -o "Heiðarleikareglur okkar" dist/methodology/index.html | head -1`
Expected: both strings print (Icelandic headings render).

- [ ] **Step 6: Honesty check — no forbidden content**

Run: `grep -ci "sources index\|heimildaskrá\|heimildasafn" dist/en/methodology/index.html dist/methodology/index.html`
Expected: `0` for both files (we do NOT claim a Sources index).

Run: `grep -o "written by AI" dist/en/methodology/index.html | head -1 && grep -o "gervigreind" dist/methodology/index.html | head -1`
Expected: both print (the AI-draft caveat is present and honest).

- [ ] **Step 7: Commit**

```bash
git add src/components/Methodology.astro src/pages/methodology.astro src/pages/en/methodology.astro
git commit -m "feat(methodology): render-only component + is/en route wrappers"
```

---

### Task 3: Footer link (global, locale-aware)

**Files:**
- Modify: `src/layouts/Base.astro` (footer markup + footer styles)

**Interfaces:**
- Consumes: `getRelativeLocaleUrl` (already imported in `Base.astro`), `t` + `nav.methodology` key (Task 1).
- Produces: a Methodology link in the footer on every page.

- [ ] **Step 1: Replace the footer markup** — in `src/layouts/Base.astro`, replace this block (currently lines ~47–50):

```astro
    <footer>
      <p class="neutral">{t(lang, 'footer.neutral')}</p>
      <a class="callout" href={REPO_URL}>{t(lang, 'footer.bullshit')} →</a>
    </footer>
```

with:

```astro
    <footer>
      <p class="neutral">{t(lang, 'footer.neutral')}</p>
      <nav class="footer-links">
        <a class="method" href={getRelativeLocaleUrl(lang, 'methodology')}>{t(lang, 'nav.methodology')}</a>
        <a class="callout" href={REPO_URL}>{t(lang, 'footer.bullshit')} →</a>
      </nav>
    </footer>
```

- [ ] **Step 2: Add footer-link styles** — in the `<style is:global>` block of `Base.astro`, immediately after the existing `footer .callout:hover { ... }` rule (currently the last footer rule, ~line 143), add:

```css
      .footer-links { display: flex; flex-wrap: wrap; gap: 1.25rem; align-items: center; }
      .footer-links .method {
        font-family: var(--mono); font-size: 0.8rem; color: var(--slate);
        text-decoration: none; border-bottom: 1px solid var(--slate-soft); padding-bottom: 2px;
        white-space: nowrap;
      }
      .footer-links .method:hover { color: var(--ink); border-color: var(--slate); }
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build green, 16 pages.

- [ ] **Step 4: Confirm the link is present and locale-aware on multiple pages**

Run: `grep -o 'href="/eu-yes-or-no/methodology"' dist/index.html | head -1`
Expected: prints `href="/eu-yes-or-no/methodology"` (Icelandic home footer → Icelandic methodology).

Run: `grep -o 'href="/eu-yes-or-no/en/methodology"' dist/en/index.html | head -1`
Expected: prints `href="/eu-yes-or-no/en/methodology"` (English home footer → English methodology).

Run: `grep -o 'href="/eu-yes-or-no/methodology"' dist/fisheries/index.html | head -1`
Expected: prints the Icelandic methodology href (link is on chapter pages too, via the shared layout).

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat(methodology): locale-aware footer link on every page"
```

---

### Task 4: Visual verification

**Files:** none (verification only).

- [ ] **Step 1: Serve the production build**

Run: `npm run preview`
Expected: preview URL; pages under `/eu-yes-or-no/` (e.g. `http://localhost:4321/eu-yes-or-no/methodology` and `/eu-yes-or-no/en/methodology`).

- [ ] **Step 2: Screenshot the Icelandic page** (`/eu-yes-or-no/methodology`, full page). Confirm:
  - H1 "Aðferðafræði" + lead, then all six section headings render with their paragraphs.
  - Section 4 shows the "Samantekt stjórnvalda…" external link.
  - Reading layout is legible (single column, comfortable measure).

- [ ] **Step 3: Screenshot the English page** (`/eu-yes-or-no/en/methodology`, full page). Confirm the English copy renders for all six sections, the "Government summary…" link is present, and the AI-draft honesty line reads naturally.

- [ ] **Step 4: Confirm the footer link** — on the home page and a chapter page, both locales, the "Aðferðafræði" / "Methodology" footer link appears and navigates to the correct localized page.

- [ ] **Step 5: Mobile reflow** — resize to 375px on the Icelandic methodology page; confirm headings/paragraphs and the footer reflow cleanly, no overflow.

- [ ] **Step 6: Final honesty read** — confirm on the rendered page: no individual chapter is named anywhere; no Sources index is claimed; the AI-draft caveat is present.

> **Going live:** publishes on `git push` (auto-deploy). The Icelandic copy is AI-draft — flag it for Nína/Gísli native review. Push is a separate, user-confirmed step.

---

## Self-Review

**1. Spec coverage:**
- All six sections with the specified content → Task 1 (`methodology.ts`). ✅
- Render-only component, reading layout, reuse of existing styles → Task 2. ✅
- Two routes `/methodology` + `/en/methodology` mirroring `index` → Task 2. ✅
- Footer link, locale-aware, every page, no header change → Task 3. ✅
- `nav.methodology` i18n key → Task 1. ✅
- "Describe only what we do": no Sources-index claim (Task 2 Step 6 greps =0), AI-draft caveat present (Task 2 Step 6 + Task 4 Step 6). ✅
- No chapter-specific references: content uses only generic "each chapter"; Task 4 Step 6 confirms. ✅
- Bilingual everywhere: every `Loc` has is+en; build enforces nothing here (plain data) but Task 2/4 greps both locales. ✅
- Zero-JS, slug `methodology` both locales → Tasks 2. ✅

**2. Placeholder scan:** No TBD/TODO/"handle appropriately"/"similar to" — all code, content, and commands are literal. ✅

**3. Type consistency:** `Loc`/`Section`/`MethodologyLink` defined in Task 1 match the `header`/`sections` shapes consumed in `Methodology.astro` (Task 2). `nav.methodology` key added in Task 1 matches `t(lang,'nav.methodology')` calls in the routes (Task 2) and footer (Task 3). `getRelativeLocaleUrl(lang, 'methodology')` matches the `methodology` slug of the route files. ✅
