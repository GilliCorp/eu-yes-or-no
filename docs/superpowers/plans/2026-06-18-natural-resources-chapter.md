# Natural Resources Chapter — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Natural resources / Auðlindir chapter (`natural-resources.yaml`) as a standard dossier from the verified research, and renumber so the Home list stays contiguous. This is the final chapter of the planned 8-topic arc.

**Architecture:** A single new content-collection YAML rendered by the existing `Dossier.astro`; plus a one-line `order` change on `security-energy.yaml`. No component/schema change. No `stakes`/`calculator`/`basket`.

**Tech Stack:** Astro 6 content collections (Zod schema), bilingual `loc` objects, existing `Dossier.astro`. Vitest suite untouched.

## Global Constraints

- **Bilingual or build-fails:** every text field `{is, en}`, both non-empty.
- **Sources on every ledger point (`.min(1)`):** each `gains`/`losses`/`uncertain` claim carries ≥1 `source` with a valid URL + tier. Narrative fields (`tldr`/`summary`/`today`/`asMember`) are unsourced prose (as in sibling chapters) and may name laws/cases inline without chips.
- **Source tiers:** EC/EUR-Lex/EP/government.is/island.is/US State Dept/Venice Commission = `primary`; ScienceDirect study = `academic`; Iceland Review / RÚV = `press`.
- **Use ONLY the exact URLs in this plan** (from the verified dossier's SOURCES section). Do NOT invent or alter URLs.
- **Title:** "Auðlindir / Natural resources".
- **`order: 7`** for natural-resources; **`security-energy.yaml` 7 → 8** (Home shows the order as a visible `0N` number → must stay gap-free).
- **Honest "little changes" framing; no forced balance** (ledger ~3 gains / 2 losses / 2 uncertain — that's the verified truth).
- **Caveats:** (a) do NOT say the EEA "overrides" land rules — favourable EEA treatment is *conditional* on exercising a treaty freedom; (b) the 2020 land cap is **nationality-neutral / size-based** (distinct from the separate non-EEA permit regime); (c) the *auðlindaákvæði* is a **2020 draft, never enacted** — phrase as proposed/draft; (d) veiðigjald figures are **2014**; (e) Ratcliffe = catalyst, not sole cause (law names no one).
- **YAML curly-quote gotcha:** in any *double-quoted* YAML scalar (`is:`/`en:`/`tldr`) that contains an inner „…" curly pair, the closing quote must be `"` (U+201D), NOT ASCII `"` — else the scalar terminates early and the build fails. (Folded `>-` block scalars are unaffected.)
- Node ≥ 22.12. Verification = `npm run build` green + `npm test` (15/15) + visual check.
- Conventional commits ending with `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

### Task 1: Create `src/content/dossiers/natural-resources.yaml`

**Files:**
- Create: `src/content/dossiers/natural-resources.yaml`

**Interfaces:**
- Produces a dossier entry at `order: 7`, routes `/natural-resources` + `/en/natural-resources`, listed on Home.

- [ ] **Step 1: Create the file**

Create `src/content/dossiers/natural-resources.yaml` with exactly this content (Icelandic is AI-draft; match the 2-space indent + `>-` folded style; keep curly quotes „ … " and Icelandic characters intact; use U+201D for inner closing curly quotes inside double-quoted scalars):

```yaml
order: 7

title:
  is: "Auðlindir"
  en: "Natural resources"

tldr:
  is: "Óttinn um að „útlendingar kaupi upp landið" beinist að mestu að röngum stað: EES opnaði þetta þegar 1994. Full aðild breytir litlu um eignarhald — Ísland heldur helstu stjórntækjunum. Eina raunverulega undantekningin er eignarhald í sjávarútvegi."
  en: "The fear that 'foreigners will buy up the country' is largely aimed at the wrong target: the EEA already opened this in 1994. Full membership changes little about ownership — Iceland keeps the main levers. The one real exception is ownership in fisheries."

summary:
  is: >-
    Frjálst flæði fjármagns og staðfesturéttur eru kjarnafrelsi EES sem Ísland býr þegar
    við — EES/EFTA-borgarar geta nú þegar keypt íslenskt land, orkuréttindi og laxveiðiár
    á svipuðum grunni og Íslendingar. Full aðild bætir litlu þar ofan á. Opinbert
    eignarhald er öruggt: 345. gr. sáttmálans um starfshætti ESB (sem speglast í 125. gr.
    EES og bindur Ísland nú þegar) gerir ESB hlutlaust um opinbert eða einkaeignarhald —
    Landsvirkjun mætti vera áfram í eigu ríkisins. Auðlindarentan er áfram á forræði
    Íslands: skattlagning er innlent mál (krefst einróma samþykkis á ESB-stigi, svo Ísland
    hefði neitunarvald). Stærsta breytingin sem fólk óttast varð því þegar með EES 1994,
    ekki við aðild. Eini óleysti hnúturinn er eignarhald í sjávarútvegi, sem var aldrei
    samið um.
  en: >-
    Free movement of capital and the right of establishment are core EEA freedoms Iceland
    already lives under — EEA/EFTA nationals can already buy Icelandic land, energy rights
    and salmon rivers on much the same footing as Icelanders. Full membership adds little
    on top. Public ownership is safe: Article 345 TFEU (mirrored by Art. 125 EEA, which
    already binds Iceland) makes the EU neutral on public vs private ownership —
    Landsvirkjun could stay state-owned. The resource rent stays Iceland's to set: taxation
    is a national matter (it needs unanimity at EU level, so Iceland would hold a veto). So
    the biggest change people fear already happened with the EEA in 1994, not at
    membership. The one unresolved knot is ownership in fisheries, which was never
    negotiated.

today:
  is: >-
    EES-reglurnar stýra þessu nú þegar. EES/EFTA-borgarar geta keypt fasteignir á Íslandi
    án sérstaks leyfis ráðherra þegar þeir nýta fjórfrelsið (þeir leggja fram yfirlýsingu
    skv. reglugerð nr. 702/2002), og orkunýtingarréttindi (vatnsafl, jarðvarmi) standa
    EES-búum opin til jafns við Íslendinga. Reglurnar um frjálst fjármagnsflæði og bann
    við mismunun eru þær sömu undir EES og ESB. Borgarar utan EES (t.d. Bretar eftir
    Brexit) þurfa hins vegar áfram leyfi — það er línan sem skiptir máli (EES á móti utan-EES),
    og aðild færir hana ekki.
  en: >-
    EEA rules already govern this. EEA/EFTA nationals can buy real property in Iceland
    without a special ministerial permit when exercising the four freedoms (they file a
    declaration under Regulation No. 702/2002), and energy-utilisation rights (hydropower,
    geothermal) are open to EEA residents on the same footing as Icelanders. The rules on
    free movement of capital and non-discrimination are the same under the EEA as under the
    EU. Non-EEA nationals (for example UK citizens after Brexit) do still need permission —
    that is the line that matters (EEA vs non-EEA), and membership does not move it.

asMember:
  is: >-
    Á sviði eignarhalds breytist mjög lítið — þetta eru þegar EES-frelsi, svo efnisbreytingin
    varð við EES-aðildina, ekki við fulla aðild. Það sem raunverulega stæði eftir er
    eignarhald í sjávarútvegi: takmarkanir Íslands á erlendu eignarhaldi í greininni voru
    aldrei samningsatriði og voru taldar tengjast (aldrei opnaða) sjávarútvegskaflanum.
  en: >-
    On ownership, very little changes — these are already EEA freedoms, so the substantive
    shift happened at EEA accession, not at full membership. What would genuinely remain is
    ownership in fisheries: Iceland's limits on foreign ownership in the sector were never a
    negotiating item and were expected to be linked to the (never-opened) fisheries chapter.

gains:
  - claim:
      is: "Opinbert eignarhald er öruggt: 345. gr. sáttmálans um starfshætti ESB (speglað í 125. gr. EES) gerir ESB hlutlaust um eignarform — sáttmálarnir „hindra hvorki þjóðnýtingu né einkavæðingu", svo Landsvirkjun mætti vera áfram alfarið í eigu ríkisins."
      en: "Public ownership is safe: Article 345 TFEU (mirrored by Art. 125 EEA) makes the EU neutral on the form of ownership — the Treaties 'do not preclude either nationalisation or privatisation', so Landsvirkjun could remain fully state-owned."
    affects: ["everyone"]
    confidence: high
    sources:
      - title: "Guide to the case-law on the free movement of capital (Art. 345; Essent)"
        url: "https://finance.ec.europa.eu/system/files/2018-11/160223-guide-case-law-free-movement-capital_en.pdf"
        publisher: "European Commission"
        tier: primary
      - title: "Essent, Joined Cases C-105/12 to C-107/12 (Art. 345 + Art. 63 TFEU)"
        url: "https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:62012CJ0105"
        publisher: "EUR-Lex (CJEU)"
        tier: primary
  - claim:
      is: "Auðlindarentan er áfram á forræði Íslands: skattlagning er innlent mál og ESB-skattalöggjöf krefst einróma samþykkis, svo Ísland hefði neitunarvald. Veiðigjaldið (á hvert kg afla; um 52 milljónir evra árið 2014, ~6% af aflaverðmæti) og stjórnarskrárákvæðið um auðlindir snúast um eignarform og rentu — sem 345. gr. verndar."
      en: "The resource rent stays Iceland's to set: taxation is a national matter and EU tax legislation needs unanimity, so Iceland would hold a veto. The fishing fee (veiðigjald, per kg of catch; about €52m in 2014, ~6% of catch value) and the constitutional natural-resources clause are about the form of ownership and rent capture — which Art. 345 protects."
    affects: ["everyone", "taxpayers"]
    confidence: high
    sources:
      - title: "General tax policy (Fact Sheet 92 — taxation a national competence, unanimity)"
        url: "https://www.europarl.europa.eu/factsheets/en/sheet/92/general-tax-policy"
        publisher: "European Parliament"
        tier: primary
      - title: "Fisheries resource rent (veiðigjald)"
        url: "https://island.is/en/fisheries-resource-rent"
        publisher: "Government of Iceland"
        tier: primary
      - title: "Draft constitutional natural-resources clause (auðlindaákvæði), CDL-REF(2020)049rev"
        url: "https://www.venice.coe.int/webforms/documents/default.aspx?pdffile=CDL-REF(2020)049rev-e"
        publisher: "Venice Commission"
        tier: primary
  - claim:
      is: "Innlendar verndarráðstafanir geta lifað af — ef þær mismuna ekki eftir þjóðerni. Lögin frá 2020 sem takmarka landareign við 10.000 hektara á hvern eiganda (eða tengda aðila) eru sönnun þess: þau byggja á stærð eignar, ekki þjóðerni, og standast því reglur EES. (Þau spruttu af samþjöppuðum jarðakaupum — Jim Ratcliffe var áberandi tilefnið — og eru ekki afturvirk.)"
      en: "Domestic safeguards can survive — if they don't discriminate by nationality. The 2020 laws capping land ownership at 10,000 hectares per owner (or affiliated parties) prove it: they rest on the size of the holding, not nationality, and so comply with EEA rules. (They grew out of concentrated land-buying — Jim Ratcliffe the prominent catalyst — and are not retroactive.)"
    affects: ["everyone"]
    confidence: medium
    sources:
      - title: "New laws restrict land ownership to maximum 10,000 hectares"
        url: "https://www.icelandreview.com/news/politics/new-laws-restrict-land-ownership-to-maximum-10000-hectares/"
        publisher: "Iceland Review"
        tier: press
      - title: "No more land purchases (2020 land-ownership reform)"
        url: "https://www.ruv.is/english/2021-09-23-no-more-land-purchases"
        publisher: "RÚV"
        tier: press

losses:
  - claim:
      is: "Eignarhald í sjávarútvegi yrði að opnast: takmörkun Íslands (íslenskt eignarhald, undir 25% erlendir hluthafar á fiskveiði- og vinnslufyrirtækjum) var talin andstæð regluverkinu. Framkvæmdastjórn ESB sagði 2012 (orðrétt) að „takmarkanir í sjávarútvegi á staðfesturétti, þjónustu og fjármagnsflæði eru ekki í samræmi við regluverkið" og þyrftu að víkja. Þetta var aldrei samið um — tengdist sjávarútvegskaflanum sem aldrei var opnaður."
      en: "Fisheries ownership would have to open: Iceland's limit (Icelandic ownership, under 25% foreign shareholders in fishing and processing firms) was deemed acquis-incompatible. The European Commission said in 2012 (verbatim) that 'restrictions in the fisheries sector on freedom of establishment, services and capital movements are not in line with the acquis' and would need to be lifted. This was never negotiated — it was linked to the fisheries chapter, which was never opened."
    affects: ["everyone"]
    confidence: high
    sources:
      - title: "2025 Investment Climate Statement — Iceland (<25% foreign ownership in fisheries)"
        url: "https://www.state.gov/reports/2025-investment-climate-statements/iceland/"
        publisher: "US Department of State"
        tier: primary
      - title: "Commission staff working document on Iceland, 2012 (CELEX:52012SC0337)"
        url: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52012SC0337"
        publisher: "European Commission"
        tier: primary
  - claim:
      is: "Verndarráðstafanir mega ekki beinast að útlendingum: 345. gr. undanþiggur ekki eignarreglur frá fjórfrelsinu (Essent-dómurinn), svo þær verða að vera án mismununar og í hófi. Og mest af þessari opnun gerðist þegar með EES — EES/EFTA-borgarar geta nú þegar keypt land, orkuréttindi og ár — svo „yfirráðin" voru að stórum hluta látin af hendi 1994, ekki við aðild."
      en: "Safeguards cannot target foreigners: Art. 345 does not exempt ownership rules from the four freedoms (the Essent ruling), so they must be non-discriminatory and proportionate. And most of this opening already happened with the EEA — EEA/EFTA nationals can already buy land, energy rights and rivers — so the 'control' was largely given up in 1994, not at membership."
    affects: ["everyone"]
    confidence: high
    sources:
      - title: "Guide to the case-law on the free movement of capital (Art. 345 limits)"
        url: "https://finance.ec.europa.eu/system/files/2018-11/160223-guide-case-law-free-movement-capital_en.pdf"
        publisher: "European Commission"
        tier: primary
      - title: "Foreign nationals' real-property rights (EEA no-permit rule; Reg. 702/2002)"
        url: "https://government.is/topics/foreign-nationals/foreign-nationals-real-property-rights/"
        publisher: "Government of Iceland"
        tier: primary

uncertain:
  - claim:
      is: "Óvíst er hvernig eignarhald í sjávarútvegi yrði í raun leyst: það var aldrei samið um, tengdist sjávarútvegskaflanum sem aldrei var opnaður, og ekkert fordæmi er um varanlega undanþágu frá sameiginlegu stefnunni."
      en: "It is uncertain how fisheries ownership would actually be resolved: it was never negotiated, was linked to the never-opened fisheries chapter, and there is no precedent for a permanent derogation from the common policy."
    confidence: medium
    sources:
      - title: "Summary Conclusions — Iceland's EU accession negotiations"
        url: "https://www.government.is/media/utanrikisraduneyti-media/media/esb/Summary-Conclusions.pdf"
        publisher: "Government of Iceland"
        tier: primary
      - title: "Commission staff working document on Iceland, 2012 (CELEX:52012SC0337)"
        url: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52012SC0337"
        publisher: "European Commission"
        tier: primary
  - claim:
      is: "Stjórnarskrárákvæðið um auðlindir (sem lýsir auðlindum þjóðareign og mælir fyrir um gjöld fyrir nýtingu) er enn drög frá 2020 sem aldrei voru lögfest — staða þess og samspil við fjórfrelsi ESB er óútkljáð."
      en: "The constitutional natural-resources clause (declaring resources national property and mandating fees for their use) remains a 2020 draft that was never enacted — its status and interaction with the EU's four freedoms is unresolved."
    confidence: medium
    sources:
      - title: "Draft constitutional natural-resources clause (auðlindaákvæði), CDL-REF(2020)049rev"
        url: "https://www.venice.coe.int/webforms/documents/default.aspx?pdffile=CDL-REF(2020)049rev-e"
        publisher: "Venice Commission"
        tier: primary

calculator: false
basket: false
lastReviewed: 2026-06-18
confidence: high
```

- [ ] **Step 2: Build and verify the chapter renders**

Run: `npm run build`
Expected: PASS, **22 pages** (20 + `/natural-resources/` + `/en/natural-resources/`). Then:

```bash
test -e dist/natural-resources/index.html && echo "OK: /natural-resources"
test -e dist/en/natural-resources/index.html && echo "OK: /en/natural-resources"
grep -q "Auðlindir" dist/natural-resources/index.html && echo "OK: is title"
grep -q "Natural resources" dist/en/natural-resources/index.html && echo "OK: en title"
grep -q "not in line with the acquis" dist/en/natural-resources/index.html && echo "OK: 2012 fisheries quote present"
grep -c 'class="chip"' dist/en/natural-resources/index.html
```
Expected: both routes, both titles, the 2012 fisheries verbatim line present, and a non-zero chip count.

- [ ] **Step 3: Commit**

```bash
git add src/content/dossiers/natural-resources.yaml
git commit -m "feat(content): add Natural resources chapter (order 7)

From the verified auðlindir research: the 'foreigners buying up Iceland' fear
is largely misdirected — EEA already opened ownership in 1994, membership
changes little, Iceland keeps the levers (Art.345 public ownership; tax/rent
national + veto; nationality-neutral land cap). Real loss: fisheries-as-asset
cap acquis-incompatible (2012 report, verbatim) would have to be removed.
Honest 'little changes' framing, no forced balance. Icelandic AI-draft -> Nina.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Renumber `security-energy.yaml` to its final slot

**Files:**
- Modify: `src/content/dossiers/security-energy.yaml` (`order: 7 → 8`)

**Interfaces:**
- Consumes: natural-resources at `order: 7` (Task 1). Produces contiguous Home ordering `01 … 07 Auðlindir · 08 Öryggi og orka` — the complete 8-chapter arc.

- [ ] **Step 1: Change the order value**

In `src/content/dossiers/security-energy.yaml`, change the top-of-file `order: 7` → `order: 8`. Change nothing else.

- [ ] **Step 2: Build and verify contiguous numbering**

Run: `npm run build`
Expected: PASS (22 pages). Then:

```bash
grep -oE 'class="num">[0-9]{2}' dist/index.html | sort -u
```
Expected: `01 02 03 04 05 06 07 08` (exactly eight, contiguous — no gap, no duplicate `07`).

- [ ] **Step 3: Commit**

```bash
git add src/content/dossiers/security-energy.yaml
git commit -m "chore(content): security-energy order 7->8 (natural-resources takes 07)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Full verification + memory update

**Files:**
- Modify: project memory (`review-status.md`, `project-overview.md`) — controller does this.

- [ ] **Step 1: Full build + test**

Run: `npm run build && npm test`
Expected: build green at **22 pages**; Vitest **15/15** (no logic touched).

- [ ] **Step 2: Visual gate (Playwright)**

Navigate the preview build to `/natural-resources/`, `/en/natural-resources/`, and `/` (Home). Confirm: hero (eyebrow "Kafli 07" / "Chapter 07"); today-vs-as-member compare (the "EEA already governs this" reality); the gains/losses ledger (public-ownership/tax-veto/land-cap gains vs fisheries-ownership/already-ceded losses); the uncertain box; source chips link out; and Home lists `01–08` contiguous with Auðlindir at 07 and Öryggi og orka at 08. (Fonts won't load in the sandbox tool — verify content/layout.)

- [ ] **Step 3: Update memory**

Update `review-status.md` (Natural resources Icelandic copy AI-draft → Nína) and `project-overview.md` (Natural resources built + live → **the full 8-chapter arc + Start-here + Methodology is complete**). Controller task.

---

## Notes for the executor

- **Task order:** Task 1 (natural-resources at order 7) before Task 2 (renumber), so the contiguity check is meaningful.
- **Use the exact URLs in Task 1 verbatim** — from the verified dossier; do not alter or invent.
- **YAML hygiene:** 2-space indent, `>-` folded scalars for prose, preserve curly quotes („ ") and Icelandic characters. For inner closing curly quotes inside double-quoted scalars, use U+201D `"` (NOT ASCII `"`) or the build fails — see `tldr.is`/`today.is` and the gains[0] claim.
- Icelandic prose is AI-draft; structural correctness + accurate sources matter most. Don't conflate the nationality-neutral land cap with the non-EEA permit regime; the auðlindaákvæði is a draft.
- Single chapter; nothing else touched (no component/schema change). **This completes the 8-topic arc.**
```
