import type { BasketItem } from '../lib/basket-math';

export interface Source { title: string; url: string; publisher: string; }

export interface BasketDataItem extends BasketItem {
  name: { is: string; en: string };
  unit: { is: string; en: string };
  defaultQty: number;
  provenance: 'domestic' | 'imported' | 'mixed';
  tariffNote?: { is: string; en: string }; // shown only for protected/seasonal
  approx?: boolean; // price is approximate → UI prefixes "~"
  source: Source;
}

// Prices: mid-2026 snapshot (see docs/research/grocery-basket-data.md). All ISK.
export const SNAPSHOT_DATE = { is: 'júní 2026', en: 'June 2026' };

export const BASKET_ITEMS: BasketDataItem[] = [
  { id: 'milk', name: { is: 'Nýmjólk', en: 'Whole milk' }, unit: { is: '1 L', en: '1 L' }, priceISK: 379, defaultQty: 4, provenance: 'domestic', protection: 'protected', tariffNote: { is: 'mjólkurtollur ~73%', en: 'dairy tariff ~73%' }, source: { title: 'MS G-mjólk 3,9% 1L', url: 'https://www.neytandinn.is/i/sku/uid-d85dd71b-abaf-4fe0-9543-d7f9981ad757', publisher: 'Neytandinn' } },
  { id: 'skyr', name: { is: 'Skyr', en: 'Skyr' }, unit: { is: '500 g', en: '500 g' }, priceISK: 499, defaultQty: 2, provenance: 'domestic', protection: 'protected', tariffNote: { is: 'mjólkurtollur ~73%', en: 'dairy tariff ~73%' }, source: { title: 'Ísey skyr hreint 500g', url: 'https://kronan.is/vara/100026593-isey-skyr-hreint-500g', publisher: 'Krónan' } },
  { id: 'butter', name: { is: 'Smjör', en: 'Butter' }, unit: { is: '500 g', en: '500 g' }, priceISK: 848, defaultQty: 1, provenance: 'domestic', protection: 'protected', tariffNote: { is: 'mjólkurtollur ~73%', en: 'dairy tariff ~73%' }, source: { title: 'Íslenskt smjör 500g', url: 'https://www.neytandinn.is/i/sku/id-1000057', publisher: 'Neytandinn' } },
  { id: 'cheese', name: { is: 'Ostur (gouda)', en: 'Cheese (gouda)' }, unit: { is: 'kg', en: 'kg' }, priceISK: 2510, defaultQty: 1, provenance: 'domestic', protection: 'protected', tariffNote: { is: 'mjólkurtollur ~73%', en: 'dairy tariff ~73%' }, source: { title: 'MS Gouda mildur 26% (per kg)', url: 'https://kronan.is/vara/100248831-ms-gouda-mildur-26-700gr', publisher: 'Krónan' } },
  { id: 'eggs', name: { is: 'Egg', en: 'Eggs' }, unit: { is: '12 stk', en: '12' }, priceISK: 795, defaultQty: 1, provenance: 'domestic', protection: 'protected', tariffNote: { is: 'eggjatollur ~30%', en: 'egg tariff ~30%' }, source: { title: 'Stjörnuegg meðalstór 12 stk', url: 'https://kronan.is/vara/100218854-stjornuegg-medalstor-brun-egg-12-stk', publisher: 'Krónan' } },
  { id: 'chicken', name: { is: 'Kjúklingabringur', en: 'Chicken breast' }, unit: { is: 'kg', en: 'kg' }, priceISK: 2769, defaultQty: 1, provenance: 'domestic', protection: 'protected', tariffNote: { is: 'kjöttollur ~62–67%', en: 'meat tariff ~62–67%' }, source: { title: 'Ódýrt kjúklingabringur (per kg)', url: 'https://kronan.is/vara/100244878-odyrt-kjuklingabringur', publisher: 'Krónan' } },
  { id: 'beef', name: { is: 'Nautahakk', en: 'Beef mince' }, unit: { is: 'kg', en: 'kg' }, priceISK: 3398, defaultQty: 1, provenance: 'mixed', protection: 'protected', tariffNote: { is: 'kjöttollur ~62–67%', en: 'meat tariff ~62–67%' }, source: { title: 'Ódýrt ungnautahakk (per kg)', url: 'https://kronan.is/vara/100249028-odyrt-ungnautahakk', publisher: 'Krónan' } },
  { id: 'lamb', name: { is: 'Lambalæri', en: 'Leg of lamb' }, unit: { is: 'kg', en: 'kg' }, priceISK: 2699, defaultQty: 1, provenance: 'domestic', protection: 'protected', tariffNote: { is: 'kjöttollur ~62–67%', en: 'meat tariff ~62–67%' }, source: { title: 'Góða lambalæri frosið (per kg)', url: 'https://kronan.is/vara/100132054-goda-lambalaeri-frosid', publisher: 'Krónan' } },
  { id: 'bread', name: { is: 'Brauð', en: 'Bread' }, unit: { is: 'hleifur', en: 'loaf' }, priceISK: 337, defaultQty: 2, provenance: 'domestic', protection: 'free', source: { title: 'Myllan heimilisbrauð 385g', url: 'https://www.neytandinn.is/i/sku/uid-975f5884-a49d-4a8d-bc93-3cb49d82260c', publisher: 'Neytandinn' } },
  { id: 'pasta', name: { is: 'Pasta', en: 'Pasta' }, unit: { is: '500 g', en: '500 g' }, priceISK: 350, defaultQty: 2, provenance: 'imported', protection: 'free', approx: true, source: { title: 'Bónus verðlisti 2026 (pasta 500g)', url: 'https://gonow.is/bonus-grocery-store-iceland/', publisher: 'gonow.is' } },
  { id: 'rice', name: { is: 'Hrísgrjón', en: 'Rice' }, unit: { is: 'kg', en: 'kg' }, priceISK: 380, defaultQty: 1, provenance: 'imported', protection: 'free', source: { title: 'First Price hrísgrjón (per kg)', url: 'https://kronan.is/vara/100179739-first-price-hrisgrjon-i-sudupoka', publisher: 'Krónan' } },
  { id: 'bananas', name: { is: 'Bananar', en: 'Bananas' }, unit: { is: 'kg', en: 'kg' }, priceISK: 338, defaultQty: 1, provenance: 'imported', protection: 'free', source: { title: 'Bananar (per kg)', url: 'https://kronan.is/vara/100253786-bananar', publisher: 'Krónan' } },
  { id: 'apples', name: { is: 'Epli', en: 'Apples' }, unit: { is: 'kg', en: 'kg' }, priceISK: 413, defaultQty: 1, provenance: 'imported', protection: 'free', source: { title: 'Epli rauð (per kg)', url: 'https://kronan.is/vara/100253421-epli-raud', publisher: 'Krónan' } },
  { id: 'tomatoes', name: { is: 'Tómatar', en: 'Tomatoes' }, unit: { is: 'kg', en: 'kg' }, priceISK: 700, defaultQty: 1, provenance: 'mixed', protection: 'seasonal', tariffNote: { is: 'árstíðabundinn tollur', en: 'seasonal tariff' }, approx: true, source: { title: 'Food prices Iceland (tomatoes /kg)', url: 'https://www.numbeo.com/food-prices/country_result.jsp?country=Iceland', publisher: 'Numbeo' } },
  { id: 'coffee', name: { is: 'Kaffi', en: 'Ground coffee' }, unit: { is: '400 g', en: '400 g' }, priceISK: 1350, defaultQty: 1, provenance: 'imported', protection: 'free', source: { title: 'Kaffitár Morgundögg 400g', url: 'https://kronan.is/vara/100222206-kaffitar-morgundogg', publisher: 'Krónan' } },
];

// Median full-time regular monthly wages, 2025. NOT household-disposable income.
export const MEDIAN_WAGE_ISK = 826000;
export const WAGE_SOURCE: Source = {
  title: 'Dreifing launa á íslenskum vinnumarkaði 2025 (miðgildi reglulegra heildarlauna, fullt starf)',
  url: 'https://hagstofa.is/utgafur/frettasafn/laun-og-tekjur/dreifing-launa-a-islenskum-vinnumarkadi-2025/',
  publisher: 'Hagstofa Íslands',
};
