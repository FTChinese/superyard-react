import { localizedCycle, localizedTier } from '../data/localization';
import { Price } from '../data/price';

export function formatMoney(currency: string, amount: number): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency.toUpperCase(),
    currencyDisplay: 'narrowSymbol',
  })
  .format(amount);
}

export function formatPrice(p: Price): string {
  return `${formatMoney(p.currency, p.unitAmount)}/${localizedCycle(p.cycle)}`;
}

export function formatProductPrice(p: Price): string {
  const c = formatMoney(p.currency, p.unitAmount);

  return `${localizedTier(p.tier)} ${c}/${localizedCycle(p.cycle)}`;
}
