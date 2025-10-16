import { BSParams } from "./types/options";

export function paramsEqual(a: Partial<BSParams>, b: Partial<BSParams>) {
  return (
    a.spot === b.spot &&
    a.strike === b.strike &&
    a.rate === b.rate &&
    a.volatility === b.volatility &&
    a.maturity === b.maturity &&
    a.type === b.type
  );
}