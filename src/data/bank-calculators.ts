/**
 * Links to banks' OWN live mortgage calculators — so a skeptical reader can
 * check our illustrative numbers against the real thing. Icelandic banks, plus
 * three comparable eurozone countries (so users can try a real euro-loan calc).
 * All verified returning HTTP 200 on 2026-06-17.
 */

export interface BankLink {
  bank: string;
  url: string;
}

export interface EuroBankLink extends BankLink {
  country: { is: string; en: string };
}

export const ICELANDIC_BANKS: BankLink[] = [
  { bank: 'Landsbankinn', url: 'https://www.landsbankinn.is/einstaklingar/lan-og-heimildir/leidin-ad-nyju-heimili' },
  { bank: 'Íslandsbanki', url: 'https://www.islandsbanki.is/is/reiknivel/husnaedislan/husnaedislanareiknivel' },
  { bank: 'Arion banki', url: 'https://www.arionbanki.is/einstaklingar/lan/ibudalan' },
];

export const EUROZONE_BANKS: EuroBankLink[] = [
  { country: { is: 'Írland', en: 'Ireland' }, bank: 'AIB', url: 'https://aib.ie/our-products/mortgages/mortgage-calculator' },
  { country: { is: 'Finnland', en: 'Finland' }, bank: 'Nordea', url: 'https://www.nordea.fi/henkiloasiakkaat/palvelumme/lainat/asuntolainat/mita-asuntolaina-maksaa.html' },
  { country: { is: 'Eistland', en: 'Estonia' }, bank: 'Swedbank', url: 'https://swedbank.ee/private/credit/loans/home/calculator?language=EST' },
];
