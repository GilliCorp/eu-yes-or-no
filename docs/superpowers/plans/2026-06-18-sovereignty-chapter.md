# Sovereignty Chapter — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Sovereignty chapter (`sovereignty.yaml`) as a standard dossier from the verified research, and renumber so the Home list stays contiguous.

**Architecture:** A single new content-collection YAML rendered by the existing `Dossier.astro`; plus a one-line `order` change on `security-energy.yaml`. No component/schema change. No `stakes`/`calculator`/`basket`.

**Tech Stack:** Astro 6 content collections (Zod schema), bilingual `loc` objects, existing `Dossier.astro`. Vitest suite untouched.

## Global Constraints

- **Bilingual or build-fails:** every text field `{is, en}`, both non-empty.
- **Sources on every ledger point (`.min(1)`):** each `gains`/`losses`/`uncertain` claim carries ≥1 `source` with a valid URL + tier. Narrative fields (`tldr`/`summary`/`today`/`asMember`) are unsourced prose (as in sibling chapters) and may name treaties/articles inline without chips.
- **Source tiers:** Council/EP/EUR-Lex/EFTA/government.is/Constitution = `primary`; Thorhallsson / Panke / OAPEN / Méndez-Pinedo = `academic`; Iceland Review = `press`.
- **Use ONLY the exact URLs in this plan** (from the verified dossier's SOURCES section). Do NOT invent or alter URLs.
- **Title:** "Fullveldi / Sovereignty".
- **`order: 6`** for sovereignty; **`security-energy.yaml` 6 → 7** (Home shows the order as a visible `0N` number → must stay gap-free).
- **0.08% / ~6-of-720 MEPs shown prominently in the LOSSES column** (no stakes hook).
- **Three traps/caveats:** (a) do NOT cite the "revocable transfer + referendum" constitutional clause as current — it's the FAILED 2011 draft (simplest: don't mention the draft; state only that the in-force constitution lacks a transfer clause); (b) "~6 MEPs" is a modelled EU-40 scenario — phrase "~6 / likely the floor"; (c) Icesave: Iceland *won* at the EFTA Court — the EU pressure was political, not a legal defeat (in the `today` narrative).
- Node ≥ 22.12. Verification = `npm run build` green + `npm test` (15/15) + visual check.
- Conventional commits ending with `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

### Task 1: Create `src/content/dossiers/sovereignty.yaml`

**Files:**
- Create: `src/content/dossiers/sovereignty.yaml`

**Interfaces:**
- Produces a dossier entry at `order: 6`, routes `/sovereignty` + `/en/sovereignty`, listed on Home.

- [ ] **Step 1: Create the file**

Create `src/content/dossiers/sovereignty.yaml` with exactly this content (Icelandic is AI-draft; match the 2-space indent + `>-` folded style; keep curly quotes „ … " and Icelandic characters intact):

```yaml
order: 6

title:
  is: "Fullveldi"
  en: "Sovereignty"

tldr:
  is: "Þetta snýst ekki um „ESB eða ekkert" heldur um EES-regluþega í dag á móti aðildarríki með atkvæði. Það eru raunveruleg skipti — hvorug hliðin vinnur hreinan sigur."
  en: "This isn't 'EU or nothing' — it's EEA rule-taker today vs full member with a vote. It's a genuine trade — neither side wins outright."

summary:
  is: >-
    Í dag tekur Ísland nú þegar upp stóran hluta innri-markaðs reglna ESB með engu
    sæti, engu atkvæði og engum þingmönnum — „faxlýðræði". Aðild breytir regluþega í
    reglusmið: atkvæði í ráðinu, um sex þingmenn, eiginn framkvæmdastjóri og forsæti
    til skiptis. En um leið flyst fullveldi formlega á sviðum sem eru utan EES
    (landbúnaður, sjávarútvegur, tollabandalag, sameiginleg viðskiptastefna, utanríkis-
    og öryggismál, myntbandalag). Ísland yrði örlítill hluti — um 0,08% íbúa ESB — og
    gæti orðið undir í þeim ~80% löggjafar sem ráðast með auknum meirihluta. Á móti
    kemur að kerfið ofgildir smáríki, neitunarvald helst á viðkvæmustu sviðunum, og
    smáríki geta „haft áhrif umfram stærð". Niðurstaðan er raunveruleg skipti, ekki
    sigur annarrar hliðar.
  en: >-
    Today Iceland already adopts much of the EU's single-market law with no seat, no
    vote and no MEPs — "fax democracy." Membership turns the rule-taker into a
    rule-shaper: a Council vote, about six MEPs, its own Commissioner and a rotating
    presidency. But it also formally transfers sovereignty in areas outside the EEA
    (agriculture, fisheries, the customs union, common trade policy, foreign and
    security policy, monetary union). Iceland would be a tiny part — about 0.08% of the
    EU population — and could be outvoted in the ~80% of legislation decided by
    qualified majority. Against that: the system over-represents small states, a veto
    survives in the most sensitive areas, and small states can "punch above their
    weight." The result is a genuine trade, not a win for either side.

today:
  is: >-
    Sem EES-ríki hefur Ísland ekkert aðgengi að kjarnastofnunum ESB (ráðinu, þinginu,
    leiðtogaráðinu) — ekkert sæti, ekkert atkvæði, engir þingmenn. Þátttakan er aðeins
    „mótun ákvarðana": sérfræðingar sitja í sérfræðihópum og nefndum (99. og 100. gr.
    EES) en greiða ekki atkvæði. Ný innri-markaðs löggjöf er tekin upp á nokkurra vikna
    fresti í gegnum sameiginlegu EES-nefndina (102. gr.), og raunverulegt neitunarvald
    er ekki til staðar — synjun kallar fyrst á leit að lausn. Útkoman er viðbragðsstaða.
    (Þó vann Ísland Icesave-málið fyrir EFTA-dómstólnum 2013 — þrýstingur ESB í hruninu
    var pólitískur, ekki lagalegur dómur gegn Íslandi.)
  en: >-
    As an EEA member Iceland has no access to the core EU institutions (the Council,
    the Parliament, the European Council) — no seat, no vote, no MEPs. Participation is
    "decision-shaping" only: experts sit in expert groups and committees (Arts 99 and
    100 EEA) but do not vote. New single-market law is incorporated every few weeks
    through the EEA Joint Committee (Art. 102), and there is no clean veto — a refusal
    first triggers a search for a workaround. The result is a reactive posture. (Iceland
    did, however, win the Icesave case at the EFTA Court in 2013 — the EU's crash-era
    pressure was political, not a legal verdict against Iceland.)

asMember:
  is: >-
    Aðild bætir við því aðgengi sem EES skortir: atkvæði í ráðinu, um sex þingmenn,
    eiginn framkvæmdastjóri og forsæti ráðsins til skiptis. Á móti færast svið sem eru
    nú utan EES — landbúnaður, sjávarútvegur, tollabandalagið, sameiginleg
    viðskiptastefna, utanríkis- og öryggismál og myntbandalagið — undir valdsvið ESB.
  en: >-
    Membership adds the access the EEA lacks: a Council vote, about six MEPs, its own
    Commissioner and a turn holding the rotating Council presidency. In exchange, areas
    now outside the EEA — agriculture, fisheries, the customs union, common trade
    policy, foreign and security policy, and monetary union — move under EU competence.

gains:
  - claim:
      is: "Raunverulegt atkvæði og sæti í stað regluþega-stöðu dagsins í dag: atkvæði í ráðinu, um sex þingmenn (líklega lágmarkið, byggt á sviðsmynd fyrir 40 ríkja ESB), eiginn framkvæmdastjóri og forsæti til skiptis."
      en: "A real vote and seat replacing today's rule-taker status: a Council vote, about six MEPs (likely the floor, based on a modelled 40-member-EU scenario), its own Commissioner and a turn at the rotating presidency."
    affects: ["everyone"]
    confidence: high
    sources:
      - title: "How many MEPs per country (2024–2029)"
        url: "https://www.europarl.europa.eu/topics/en/article/20180126STO94114/2024-2029-european-parliament-how-many-meps-per-country"
        publisher: "European Parliament"
        tier: primary
      - title: "Treaty of Nice (summary — one Commissioner per member state)"
        url: "https://eur-lex.europa.eu/EN/legal-content/summary/treaty-of-nice.html"
        publisher: "EUR-Lex"
        tier: primary
  - claim:
      is: "Kerfið ofgildir smáríki: þingsætum er úthlutað eftir „stiglækkandi hlutfalli" (14. gr. (2) sáttmálans um ESB), svo atkvæði í smáríki vegur um tífalt meira á mann en í Þýskalandi."
      en: "The system over-represents small states: seats are allocated by 'degressive proportionality' (Art. 14(2) TEU), so a vote in a small state carries roughly ten times the per-capita weight of a vote in Germany."
    affects: ["everyone"]
    confidence: high
    sources:
      - title: "Composition of the European Parliament / degressive proportionality (study)"
        url: "https://www.europarl.europa.eu/RegData/etudes/IDAN/2024/759467/IPOL_IDA(2024)759467_EN.pdf"
        publisher: "European Parliament"
        tier: primary
  - claim:
      is: "Neitunarvald helst þar sem það skiptir mestu máli: einróma samþykki (og þar með neitunarvald hvers ríkis, líka Íslands) gildir um utanríkis- og öryggismál, samræmingu skatta, breytingar á sáttmálunum, stækkun ESB, fjárlagaramma/eigin tekjur og ný réttindi borgara."
      en: "A veto survives where it matters most: unanimity (and thus a veto for every state, including Iceland) applies to foreign and security policy, tax harmonisation, treaty change, EU enlargement, the budget/own-resources, and new rights for citizens."
    affects: ["everyone"]
    confidence: high
    sources:
      - title: "Unanimity — how the Council votes"
        url: "https://www.consilium.europa.eu/en/council-eu/how-does-the-council-vote/unanimity/"
        publisher: "Council of the EU"
        tier: primary
  - claim:
      is: "Smáríki geta „haft áhrif umfram stærð" með því að einbeita kröftum að forgangsmálum og beita sannfæringu fremur en valdi (Panke); og fjölþjóðlegt „skjól" er áreiðanlegra en að standa eitt (skjólskenning Thorhallssonar)."
      en: "Small states can 'punch above their weight' by concentrating resources on priority issues and using persuasion rather than leverage (Panke); and multilateral 'shelter' is more reliable than going it alone (Thorhallsson's shelter theory)."
    affects: ["everyone"]
    confidence: medium
    sources:
      - title: "Small states in EU negotiations (punch above their weight)"
        url: "https://aei.pitt.edu/33117/"
        publisher: "Panke (academic)"
        tier: academic
      - title: "A Small State in World Politics: Iceland's Search for Shelter"
        url: "https://uni.hi.is/baldurt/files/2018/07/A-Small-State-in-World-Politics-Icelands-Search-for-Shelter-by-Thorhallsson-20183906.pdf"
        publisher: "Thorhallsson, Univ. of Iceland"
        tier: academic

losses:
  - claim:
      is: "Örsmátt vægi: Ísland yrði um 0,08% af ~449 milljóna íbúafjölda ESB (~382 þúsund), með um sex af 720 þingmönnum (lágmarkið), og gæti orðið undir í þeim ~80% löggjafar sem ráðast með auknum meirihluta (55% ríkja og 65% íbúa; tálmandi minnihluti þarf minnst fjögur ríki)."
      en: "Microscopic weight: Iceland would be about 0.08% of the EU's ~449 million people (~382,000), with about six of 720 MEPs (the floor), and could be outvoted in the ~80% of legislation decided by qualified majority (55% of states and 65% of population; a blocking minority needs at least four states)."
    affects: ["everyone"]
    confidence: high
    sources:
      - title: "How many MEPs per country (2024–2029)"
        url: "https://www.europarl.europa.eu/topics/en/article/20180126STO94114/2024-2029-european-parliament-how-many-meps-per-country"
        publisher: "European Parliament"
        tier: primary
      - title: "Qualified majority voting"
        url: "https://www.consilium.europa.eu/en/council-eu/voting-system/qualified-majority/"
        publisher: "Council of the EU"
        tier: primary
  - claim:
      is: "Skipulagslegur „tvöfaldur vandi" smáríkja: færri atkvæði, minna efnahagslegt vægi og færri sérfræðingar og stjórnsýslugeta — sem veikir samningsstöðu og takmarkar getu til að hóta stöðvun þar sem aukinn meirihluti ræður (þ.e. í flestum málaflokkum)."
      en: "Small states' structural 'double challenge': fewer votes, less economic weight, and fewer experts and administrative resources — weakening negotiating power and limiting the ability to threaten blockage where qualified majority applies (i.e. most policy areas)."
    affects: ["everyone"]
    confidence: high
    sources:
      - title: "Small states in EU negotiations (the double challenge)"
        url: "https://aei.pitt.edu/33117/"
        publisher: "Panke (academic)"
        tier: academic
      - title: "Small states and EU decision-making (volume)"
        url: "https://library.oapen.org/bitstream/id/bb7e209f-8792-47fa-a5bd-fcd489dae75a/9781040038017.pdf"
        publisher: "OAPEN (academic)"
        tier: academic
  - claim:
      is: "Formlegt framsal fullveldis: svið sem eru nú utan EES — landbúnaður, sjávarútvegur, viðskiptastefna, utanríkis- og öryggismál og myntbandalagið — færast undir valdsvið ESB."
      en: "Formal transfer of sovereignty: areas now outside the EEA — agriculture, fisheries, trade policy, foreign and security policy, and monetary union — move under EU competence."
    affects: ["everyone"]
    confidence: high
    sources:
      - title: "Q&A about the EEA Agreement (what the EEA does and does not cover)"
        url: "https://www.efta.int/eea-relations-eu/qa-about-eea-agreement"
        publisher: "EFTA"
        tier: primary

uncertain:
  - claim:
      is: "Stjórnarskráin: núgildandi stjórnarskrá Íslands (nr. 33/1944) hefur ekkert ákvæði sem heimilar framsal ríkisvalds til yfirþjóðlegra stofnana (aðeins 21. og 2. gr.). Því er almennt talið að full aðild krefðist stjórnarskrárbreytingar fyrst — og sú leið (79. gr.) er þung: samþykki tveggja þinga með kosningum á milli."
      en: "The constitution: Iceland's current constitution (No. 33/1944) has no clause authorising the transfer of state powers to supranational bodies (only Arts 21 and 2). Full membership is therefore widely held to require a constitutional amendment first — and that route (Art. 79) is heavy: passage by two parliaments with a general election in between."
    confidence: medium
    sources:
      - title: "Constitution of the Republic of Iceland (No. 33/1944)"
        url: "https://www.government.is/library/01-Ministries/Prime-Ministrers-Office/constitution_of_iceland.pdf"
        publisher: "Government of Iceland"
        tier: primary
      - title: "Iceland sets out steps required for potential EU membership"
        url: "https://www.icelandreview.com/news/iceland-sets-out-steps-required-for-potential-eu-membership/"
        publisher: "Iceland Review"
        tier: press
  - claim:
      is: "Hvort EES feli í sér framsal löggjafarvalds er umdeilt: tveggja stoða kerfið á að forðast slíkt framsal (EES-réttur er ekki sjálfkrafa æðri), en Eftirlitsstofnun EFTA hóf samningsbrotamál (bókun 35) og Hæstiréttur Íslands hefur ítrekað vikið EES-rétti til hliðar. Þrjár ólíkar afstöður, enginn skýr sigurvegari."
      en: "Whether the EEA involves a transfer of legislative power is contested: the two-pillar structure is meant to avoid it (EEA law is not automatically supreme), but the EFTA Surveillance Authority opened infringement proceedings (Protocol 35) and Iceland's Supreme Court has repeatedly set EEA law aside. Three competing positions, no clear winner."
    confidence: medium
    sources:
      - title: "ESA reasoned opinion — Protocol 35 (primacy of EEA law)"
        url: "https://www.eftasurv.int/cms/sites/default/files/documents/gopro/Reasoned%20opinion%20-%20Own%20initiative%20case%20against%20Iceland%20concerning%20the%20incorporation%20of%20Protocol%2035.pdf"
        publisher: "EFTA Surveillance Authority"
        tier: primary
      - title: "Constitutional/judicial resistance to European law in Iceland"
        url: "https://www.tribunajuridica.eu/arhiva/An10v3/3.%20Elvira%20Mendez%20Pinedo%20-%20Lucrarea%201.pdf"
        publisher: "Méndez-Pinedo (academic)"
        tier: academic
  - claim:
      is: "Hve stóran hluta laga Ísland tekur þegar upp gegnum EES er á reiki: EFTA telur um 5.000 gerðir í gildi í dag (af meira en 9.500 sem hafa verið teknar upp). Hin vinsæla „tveir þriðju" tala er umdeilt mat (rakið til Olli Rehn) á upptöku regluverksins — ekki mælt hlutfall af íslenskum lögum."
      en: "How much law Iceland already adopts via the EEA is unsettled: EFTA counts about 5,000 acts in force today (of more than 9,500 ever incorporated). The popular 'two-thirds' figure is a contested estimate (attributed to Olli Rehn) of acquis uptake — not a measured share of Icelandic law."
    confidence: medium
    sources:
      - title: "EEA-Lex (EU acts incorporated into the EEA Agreement)"
        url: "https://www.efta.int/eea-lex"
        publisher: "EFTA"
        tier: primary

calculator: false
basket: false
lastReviewed: 2026-06-18
confidence: high
```

- [ ] **Step 2: Build and verify the chapter renders**

Run: `npm run build`
Expected: PASS, **20 pages** (18 + `/sovereignty/` + `/en/sovereignty/`). Then:

```bash
test -e dist/sovereignty/index.html && echo "OK: /sovereignty"
test -e dist/en/sovereignty/index.html && echo "OK: /en/sovereignty"
grep -q "Fullveldi" dist/sovereignty/index.html && echo "OK: is title"
grep -q "Sovereignty" dist/en/sovereignty/index.html && echo "OK: en title"
grep -q "0.08" dist/en/sovereignty/index.html && echo "OK: 0.08% present in losses"
grep -c 'class="chip"' dist/en/sovereignty/index.html
```
Expected: both routes, both titles, the 0.08% line present, and a non-zero chip count.

- [ ] **Step 3: Commit**

```bash
git add src/content/dossiers/sovereignty.yaml
git commit -m "feat(content): add Sovereignty chapter (order 6)

From the verified sovereignty research: EEA rule-taker vs member with a vote;
balanced ledger (vote/over-representation/veto/shelter vs ~0.08% tiny weight/
double-challenge/transfer-of-sovereignty); constitutional amendment question +
primacy debate + EEA-law-share as uncertain. ~6 MEPs flagged as modelled;
Icesave-won caveat; in-force constitution only (no 2011 draft). Icelandic
AI-draft -> Nina review.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Renumber `security-energy.yaml` to keep the Home list contiguous

**Files:**
- Modify: `src/content/dossiers/security-energy.yaml` (`order: 6 → 7`)

**Interfaces:**
- Consumes: sovereignty at `order: 6` (Task 1). Produces contiguous Home ordering `01 … 06 Fullveldi · 07 Öryggi og orka`.

- [ ] **Step 1: Change the order value**

In `src/content/dossiers/security-energy.yaml`, change the top-of-file `order: 6` → `order: 7`. Change nothing else.

- [ ] **Step 2: Build and verify contiguous numbering**

Run: `npm run build`
Expected: PASS (20 pages). Then:

```bash
grep -oE 'class="num">[0-9]{2}' dist/index.html | sort -u
```
Expected: `01 02 03 04 05 06 07` (exactly seven, contiguous — no gap, no duplicate `06`).

- [ ] **Step 3: Commit**

```bash
git add src/content/dossiers/security-energy.yaml
git commit -m "chore(content): security-energy order 6->7 (sovereignty takes 06)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Full verification + memory update

**Files:**
- Modify: project memory (`review-status.md`, `project-overview.md`) — controller does this.

- [ ] **Step 1: Full build + test**

Run: `npm run build && npm test`
Expected: build green at **20 pages**; Vitest **15/15** (no logic touched).

- [ ] **Step 2: Visual gate (Playwright)**

Navigate the preview build to `/sovereignty/`, `/en/sovereignty/`, and `/` (Home). Confirm: hero (eyebrow "Kafli 06" / "Chapter 06"); today-vs-as-member compare; the balanced gains/losses ledger with the **0.08% line prominent in the losses column**; the uncertain box (constitution / primacy / EEA-law-share); source chips link out; and Home lists `01–07` contiguous with Fullveldi at 06 and Öryggi og orka at 07. (Fonts won't load in the sandbox tool — verify content/layout.)

- [ ] **Step 3: Update memory**

Update `review-status.md` (Sovereignty chapter Icelandic copy is AI-draft → Nína) and `project-overview.md` (Sovereignty built + live; 1 national-half chapter left: Natural resources). Controller task.

---

## Notes for the executor

- **Task order:** Task 1 (sovereignty at order 6) before Task 2 (renumber), so the contiguity check is meaningful.
- **Use the exact URLs in Task 1 verbatim** — from the verified dossier; do not alter or invent.
- **YAML hygiene:** 2-space indent, `>-` folded scalars for prose, preserve curly quotes („ ") and Icelandic characters. (Note: where a YAML double-quoted scalar contains an inner „…" curly pair, the closing quote must be the curly `"` U+201D, not ASCII `"`, or the scalar terminates early — see the `tldr.is` and `today.is` lines.)
- **Do NOT mention the 2011 draft constitution** anywhere — the uncertain point states only that the *in-force* constitution lacks a transfer clause.
- Icelandic prose is AI-draft; structural correctness + accurate sources matter most.
- Single chapter; nothing else touched (no component/schema change).
```
