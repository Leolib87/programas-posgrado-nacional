import type { Moneda } from '../types-internacional';

// Tasas aproximadas, solo para poder comparar/filtrar costos entre monedas — no son un tipo de cambio oficial.
const RATE_TO_USD: Record<Moneda, number> = { EUR: 1.08, GBP: 1.27, USD: 1 };

export function toUsdApprox(amount: number, moneda: Moneda): number {
  return Math.round(amount * RATE_TO_USD[moneda]);
}
