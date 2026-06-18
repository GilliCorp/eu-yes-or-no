# Farming Chapter — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Farming chapter (`farming.yaml`) as a standard dossier drawn from the verified research, and renumber so the Home list stays contiguous.

**Architecture:** A single new content-collection YAML rendered by the existing `Dossier.astro`; plus a one-line `order` change on `security-energy.yaml`. No component or schema change. No `stakes`/`calculator`/`basket`.

**Tech Stack:** Astro 6 content collections (Zod schema), bilingual `loc` objects, existing `Dossier.astro` renderer. Vitest suite untouched.

## Global Constraints

- **Bilingual or build-fails:** every user-facing string is `{ is, en }`, both non-empty.
- **Sources on every ledger point (`.min(1)`):** every `gains`/`losses`/`uncertain` claim carries ≥1 `source` with a valid URL + tier. Narrative fields (`tldr`/`summary`/`today`/`asMember`) are unsourced prose (as in the sibling chapters) and may name laws/cases inline without chips.
- **Source tiers:** laws/treaties/court rulings/statistics/official accession docs = `primary`; Bændasamtök stakeholder submission = `advocacy` (framing only, never as proof of a fact).
- **Use ONLY the exact URLs in this plan** (resolved + confirmed). Do NOT invent or alter URLs.
- **Title:** "Landbúnaður / Farming" (NOT "& rural life").
- **`order: 5`** for farming; **`security-energy.yaml` 5 → 6** (Home shows the order as a visible `0N` number → must stay gap-free).
- **The ~2009 estimate caveat travels inline** in the claim sentence (no asterisk/footnote — the renderer has none). The disease-safeguard claim is conditional/hedged.
- **Don't conflate** the 2015 tariff deal / Bændasamtök statements with the accession talks — the relevant claim says so explicitly.
- Node ≥ 22.12. Verification = `npm run build` green + `npm test` (15/15) + visual check.
- Conventional commits ending with `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

### Task 1: Create `src/content/dossiers/farming.yaml`

**Files:**
- Create: `src/content/dossiers/farming.yaml`

**Interfaces:**
- Produces a dossier collection entry at `order: 5`, routes `/farming` + `/en/farming` (auto-generated), listed on Home.

- [ ] **Step 1: Create the file**

Create `src/content/dossiers/farming.yaml` with exactly this content (Icelandic is AI-draft for later review; match the 2-space indent + `>-` folded style of the sibling YAMLs):

```yaml
order: 5

title:
  is: "Landbúnaður"
  en: "Farming"

tldr:
  is: "Ólíkt flestu undir EES breytir aðild hér miklu: magntollar sem vernda innlenda framleiðslu víkja fyrir sameiginlegu landbúnaðarstefnunni (CAP), sem styður tekjur bænda með afkomutengdum greiðslum. Útkoman er blönduð og skiptist eftir búgreinum."
  en: "Unlike most things under the EEA, membership changes a lot here: the quantitative import tariffs that protect domestic production give way to the Common Agricultural Policy (CAP), which supports farm income through decoupled payments. The outcome is mixed and splits by sector."

summary:
  is: >-
    Landbúnaður er að mestu utan EES, svo þetta er svæði þar sem full aðild breytir
    reglunum í raun. Í dag hvílir stuðningurinn á magntollum sem veita „verulega vernd"
    — nær enginn innflutningur á sér stað utan tollkvóta. Aðild þýddi að taka upp CAP
    (387 ma. evra 2021–27), sem styður tekjur bænda aðallega með afkomutengdum,
    flatarmálstengdum beingreiðslum (um 70% af fjárlögum) í stað landamæraverndar.
    Greining utanríkisráðuneytisins (um 2009) taldi þetta blandaða útkomu sem skiptist
    eftir búgreinum: sauðfé, mjólk og nautgripir nytu flatargreiðslna, en svínakjöt,
    alifuglar og egg fengju nær ekkert — á sama tíma og tollverndin félli niður fyrir
    allar greinar. Landbúnaðarkaflinn var aldrei kláraður áður en viðræður stöðvuðust
    2013, og ESB veitir engar varanlegar undanþágur frá sameiginlegu stefnunni.
  en: >-
    Agriculture sits largely outside the EEA, so this is an area where full membership
    genuinely changes the rules. Today support rests on quantitative import tariffs
    (magntollar) that give "substantial protection" — virtually no imports happen
    outside the tariff quotas. Membership would mean adopting the CAP (€387bn for
    2021–27), which supports farm income mainly through decoupled, area-based direct
    payments (about 70% of the budget) rather than border protection. The Foreign
    Ministry's (~2009) analysis judged this a mixed, sector-split outcome: sheep, dairy
    and beef would draw area-based payments, while pork, poultry and eggs would get
    almost nothing — even as tariff protection falls away for all of them. The
    agriculture chapter was never finished before talks were suspended in 2013, and the
    EU grants no permanent derogations from the common policy.

today:
  is: >-
    Stuðningur við íslenskan landbúnað hvílir á magntollum sem veita verulega vernd —
    nær enginn innflutningur á sér stað utan tollkvóta. Landbúnaður fellur að mestu utan
    EES, ólíkt flestum sviðum, svo þetta er eitt af því sem full aðild myndi raunverulega
    breyta. Dýraheilbrigðiskröfur valda þó þegar núningi undir EES: innflutningur á hráu
    kjöti, eggjum og mjólk lýtur leyfiskerfi sem EFTA-dómstóllinn og Eftirlitsstofnun
    EFTA hafa ítrekað dæmt andstætt EES-reglum (tilskipun 89/662/EBE; sameinuð mál
    E-2/17 og E-3/17, 2017).
  en: >-
    Support for Icelandic agriculture rests on quantitative tariffs (magntollar) that
    give substantial protection — virtually no imports happen outside the tariff quotas.
    Unlike most areas, agriculture falls largely outside the EEA, so it is one of the
    things full membership would genuinely change. Animal-health rules already cause
    friction under the EEA, though: imports of raw meat, eggs and milk go through a
    prior-authorisation regime that the EFTA Court and the EFTA Surveillance Authority
    have repeatedly found to breach EEA rules (Directive 89/662/EEC; Joined Cases E-2/17
    and E-3/17, 2017).

asMember:
  is: >-
    Aðild þýðir að taka upp sameiginlegu landbúnaðarstefnuna (CAP). Landamæravernd hverfur
    ekki en færist út á ytri landamæri ESB — Ísland missir innri vernd gagnvart öðrum
    aðildarríkjum (frjáls landbúnaðarviðskipti á innri markaðnum). CAP styður tekjur
    aðallega með afkomutengdum beingreiðslum (um 70%, flatarmálstengdum), sem eru háðar
    umhverfis-, lands- og félagslegum skilyrðum. Dýraheilbrigðiskröfurnar myndu dýpka,
    ekki verða til.
  en: >-
    Membership means adopting the Common Agricultural Policy (CAP). Border protection
    isn't abolished but moves to the EU's external border — Iceland loses internal
    protection against the other member states (free agricultural trade within the
    single market). The CAP supports income mainly through decoupled direct payments
    (about 70%, area-based), conditional on environmental, land and social standards.
    The animal-health constraints would deepen, not be created.

gains:
  - claim:
      is: "Búgreinar sem uppfylla skilyrði fengju tekjustuðning: flatarmáls-, umhverfis- og harðbýlisgreiðslur (LFA) myndu styðja sauðfé, mjólkurframleiðslu og nautgripi — þær greinar kæmu „betur en aðrar búgreinar" út."
      en: "Sectors that qualify would get income support: area-based, environmental and less-favoured-area (LFA) payments would support sheep, dairy and beef — these would fare 'better than other sectors'."
    affects: ["farmers"]
    confidence: high
    sources:
      - title: "20. kafli — ESB-aðild og íslenskur landbúnaður (accession analysis)"
        url: "https://www.stjornarradid.is/media/utanrikisraduneyti-media/media/skyrslur/20kafli.pdf"
        publisher: "Iceland Ministry for Foreign Affairs"
        tier: primary
      - title: "Direct payments to farmers (Fact Sheet 109)"
        url: "https://www.europarl.europa.eu/factsheets/en/sheet/109/direct-payments-to-farmers"
        publisher: "European Parliament"
        tier: primary
      - title: "The common agricultural policy at a glance"
        url: "https://agriculture.ec.europa.eu/common-agricultural-policy/cap-overview/cap-glance_en"
        publisher: "European Commission"
        tier: primary
  - claim:
      is: "Heildarstuðningur (ESB + íslenskur) gæti farið yfir 5 milljarða króna, með ESB-hlut allt að 65–70%, ef skilgreiningar Íslands á harðbýli og styrkhæfri framleiðslu líktust Norður-Svíþjóð og Finnlandi. Þetta er þó mat utanríkisráðuneytisins frá um 2009 — ekki spá um núverandi CAP (2023–27)."
      en: "Total support (EU + Icelandic) could exceed 5 billion ISK, with the EU share up to 65–70%, if Iceland's hard-farming/LFA and eligible-production definitions resembled those of northern Sweden and Finland. But this is the Foreign Ministry's ~2009 estimate — not a forecast for the current CAP (2023–27)."
    affects: ["farmers"]
    confidence: medium
    sources:
      - title: "20. kafli — ESB-aðild og íslenskur landbúnaður (accession analysis)"
        url: "https://www.stjornarradid.is/media/utanrikisraduneyti-media/media/skyrslur/20kafli.pdf"
        publisher: "Iceland Ministry for Foreign Affairs"
        tier: primary

losses:
  - claim:
      is: "Tap á landamæravernd sem framleiðslan hvílir á: frjáls innflutningur frá ESB myndi setja matvælaiðnaðinn í þrönga stöðu og gera bændum erfitt að selja afurðir sínar."
      en: "Loss of the border protection that production rests on: free EU imports would put the food industry in a tight spot and make it hard for farmers to sell their products."
    affects: ["farmers"]
    confidence: high
    sources:
      - title: "20. kafli — ESB-aðild og íslenskur landbúnaður (accession analysis)"
        url: "https://www.stjornarradid.is/media/utanrikisraduneyti-media/media/skyrslur/20kafli.pdf"
        publisher: "Iceland Ministry for Foreign Affairs"
        tier: primary
      - title: "Common Agricultural Policy (EU) overview"
        url: "https://www.ers.usda.gov/topics/international-markets-us-trade/countries-regions/european-union/common-agricultural-policy/"
        publisher: "USDA Economic Research Service"
        tier: primary
  - claim:
      is: "Heilar búgreinar fá engan stuðning: svínakjöt, alifuglar og egg fengju nær engar CAP-greiðslur — þær misstu tollvernd og fengju lítinn stuðning í staðinn."
      en: "Whole sectors left unsupported: pork, poultry and eggs would get essentially no CAP funding — they'd lose tariff protection and gain little support in return."
    affects: ["farmers"]
    confidence: high
    sources:
      - title: "20. kafli — ESB-aðild og íslenskur landbúnaður (accession analysis)"
        url: "https://www.stjornarradid.is/media/utanrikisraduneyti-media/media/skyrslur/20kafli.pdf"
        publisher: "Iceland Ministry for Foreign Affairs"
        tier: primary
  - claim:
      is: "Engar varanlegar undanþágur frá sameiginlegu stefnunni — aðeins tímabundnar (breytanlegar á sambandsstigi); varanleg sérlausn verður að standa í aðildarsamningnum sjálfum."
      en: "No permanent derogations from the common policy — only temporary ones (changeable at Union level); a permanent special solution must be written into the accession treaty itself."
    affects: ["farmers"]
    confidence: high
    sources:
      - title: "Summary Conclusions — Iceland's EU accession negotiations"
        url: "https://www.government.is/media/utanrikisraduneyti-media/media/esb/Summary-Conclusions.pdf"
        publisher: "Government of Iceland"
        tier: primary
  - claim:
      is: "Tekjur gætu fallið skarpt áður en CAP-greiðslur vega það upp að hluta — í líkani ráðuneytisins (um 2009) féllu tekjur af mjólk um meira en helming og af nautgripum verulega."
      en: "Income could fall sharply before CAP payments partly offset it — in the Ministry's (~2009) modelling, dairy income fell by over half and beef income substantially."
    affects: ["farmers"]
    confidence: medium
    sources:
      - title: "20. kafli — ESB-aðild og íslenskur landbúnaður (accession analysis)"
        url: "https://www.stjornarradid.is/media/utanrikisraduneyti-media/media/skyrslur/20kafli.pdf"
        publisher: "Iceland Ministry for Foreign Affairs"
        tier: primary

uncertain:
  - claim:
      is: "Dýraheilbrigði: Ísland gæti hugsanlega haldið takmörkunum á innflutningi lifandi dýra, hrás kjöts og ógerilsneyddrar mjólkur vegna sérstöðu sinnar — en aðeins með vísindalegum rökstuðningi samkvæmt SPS-reglum WTO. Núverandi leyfiskerfi hefur þegar verið dæmt ólögmætt undir EES (EFTA-dómstóllinn, sameinuð mál E-2/17 og E-3/17), svo aðild myndi dýpka þá kröfu, ekki skapa hana."
      en: "Animal health: Iceland might be able to keep restricting imports of live animals, raw meat and unpasteurised milk on its special status — but only with scientific justification under WTO/SPS rules. Its current prior-authorisation regime has already been ruled unlawful under the EEA (EFTA Court, Joined Cases E-2/17 and E-3/17), so membership would deepen that constraint, not create it."
    confidence: medium
    sources:
      - title: "20. kafli — ESB-aðild og íslenskur landbúnaður (accession analysis)"
        url: "https://www.stjornarradid.is/media/utanrikisraduneyti-media/media/skyrslur/20kafli.pdf"
        publisher: "Iceland Ministry for Foreign Affairs"
        tier: primary
      - title: "WTO Agreement on Sanitary and Phytosanitary Measures (Art. 5, risk assessment)"
        url: "https://www.wto.org/english/docs_e/legal_e/sps_e.htm"
        publisher: "World Trade Organization"
        tier: primary
      - title: "EFTA Court Joined Cases E-2/17 and E-3/17 (ESA v Iceland, 14 Nov 2017)"
        url: "https://eftacourt.int/cases/joined-cases-e-02-17-and-e-03-17/"
        publisher: "EFTA Court"
        tier: primary
  - claim:
      is: "Bændasamtök Íslands eru ekki einróma á móti breytingum — þau hafa sagt að núverandi tollvernd „nái ekki lengur tilgangi sínum" og studdu (2025) WTO-varnarráðstafanir gegn innflutningstoppum. (Athugið: þetta varðar sjálfstætt EES-viðskiptaumhverfi Íslands, ekki aðild beint.)"
      en: "The Farmers' Association (Bændasamtök Íslands) is not monolithically against change — it has said the current tariff protection 'no longer serves its purpose' and backed (2025) WTO-style safeguards against import surges. (Note: this concerns Iceland's standalone EEA trade framework, not accession directly.)"
    confidence: medium
    sources:
      - title: "Umsögn 157-1038 — Bændasamtök Íslands (safeguard measures in customs law)"
        url: "https://www.althingi.is/altext/erindi/157/157-1038.pdf"
        publisher: "Bændasamtök Íslands"
        tier: advocacy
      - title: "Þingskjal 151/433 — EU–Iceland agricultural tariff agreement (report request)"
        url: "https://www.althingi.is/altext/151/s/0433.html"
        publisher: "Alþingi"
        tier: primary
  - claim:
      is: "Reynslan 2010–2013 er auð síða, ekki dómur: Ísland útbjó aðgerðaáætlun og ESB bauð samningsafstöðu, en landbúnaðarafstaðan var aldrei kláruð þegar viðræður stöðvuðust — líklega vegna ósamkomulags innanlands. Landbúnaður var ein af fjórum köflum án afstöðu við stöðvun."
      en: "The 2010–2013 experience is a blank page, not a verdict: Iceland prepared an action plan and the EU invited a negotiating position, but the agriculture position was never finished when talks were suspended — likely due to internal disagreement. Agriculture was one of four chapters with no position in place at suspension."
    confidence: high
    sources:
      - title: "Summary Conclusions — Iceland's EU accession negotiations"
        url: "https://www.government.is/media/utanrikisraduneyti-media/media/esb/Summary-Conclusions.pdf"
        publisher: "Government of Iceland"
        tier: primary

calculator: false
basket: false
lastReviewed: 2026-06-18
confidence: high
```

- [ ] **Step 2: Build and verify the chapter renders**

Run: `npm run build`
Expected: PASS, **18 pages** (16 + `/farming/` + `/en/farming/`). Then:

```bash
test -e dist/farming/index.html && echo "OK: /farming"
test -e dist/en/farming/index.html && echo "OK: /en/farming"
grep -q "Landbúnaður" dist/farming/index.html && echo "OK: is title"
grep -q "Farming" dist/en/farming/index.html && echo "OK: en title"
grep -c 'class="chip"' dist/en/farming/index.html
```
Expected: both routes, both titles, and a non-zero chip count (the ledger is sourced).

- [ ] **Step 3: Commit**

```bash
git add src/content/dossiers/farming.yaml
git commit -m "feat(content): add Farming chapter (order 5)

From the verified farming research: CAP vs magntollar, sector-split ledger
(sheep/dairy/beef helped; pork/poultry/eggs unsupported), no permanent
derogations, animal-health already binds under EEA. 2009-era 5bn/65-70%
estimate carries its date inline; disease safeguard hedged. Icelandic
AI-draft -> Nina review.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Renumber `security-energy.yaml` to keep the Home list contiguous

**Files:**
- Modify: `src/content/dossiers/security-energy.yaml` (`order: 5 → 6`)

**Interfaces:**
- Consumes: farming at `order: 5` (Task 1). Produces contiguous Home ordering `01 Húsnæðislán · 02 Matarkarfan · 03 Vinnan og verðlagið · 04 Fiskveiðar · 05 Landbúnaður · 06 Öryggi og orka`.

- [ ] **Step 1: Change the order value**

In `src/content/dossiers/security-energy.yaml`, change the top-of-file `order: 5` → `order: 6`. Change nothing else.

- [ ] **Step 2: Build and verify contiguous numbering**

Run: `npm run build`
Expected: PASS (18 pages). Then:

```bash
grep -oE 'class="num">[0-9]{2}' dist/index.html | sort -u
```
Expected: `01 02 03 04 05 06` (exactly six, contiguous — no gap, no duplicate `05`).

- [ ] **Step 3: Commit**

```bash
git add src/content/dossiers/security-energy.yaml
git commit -m "chore(content): security-energy order 5->6 (farming takes 05)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Full verification + memory update

**Files:**
- Modify: project memory (`review-status.md`, `project-overview.md`) — controller does this.

- [ ] **Step 1: Full build + test**

Run: `npm run build && npm test`
Expected: build green at **18 pages**; Vitest **15/15** (no logic touched).

- [ ] **Step 2: Visual gate (Playwright)**

Navigate the preview build to `/farming/`, `/en/farming/`, and `/` (Home). Confirm: hero (eyebrow "Kafli 05" / "Chapter 05"); today-vs-as-member compare; the gains/losses ledger with the sector split; the uncertain box; source chips link out; the ~2009 caveat reads inline on the 5bn claim; and Home lists `01–06` contiguous with Landbúnaður at 05 and Öryggi og orka at 06. (Fonts won't load in the sandbox tool — verify content/layout.)

- [ ] **Step 3: Update memory**

Update `review-status.md` (Farming chapter Icelandic copy is AI-draft → Nína) and `project-overview.md` (Farming built + live; 2 national-half chapters left: Sovereignty, Natural resources). Controller task.

---

## Notes for the executor

- **Task order:** Task 1 (farming at order 5) before Task 2 (renumber), so the contiguity check is meaningful.
- **Use the exact URLs in Task 1 verbatim** — they were resolved/confirmed; do not alter or invent.
- **YAML hygiene:** 2-space indent, `>-` folded scalars for prose, preserve the curly quotes („ ") and Icelandic characters exactly.
- Icelandic prose is AI-draft; structural correctness + accurate sources matter most.
- Single chapter; nothing else touched (no component/schema change).
