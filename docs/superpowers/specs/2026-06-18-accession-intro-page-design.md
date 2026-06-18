# Design — The accession "Start here" intro page

**Date:** 2026-06-18
**Status:** Approved in brainstorming; pending spec review.
**Type:** New standalone page (data + render-only component + routes) + small shared-component extraction + Home/footer links.

## Context & goal

The site's chapters answer "what changes if Iceland joins the EU?" But a concerned reader's *first* question is the one driving the 29 Aug 2026 referendum: *"eigum við ekki bara að kíkja í pakkann?"* ("shouldn't we just peek in the package?"). This page is the answer — a **standalone "Start here" framing page** that establishes where Iceland actually stands before the reader walks through the sector chapters. It is **not** a numbered chapter; it's modeled on the Methodology page (a non-collection page with its own route), but unlike Methodology it makes **sourced factual claims**, so it carries source chips.

Source of truth for all content: the verified `docs/research/accession-process.md` dossier.

This is **sub-project 2 of 2** (sub-project 1, the verðtrygging→home-loans merge, is complete and live). It is self-contained.

## Decisions (locked in brainstorming)

1. **Standalone framing page, not a numbered chapter.** Modeled on the Methodology pattern (data file + render-only component + two route wrappers).
2. **Title:** "Hvað er í pakkanum? / What's in the package?" (echoes "kíkja í pakkann"). Eyebrow: "Byrjaðu hér / Start here".
3. **Slug:** `/start-here` (is) and `/en/start-here` (en) — same slug both locales, like `/methodology`.
4. **Approach A, ruthlessly skimmable.** Comprehensive but glance-and-jump: a TL;DR box up top, bold scannable section headers, a precedents *table*. **No length disclaimer** (defensive, undercuts confidence). A positive **role-signal line** instead ("this is the lay of the land; each chapter goes deep — shorter, read in any order").
5. **No reading-time chip** (parked as a possible future *site-wide* feature, not a one-off here).
6. **Sourced.** Every factual claim carries source chips (tier badge + publisher), reusing the dossier's chip vocabulary via a shared component.
7. **Home entry point:** a full-width **"Start here" banner above the chapter list**. Plus a **footer link** next to Methodology. No new header-nav item (keeps the header — currently just the language toggle — untouched).

## Architecture (files)

| File | Responsibility |
|---|---|
| `src/data/accession.ts` | All bilingual content + sources for the page (data only, no markup). |
| `src/components/Accession.astro` | Render-only component: renders the data into the 8 sections + styles. Takes `{ lang }`. |
| `src/components/SourceChips.astro` | **Extracted shared component** — renders a `Source[]` as tier-badged chips. New consumer (Accession) + refactor the 3 existing chip blocks in `Dossier.astro` to use it (DRY). Takes `{ sources, lang }`. |
| `src/pages/start-here.astro` | Icelandic route wrapper (`Base lang="is"` + `Accession lang="is"`). |
| `src/pages/en/start-here.astro` | English route wrapper. |
| `src/components/Home.astro` | Add the "Start here" banner above the chapter list. |
| `src/layouts/Base.astro` | Add the footer link next to Methodology. |
| `src/i18n/ui.ts` | New keys (banner, footer/nav label, page `<title>`). |

## Data model (`src/data/accession.ts`)

Reuses the methodology-style `Loc`, plus a `Source` shape mirroring the dossier schema's source (so `SourceChips` + `tierLabel` work unchanged):

```ts
export interface Loc { is: string; en: string }
export interface Source { title: string; url: string; publisher?: string; tier: 'primary' | 'academic' | 'advocacy' | 'press' }
export interface SourcedPoint { text: Loc; sources: Source[] }          // a claim with chips
export interface Precedent {
  deal: Loc;                                                            // e.g. "Malta — second homes"
  instrument: Loc;                                                      // e.g. "Protocol No 6, 2003 Act of Accession"
  permanence: 'permanent' | 'temporary' | 'none';                      // drives the ✅/⏳/⚪ tag
  sources: Source[];
}

export const header: { eyebrow: Loc; title: Loc; lead: Loc };          // lead carries the role-signal line
export const bottomLine: Loc[];                                        // the TL;DR box (1–2 short paragraphs)
export interface Section { heading: Loc; body: Loc[]; points?: SourcedPoint[] }
export const sections: Section[];                                      // the prose sections (3, 4) — body paragraphs + optional sourced points
export const fixed: SourcedPoint[];                                    // section 5, left column
export const negotiable: SourcedPoint[];                               // section 5, right column
export const precedents: Precedent[];                                  // section 6 table (rendered grouped/tagged by permanence)
export const decisive: SourcedPoint;                                   // section 7 highlight
export const close: { body: Loc[] };                                   // section 8 handoff prose; component appends a single "Read the chapters →" link to Home via getRelativeLocaleUrl(lang, '')
```

The component decides layout; the data stays markup-free. `tierLabel` (`src/i18n/tiers.ts`) is reused for chip badges. Permanence tag labels (`Varanlegt`/`Permanent`, `Tímabundið`/`Temporary (expired)`, `Ekki samningsatriði`/`Not a negotiated term`) live as small UI strings (in `ui.ts` or inline in the component).

## Page structure & content (each section, with the sourced claims it carries)

All prose drawn/condensed from `docs/research/accession-process.md`; **Icelandic is AI-draft → Nína review**. Claims marked *(src: …)* must carry chips.

1. **Hero** — eyebrow "Byrjaðu hér / Start here"; title; lead = role-signal line.
2. **Bottom-line box** (highlighted) — the 15-second answer: Iceland is already ~⅔ in via the EEA; the referendum only *opens talks*; the rulebook (acquis) is adopt-in-full, not a pick-and-choose; permanent carve-outs are real but rare/narrow; and you can walk away. *(No chips in the box itself — it's a summary; the claims are sourced in the sections below.)*
3. **"What opening talks actually means"** — opening negotiations does not commit you to join; it's reversible. Iceland opened June 2011, halted May 2013, application suspended (not formally withdrawn). *(src: Iceland MFA Summary Conclusions; EPRS PE 782.591)*
4. **"Haven't we already locked in two-thirds?"** (the myth-buster) — the ⅔ is *implemented EEA law* that makes accession **faster**, not banked/settled terms; **"nothing is agreed until everything is agreed"** — provisional chapter closures carry no legal standing and can reopen; nothing binds until the full Accession Treaty is signed + ratified; the 11 chapters Iceland provisionally closed were the *easy, EEA-covered* ones, and the hard third (fisheries, agriculture, capital, establishment) was never opened. *(src: MFA Summary Conclusions; EEAS "nothing is agreed until everything is agreed"; EPRS PE 782.591)* **⚠️ This section rests partly on the single-pass ⅔ research — keep the wording to the high-confidence core (alignment≠locked; provisional=non-binding; hard third never opened). Do NOT print the specific 11-chapter list as definitive (it's lower-confidence).**
5. **"What's fixed vs what you can bargain for"** — two columns.
   - *Fixed:* you adopt the entire acquis (35 chapters); you negotiate *how & when*, not *whether*. *(src: EC enlargement — chapters of the acquis; steps-towards-joining)*
   - *Negotiable:* transition periods (temporary); rare permanent derogations/protocols requiring unanimity of all members + EP consent + ratification. *(src: Turkey 2005 Negotiating Framework; 2003 Act of Accession)*
6. **"What other countries actually got"** — the precedents table, grouped by permanence:
   - ✅ Permanent: Malta second-homes (Protocol No 6); Åland (Protocol No 2); Swedish snus (Art. 151 / Dir. 2014/40 Art. 17); Finland/Sweden northern aid (Art. 142). *(src: each row's EUR-Lex/legislation.gov.uk instrument)*
   - ⏳ Temporary/expired: Poland farmland (12-yr, to 2016); 2+3+2 labour transition (to 2011). *(src: 2003 Act of Accession)*
   - ⚪ Not a negotiated accession term: UK budget rebate (1984 Fontainebleau / 1985 Own Resources Decision). *(src: EPRS UK-rebate briefing)*
7. **The decisive line** (highlighted) — no acceding state has ever won a *permanent* derogation from the Common Fisheries or Agricultural Policy; Norway (1994) is the closest, and walked away. Ties forward to the Fisheries chapter. *(src: EP Fact Sheet 114; Norway–EU relations)*
8. **Handoff** — "opening talks is low-cost and reversible; what you can't do is cherry-pick the rulebook." Renders `close.body` prose + a single **"Read the chapters →"** link back to Home (`getRelativeLocaleUrl(lang, '')`). No duplicated chapter list.

## SourceChips extraction (DRY)

`Dossier.astro` currently inlines the same chip markup + scoped CSS in **three** places (gains, losses, uncertain). Rather than add a fourth copy in `Accession.astro`, extract `src/components/SourceChips.astro`:

```astro
---
import { tierLabel } from '../i18n/tiers';
import type { Lang } from '../i18n/ui';
interface Source { title: string; url: string; publisher?: string; tier: string }
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
<style>/* the .srcs/.chip/.tier rules moved verbatim from Dossier.astro */</style>
```

Then replace the 3 inline blocks in `Dossier.astro` with `<SourceChips sources={p.sources} lang={lang} />` and delete the now-unused `.srcs/.chip/.tier` rules from its `<style>`. Verified by build + a visual check that the dossier chips still render identically. *(This is a deliberate, low-risk DRY refactor of code we're extending — not unrelated churn.)*

## Linking

- **Home banner** (`Home.astro`): insert between the `.hero` section and the `<h2 class="section-label">` chapters heading. A full-width `<a>` to `getRelativeLocaleUrl(lang, 'start-here')` with a title + one-line lead (`home.startHere.title` / `home.startHere.lead`). Styled as a distinct call-to-action (brass/spine accent), visually above the numbered list so it reads as the entry point, not chapter 00.
- **Footer** (`Base.astro`): add `<a href={getRelativeLocaleUrl(lang, 'start-here')}>{t(lang,'nav.startHere')}</a>` in `.footer-links`, before the Methodology link.

## i18n keys (both `is` + `en`)

- `nav.startHere` — footer/label, e.g. "Byrjaðu hér" / "Start here".
- `home.startHere.title` — banner title, e.g. "Nýtt hér? Byrjaðu á þessu." / "New here? Start with this."
- `home.startHere.lead` — banner one-liner pointing at the package question.
- `accession.navTitle` — the `<title>` / Base title for the page (e.g. "Hvað er í pakkanum?").
- Permanence tag labels (3) if not kept inline in the component.

All page *content* lives in `accession.ts` as `Loc` (build fails if either language is missing).

## Responsive

The precedents table must stack or scroll gracefully on narrow screens (follow the dossier's `@media (max-width: 40rem)` stacking approach). The fixed/negotiable two-column collapses to stacked single-column on mobile.

## Out of scope

- Any change to the chapter dossiers' content or the calculator.
- A header-nav item (banner + footer are the entry points).
- The site-wide reading-time idea (parked).
- Re-verifying the single-pass ⅔ research to multi-vote confidence (the page uses only its high-confidence core).

## Verification

- `npm run build` green; **page count +2** (`/start-here/` + `/en/start-here/`).
- `npm test` still green (15/15; no logic touched).
- Both routes render: hero, bottom-line box, all sections, the precedents table with source chips, the decisive box; chips link out (tier badge + publisher).
- `Dossier.astro` chips still render identically after the `SourceChips` refactor (visual check one chapter, both locales).
- Home shows the "Start here" banner above the `01–05` chapter list; footer shows the Start-here link in both locales.
- Playwright visual pass on `/start-here/` and `/en/start-here/` (+ Home). (Google Fonts don't load in the sandbox screenshot tool — verify layout/content, not font rendering.)

## Notes

- **Icelandic copy is AI-draft** → flag the new page (and banner/footer strings) for **Nína's** review; update `review-status` memory.
- The **⅔ myth-buster (section 4)** rests partly on a single-pass research agent (not the multi-vote harness). Its high-confidence core is safe to publish; avoid the lower-confidence specifics (the exact 11-chapter list, precise restart procedure). The dossier records the confidence split.
- Push/deploy is **user-gated** (same as always), though the prior merge established that live-with-AI-draft-disclosed is acceptable to Gísli.
