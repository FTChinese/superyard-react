import { Cycle, DiscountStatus, OfferKind, PriceKind, Tier } from './enum';
import { ISOPeriod, YearMonthDay } from './period';

export type UpdatePriceParams = {
  description?: string;
  nickname?: string;
  stripePriceId: string;
};

export type NewPriceParams = {
  tier: Tier;
  cycle?: Cycle;
  kind: PriceKind;
  periodCount: YearMonthDay;
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

export type DiscountParams = Partial<ISOPeriod> & {
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
