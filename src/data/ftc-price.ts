import { Cycle, DiscountStatus, OfferKind, PriceKind, Tier } from './enum';
import { MoneyFormat } from './money-parts';
import { ValidPeriod } from './period';
import { PriceFormat } from './price-format';
import { YearMonthDay } from './ymd';

export type UpdatePriceParams = {
  title?: string;
  nickname?: string;
  periodCount: YearMonthDay;
  stripePriceId: string;
};

export type NewPriceParams = {
  tier: Tier;
  cycle?: Cycle;
  kind: PriceKind;
  productId: string;
  unitAmount: number;
  startUtc?: string;
  endUtc?: string;
} & UpdatePriceParams;

/**
 * @description Price determines how much a product cost.
 */
export type Price = {
  id: string;
  active: boolean;
  archived: boolean;
  currency: string;
  createdUtc: string;
  liveMode: boolean;
} & NewPriceParams;

export function ftcPriceFormat(p: Price): PriceFormat {
  return new PriceFormat({
    currency: p.currency,
    amount: p.unitAmount,
    period: p.periodCount,
    recurring: false,
  });
}

export type DiscountParams = Partial<ValidPeriod> & {
  description?: string;
  kind: OfferKind;
  priceOff: number;
  recurring: boolean;
  overridePeriod: YearMonthDay;
  createdBy: string; // Not part of form data.
  priceId: string;
};

export type Discount = {
  id: string;
  liveMode: boolean;
  status: DiscountStatus;
  createdUtc: string;
} & DiscountParams;


export function formatDiscountAmount(d: Discount): string {
  return '-' + new MoneyFormat('cny', d.priceOff).format();
}
