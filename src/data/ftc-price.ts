import { Cycle, DiscountStatus, OfferKind, PriceKind, SelectOption, Tier } from './enum';
import { formatMoney, newMoneyParts, PriceParts } from './localization';
import { ValidPeriod } from './period';
import { formatEdition, formatYMD, YearMonthDay } from './ymd';

/**
 * UpdatePriceParams contains parameters sent to
 * backend to update an existing price.
 */
export type UpdatePriceParams = {
  title?: string;
  nickname?: string;
  periodCount: YearMonthDay;
};

/**
 * NewPriceParams contains parameters is used to
 * create a new price.
 */
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
 * @description Price is the ftc price.
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

/**
 * newFtcPriceParts decompose an ftc price
 * into various parts so that ui could style
 * them differently.
 */
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
