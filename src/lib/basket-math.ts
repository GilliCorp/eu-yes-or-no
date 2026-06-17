export type Protection = 'protected' | 'free' | 'seasonal';

/** Minimal shape the math needs; the full data record in basket.ts is compatible. */
export interface BasketItem {
  id: string;
  priceISK: number;
  protection: Protection;
}

/** Sum of price × quantity. Missing quantity = 0. No forecasting — current prices only. */
export function basketTotal(items: BasketItem[], qty: Record<string, number>): number {
  return items.reduce((sum, it) => sum + it.priceISK * (qty[it.id] ?? 0), 0);
}

/** Basket total as a percent of the monthly wage. 0 if wage is 0. */
export function shareOfWagePct(total: number, monthlyWage: number): number {
  return monthlyWage > 0 ? (total / monthlyWage) * 100 : 0;
}

/** How many items are tariff-affected (protected or seasonally protected). */
export function protectedCount(items: BasketItem[]): number {
  return items.filter((it) => it.protection !== 'free').length;
}
