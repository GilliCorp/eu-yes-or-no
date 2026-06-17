import { describe, it, expect } from 'vitest';
import { annuity, computeLoan, type Band } from './loan-math';

const rate = (min: number, typ: number, max: number): Band => ({ min, typ, max });

describe('annuity', () => {
  it('splits principal evenly at 0% interest', () => {
    expect(annuity(1_200_000, 0, 1)).toBeCloseTo(100_000, 0); // 12 months
  });
  it('is higher than principal/n when rate > 0', () => {
    const p = annuity(10_000_000, 6, 30);
    expect(p).toBeGreaterThan(10_000_000 / 360);
  });
});

describe('computeLoan', () => {
  const P = 40_000_000;
  const infl = rate(2.5, 3.8, 5.1);

  it('non-indexed: nominal total >= real total (discounting reduces real)', () => {
    const r = computeLoan('nonindexed', P, 30, rate(8.75, 9.2, 9.7), infl);
    expect(r.totalNominal.typ).toBeGreaterThan(r.totalReal.typ);
    expect(r.monthlyAfter10).toBeNull();
  });

  it('non-indexed: total nominal equals flat payment times months', () => {
    const r = computeLoan('nonindexed', P, 30, rate(9, 9, 9), rate(0, 0, 0));
    expect(r.totalNominal.typ).toBeCloseTo(r.monthlyStart.typ * 360, -3);
  });

  it('indexed: payment after 10 years exceeds the start payment (grows with inflation)', () => {
    const r = computeLoan('indexed', P, 30, rate(4.49, 4.6, 5.25), infl);
    expect(r.monthlyAfter10!.typ).toBeGreaterThan(r.monthlyStart.typ);
  });

  it('indexed: real total is close to start payment times months (indexation washes out in real terms)', () => {
    const r = computeLoan('indexed', P, 30, rate(4.6, 4.6, 4.6), rate(4, 4, 4));
    expect(r.totalReal.typ).toBeCloseTo(r.monthlyStart.typ * 360, -4);
  });

  it('principal + real interest equals real total', () => {
    const r = computeLoan('euro', P, 30, rate(3.31, 3.44, 3.61), infl);
    expect(r.principal + r.interestReal.typ).toBeCloseTo(r.totalReal.typ, -1);
  });

  it('ranges are ordered lo <= typ <= hi for every figure', () => {
    const r = computeLoan('indexed', P, 30, rate(4.49, 4.6, 5.25), infl);
    for (const k of ['monthlyStart', 'totalNominal', 'totalReal', 'interestReal'] as const) {
      expect(r[k]!.lo).toBeLessThanOrEqual(r[k]!.typ + 1);
      expect(r[k]!.typ).toBeLessThanOrEqual(r[k]!.hi + 1);
    }
  });

  it('euro is cheaper in real terms than non-indexed at the same principal/term', () => {
    const e = computeLoan('euro', P, 30, rate(3.31, 3.44, 3.61), infl);
    const n = computeLoan('nonindexed', P, 30, rate(8.75, 9.2, 9.7), infl);
    expect(e.totalReal.typ).toBeLessThan(n.totalReal.typ);
  });
});
