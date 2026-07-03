import type { Moneda } from '../types-internacional';

const SYMBOL: Record<Moneda, string> = { EUR: '€', GBP: '£', USD: '$' };
const LOCALE: Record<Moneda, string> = { EUR: 'es-ES', GBP: 'en-GB', USD: 'en-US' };

export function formatMoney(amount: number | null, moneda: Moneda): string {
  if (amount === null) return 'No informado';
  return `${SYMBOL[moneda]}${amount.toLocaleString(LOCALE[moneda])}`;
}

export function formatMoneyShort(amount: number, moneda: Moneda): string {
  return `${SYMBOL[moneda]}${(amount / 1000).toFixed(1)}k`;
}
