# Methodology page — Design Spec

**Date:** 2026-06-17
**Status:** Approved (design); ready for implementation planning
**Page:** `/methodology` (is) + `/en/methodology` (en) — the site's first non-chapter content page
**Related:** original design `docs/specs/2026-06-16-eu-yes-or-no-design.md` (names Methodology + Sources index as non-negotiable trust pages)

> **No chapter-specific references** (Gísli): the methodology page describes the site's *general* method only. It must not name, cite, or allude to any individual chapter — not in the page copy and not in this design doc. Principles (e.g. "we don't pad to fake balance") are stated as universal rules, never tied to a specific topic.

## Purpose

Give a skeptical layperson a single page that answers "why should I trust this site?" — by describing, plainly, the trust mechanisms the site actually uses (schema-enforced sourcing, source tiers, the 2010–13 accession backbone, the adversarial research process, the honesty rules). It is the credibility anchor the whole "neutral, sourced, call-bullshit-later" project rests on.

## GUIDING PRINCIPLES (non-negotiable)

1. **Describe only what we actually do — no overselling.** The page must not claim a mechanism the site doesn't have. Specifically: do NOT claim a Sources index exists (it doesn't yet); state honestly that the Icelandic copy is currently AI-drafted and under native review; don't overstate verification beyond "checked against primary sources / cross-examined." If the page describes a practice, that practice must be real and visible elsewhere on the site.
2. **The page obeys the site's own rules.** Bilingual `is` + `en` for every line. Where it states an external fact (e.g. "Iceland applied in 2009 and withdrew in 2015"), it may link a primary source, but most of the page describes *our method*, which needs no external citation.
3. **Thorough but scannable** (chosen): all six sections, each a short heading + 1–2 tight paragraphs. Complete enough that a skeptic finds every answer, scannable via clear headers. Not a one-screen charter; not an exhaustive deep-dive.

## Design

### Routing & rendering (mirrors the existing `index` pattern)
- `src/pages/methodology.astro` → `/methodology` (default locale, Icelandic). Thin wrapper: `<Base lang="is" title={…}><Methodology lang="is" /></Base>`.
- `src/pages/en/methodology.astro` → `/en/methodology`. Same, `lang="en"`.
- `src/components/Methodology.astro` — renders the page from the content data; props `{ lang: Lang }`. Clean single-column reading layout (max-width ~44rem), reusing the existing display/mono heading styles and CSS variables from `Base.astro` (`--display`, `--mono`, `--ink`, `--muted`, `--line`, `--brass`). Zero JS.
- Page `<title>` (via `Base`'s `title` prop) = the localized "Methodology" label.

### Content data (`src/data/methodology.ts`)
A typed, bilingual structure (matches the `src/data/*.ts` convention). All page copy lives here so the component stays render-only:

```ts
interface Loc { is: string; en: string }
interface Section { heading: Loc; body: Loc[] }          // body = one entry per paragraph
export const header: { title: Loc; lead: Loc }            // H1 + one-line intro
export const sections: Section[]                          // the six sections below
```

Optional sourced links inside a section (e.g. the 2010–13 accession docs) may be added as a small `links?: {label: Loc; url: string}[]` on a section — only if it points to a real primary source. (Keep this minimal; the page is about method, not a source dump.)

### The six sections (content briefs — English; Icelandic drafted at build, AI-draft flagged for review)

1. **What this site is (the honest frame).** Iceland is already about two-thirds "in" through the EEA and Schengen. So the real question is not "EU or nothing" — it's "as an EEA member vs. a full EU member, what actually changes?" Every chapter is built on that contrast: *Today* (already true under the EEA) vs. *As a member*.

2. **Neutrality is enforced, not promised.** We don't ask you to trust our good intentions. The site is built so that every factual claim must carry at least one source — a claim with no source makes the site fail to build. The same rule requires both Icelandic and English for every line. If we broke neutrality, the site wouldn't compile. 🔒

3. **How we rank sources.** Each source carries a tier: **primary** (laws, treaties, court rulings, statistics offices, the official accession documents), **academic** (universities, research institutes), **press** (news media), and **advocacy** (pro- and anti-EU campaigners). Advocacy sources are used only to represent each side's strongest argument fairly — never as proof of a fact. Facts rest on primary sources.

4. **The real negotiation (2010–13).** Iceland actually applied for EU membership in 2009, negotiated 2010–13, and withdrew the application in 2015. That left primary documentation of exactly what was on the table, chapter by chapter — the neutrality backbone. Where we can, we cite what was really negotiated rather than speculation. *(May link the government's accession summary as a primary source.)*

5. **How each chapter is researched.** For each topic we deliberately seek the strongest argument *for* and the strongest *against*, then check each against primary sources. Claims are cross-examined by multiple independent checks; those that fail are **removed**, not softened. A claim that survives only in advocacy sources is flagged *uncertain* rather than stated as fact. (We use automated deep-research tooling to fan out and fact-check, but every published claim still ties back to a citable source.)

6. **Our honesty rules.**
   - **We don't pad the weaker side to fake balance.** Some topics genuinely have a stronger case one way; we show what the sources support and let the imbalance stand. *Count the sources, not the bullet points.*
   - **The "uncertain" box.** Every chapter flags honestly what we don't know.
   - **"Last reviewed" dates.** Every chapter is dated — facts go stale.
   - **The Icelandic text is currently AI-drafted** and being reviewed by a native speaker; we flag this honestly until it's done.
   - **It's all open.** Every source links out, and the whole site — including its edit history — is public on GitHub. If we got something wrong, you can see it and call it out.

### Navigation (`src/layouts/Base.astro`)
Add a **Methodology** link to the footer (present on every page), beside the existing "Spotted an error?" callout. The footer is already `display:flex; flex-wrap:wrap`; add the link so the two trust links group on the right (neutral blurb left, links right). New link uses the existing `.callout`-style treatment (mono, slate) or a sibling class; it routes via `getRelativeLocaleUrl(lang, 'methodology')` so it is base- and locale-aware. No header change (header stays minimal: brand + language toggle). No home-page callout this round.

### i18n (`src/i18n/ui.ts`)
Add one key to both `is`/`en`: `nav.methodology` (is: "Aðferðafræði", en: "Methodology") — used for the footer link label and the page `<title>`. All section/heading/body copy lives in `src/data/methodology.ts`, not in `ui.ts`.

## Files touched
- Create: `src/data/methodology.ts` — bilingual header + six sections (content above).
- Create: `src/components/Methodology.astro` — render-only reading layout.
- Create: `src/pages/methodology.astro` — `/methodology` (is) wrapper.
- Create: `src/pages/en/methodology.astro` — `/en/methodology` wrapper.
- Modify: `src/layouts/Base.astro` — footer Methodology link (locale-aware).
- Modify: `src/i18n/ui.ts` — add `nav.methodology` (is/en).

## Verification
- `npm run build` green; page count rises by 2 (16 pages: was 14 + `/methodology` + `/en/methodology`).
- `npx astro check` → 0 errors.
- Playwright IS + EN: all six sections render with headings + body; the footer Methodology link appears on a chapter page AND the home page and resolves to the correct localized URL; reading layout is legible; mobile (375px) reflows cleanly.
- Manual honesty check: the page makes **no** claim of a Sources index; the AI-draft-Icelandic caveat is present; nothing overstates verification.

## Out of scope
- The **Sources index** page (separate, larger spec — needs a mechanism to aggregate sources across all dossiers).
- Header nav changes; home-page callout.
- Any new schema or content-collection machinery (the page is a plain component + data file).

## Assumptions stated openly
- Page copy (both languages) is editorial; the **Icelandic is AI-draft** and must be flagged for Nína/Gísli native review before it's considered final — same as the chapters.
- The page describes current practice as of 2026-06-17; if practice changes (e.g. the Sources index ships, or Icelandic review completes), the relevant lines must be updated.
- Slug is `methodology` for both locales (the Icelandic page lives at `/methodology`, mirroring how `/` serves the Icelandic home) — consistent with the existing routing.
