/**
 * Sourced assumptions for the "build your household" calculator.
 *
 * Every number the calculator uses lives here as a {typical, min, max} band with
 * a citation — so the math is auditable, not a black box. Rates are ANNUAL PERCENT.
 * Figures reflect mid-2026; revisit `lastReviewed` in the dossier when rates move.
 *
 * `provisional: true` would mark a figure whose source is still being confirmed; the
 * UI flags those visibly. (None are provisional now — all confirmed with sources.)
 */

export interface Source {
  title: string;
  url: string;
  publisher: string;
}

export interface Assumption {
  typical: number;
  min: number;
  max: number;
  source: Source;
  provisional?: boolean;
}

export const ASSUMPTIONS: Record<string, Assumption> = {
  // 12-month CPI inflation. Band runs from the Central Bank's target (~2.5%) to the
  // current rate (5.1%, May 2026) — i.e. "if inflation settles" vs "if it stays high".
  inflation: {
    typical: 5.1,
    min: 2.5,
    max: 5.1,
    source: {
      title: 'Vísitala neysluverðs í maí 2026 (12-mán. verðbólga 5,1%)',
      url: 'https://hagstofa.is/utgafur/frettasafn/verdlag/visitala-neysluverds-i-mai-2026/',
      publisher: 'Hagstofa Íslands',
    },
  },

  // Indexed (verðtryggt) mortgage REAL rate. Mid-2026 cluster ~4.49–5.25% across banks
  // (e.g. Arion 4.49% variable / 4.64% fixed-3yr, Mar 2026).
  indexedReal: {
    typical: 4.6,
    min: 4.49,
    max: 5.25,
    source: {
      title: 'Bankarnir byrjaðir að hækka vexti (verðtryggðir íbúðalánavextir, mars 2026)',
      url: 'https://www.visir.is/g/20262858896d/bankarnir-byrjadir-ad-haekka-vexti',
      publisher: 'Vísir',
    },
  },

  // Non-indexed (óverðtryggt) ISK mortgage NOMINAL rate. Mid-2026 ~8.75% (fixed 3-yr)
  // to ~9.7% (variable) after the May 2026 policy hike.
  nonIndexedNominal: {
    typical: 9.4,
    min: 8.75,
    max: 9.7,
    source: {
      title: 'Bankarnir byrjaðir að hækka vexti (óverðtryggðir íbúðalánavextir, 2026)',
      url: 'https://www.visir.is/g/20262858896d/bankarnir-byrjadir-ad-haekka-vexti',
      publisher: 'Vísir',
    },
  },

  // Euro-area residential mortgage NOMINAL rate (new housing loans to households).
  // ECB composite cost-of-borrowing ~3.44%, by fixation 3.31–3.61% (April 2026).
  euroNominal: {
    typical: 3.44,
    min: 3.31,
    max: 3.61,
    source: {
      title: 'Euro area bank interest rate statistics: April 2026 (housing loans)',
      url: 'https://www.ecb.europa.eu/press/stats/mfi/html/ecb.mir2606~2665fb5ea4.en.html',
      publisher: 'European Central Bank',
    },
  },
};

/** Household presets — set a typical loan size + term. Custom keeps current values. */
export interface Preset {
  key: string;
  amount: number; // ISK
  term: number; // years
}

export const PRESETS: Preset[] = [
  { key: 'alone', amount: 38_000_000, term: 30 },
  { key: 'couple', amount: 60_000_000, term: 30 },
  { key: 'family', amount: 85_000_000, term: 30 },
];
