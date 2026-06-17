import { describe, it, expect } from 'vitest';
import { basketTotal, shareOfWagePct, protectedCount, type BasketItem } from './basket-math';

const items: BasketItem[] = [
  { id: 'milk', priceISK: 379, protection: 'protected' },
  { id: 'pasta', priceISK: 350, protection: 'free' },
  { id: 'tomato', priceISK: 700, protection: 'seasonal' },
];

describe('basketTotal', () => {
  it('sums price × quantity', () => {
    expect(basketTotal(items, { milk: 2, pasta: 1, tomato: 1 })).toBe(379 * 2 + 350 + 700);
  });
  it('treats a missing quantity as zero', () => {
    expect(basketTotal(items, { milk: 1 })).toBe(379);
  });
});

describe('shareOfWagePct', () => {
  it('expresses total as a percent of monthly wage', () => {
    expect(shareOfWagePct(8260, 826000)).toBeCloseTo(1, 5);
  });
  it('returns 0 when wage is 0 (no divide-by-zero)', () => {
    expect(shareOfWagePct(1000, 0)).toBe(0);
  });
});

describe('protectedCount', () => {
  it('counts protected and seasonal items, not free ones', () => {
    expect(protectedCount(items)).toBe(2);
  });
});

describe('module is intentionally forecast-free', () => {
  it('exports no price-prediction / reduction function', async () => {
    const mod = await import('./basket-math');
    for (const k of Object.keys(mod)) {
      expect(/reduc|forecast|withEu|predict|after/i.test(k)).toBe(false);
    }
  });
});
