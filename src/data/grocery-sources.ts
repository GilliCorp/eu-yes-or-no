export interface GrocerySource { label: { is: string; en: string }; url: string; }

// Survey / statistics sources for verifying real prices — NOT retail stores.
export const GROCERY_SOURCES: GrocerySource[] = [
  { label: { is: 'Eurostat — verðlag eftir löndum', en: 'Eurostat — comparative price levels' }, url: 'https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Comparative_price_levels_for_food%2C_beverages_and_tobacco' },
  { label: { is: 'ASÍ verðsjá — verð í íslenskum verslunum', en: 'ASÍ price monitor — Icelandic store prices' }, url: 'https://verdsja.is/' },
  { label: { is: 'Hagstofa — verðlag', en: 'Statistics Iceland — prices' }, url: 'https://hagstofa.is/talnaefni/efnahagur/verdlag/' },
];
