import { Cycle, DiscountStatus, OfferKind, PriceKind, SelectOption, Tier } from './enum';
import { formatMoney, newMoneyParts, PriceParts } from './localization';
import { ValidPeriod } from './period';
import { formatEdition, formatYMD, YearMonthDay } from './ymd';

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

export function priceSelectOption(p: Price): SelectOption<string> {
  return {
    disabled: false,
    name: formatEdition(p.tier, p.periodCount),
    value: p.id
  }
}

export function newFtcPriceParts(price: Price): PriceParts {
  return {
    ...newMoneyParts(
      price.currency,
      price.unitAmount
    ),
    cycle: '/' + formatYMD(price.periodCount, false),
  };
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
  return '-' + formatMoney('cny', d.priceOff);
}
