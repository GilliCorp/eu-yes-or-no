export type LoanKind = 'indexed' | 'nonindexed' | 'euro';

export interface Band { min: number; typ: number; max: number }
export interface Range { lo: number; typ: number; hi: number }

export interface LoanResult {
  kind: LoanKind;
  monthlyStart: Range;       // month-1 nominal payment
  monthlyAfter10: Range | null; // indexed only
  totalNominal: Range;       // sum of nominal payments over the term
  totalReal: Range;          // total discounted to today's krónur
  principal: number;
  interestReal: Range;       // totalReal - principal
}

/** Standard annuity: fixed monthly payment for `principal` at `annualRatePct` over `years`. */
export function annuity(principal: number, annualRatePct: number, years: number): number {
  const n = years * 12;
  if (n <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  return r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));
}

/** Simulate one loan at a fixed rate + inflation; returns nominal + real totals and start/10yr payment. */
function simulate(
  kind: LoanKind,
  principal: number,
  years: number,
  ratePct: number,
  inflPct: number,
): { totalNominal: number; totalReal: number; monthlyStart: number; monthlyAfter10: number } {
  const months = years * 12;
  const inflM = Math.pow(1 + inflPct / 100, 1 / 12) - 1;
  const basePay = annuity(principal, ratePct, years); // indexed: real annuity; others: nominal flat
  let totalNominal = 0;
  let totalReal = 0;
  for (let m = 1; m <= months; m++) {
    const nominalPay = kind === 'indexed' ? basePay * Math.pow(1 + inflM, m) : basePay;
    totalNominal += nominalPay;
    totalReal += nominalPay / Math.pow(1 + inflM, m);
  }
  const monthlyStart = kind === 'indexed' ? basePay : basePay; // year-0 price level
  const monthlyAfter10 = basePay * Math.pow(1 + (kind === 'indexed' ? inflPct / 100 : 0), 10);
  return { totalNominal, totalReal, monthlyStart, monthlyAfter10 };
}

/** Evaluate a metric across the rate×inflation uncertainty corners → {lo, typ, hi}. */
function bandOf(
  pick: (rate: number, infl: number) => number,
  rate: Band,
  inflation: Band,
): Range {
  const corners = [
    pick(rate.min, inflation.min), pick(rate.min, inflation.max),
    pick(rate.max, inflation.min), pick(rate.max, inflation.max),
  ];
  return { lo: Math.min(...corners), typ: pick(rate.typ, inflation.typ), hi: Math.max(...corners) };
}

export function computeLoan(
  kind: LoanKind,
  principal: number,
  years: number,
  rate: Band,
  inflation: Band,
): LoanResult {
  const sim = (r: number, i: number) => simulate(kind, principal, years, r, i);
  const totalNominal = bandOf((r, i) => sim(r, i).totalNominal, rate, inflation);
  const totalReal = bandOf((r, i) => sim(r, i).totalReal, rate, inflation);
  const monthlyStart = bandOf((r, i) => sim(r, i).monthlyStart, rate, inflation);
  const monthlyAfter10 =
    kind === 'indexed' ? bandOf((r, i) => sim(r, i).monthlyAfter10, rate, inflation) : null;
  const interestReal: Range = {
    lo: totalReal.lo - principal,
    typ: totalReal.typ - principal,
    hi: totalReal.hi - principal,
  };
  return { kind, monthlyStart, monthlyAfter10, totalNominal, totalReal, principal, interestReal };
}
