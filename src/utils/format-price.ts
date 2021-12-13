import { localizedCycle } from '../data/localization';
import { Price } from '../data/price';

export function formatMoney(currency: string, amount: number): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency.toUpperCase(),
    currencyDisplay: 'narrowSymbol',
  })
  .format(amount);
};

export function formatPrice(p: Price): string {
  if (!p.cycle) {
    return formatMoney(p.currency, p.unitAmount);
  }

  return `${formatMoney(p.currency, p.unitAmount)}/${localizedCycle(p.cycle)}`;
};
