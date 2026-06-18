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
    is: 'Ísland er nú þegar um tveir þriðju „inni" í ESB gegnum EES-samninginn. Þjóðaratkvæðagreiðslan snýst aðeins um hvort hefja eigi viðræður á ný — ekki um aðild sjálfa.',
    en: 'Iceland is already about two-thirds "in" the EU through the EEA Agreement. The referendum is only about whether to reopen talks — not about membership itself.',
  },
  {
    is: 'Að „kíkja í pakkann" skuldbindur ekki til neins: hægt er að ganga frá borði, eins og Ísland gerði 2013–2015. En það sem ekki er í boði er að velja úr reglubókinni — aðild þýðir að taka upp regluverk ESB í heild. Varanlegar sérlausnir eru til, en sjaldgæfar og þröngar.',
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
        text: { is: 'Ekkert verður bindandi fyrr en fullgerður aðildarsamningur er undirritaður og fullgiltur af öllum aðildarríkjum og Evrópuþinginu. Kaflarnir sem Ísland „lokaði til bráðabirgða" bundu því ekkert.', en: 'Nothing becomes binding until a complete Accession Treaty is signed and ratified by every member state and the European Parliament. So the chapters Iceland "provisionally closed" bound nothing.' },
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
  { deal: { is: '2004-ríkin — frjáls för launafólks', en: '2004 entrants — free movement of workers' }, instrument: { is: '„2+3+2" aðlögun (lauk 2011), aðildarsamningur 2003', en: '"2+3+2" transition (ended 2011), 2003 Act of Accession' }, permanence: 'temporary', sources: [ACT_2003] },
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
