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
        is: 'Ísland er nú þegar um tveir þriðju „inni" í Evrópusambandinu gegnum EES-samninginn og Schengen. Spurningin er því ekki „ESB eða ekkert" — heldur hvað raunverulega breytist ef við göngum alla leið.',
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
