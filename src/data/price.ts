import { Edition } from './edition';
import { DiscountStatus, OfferKind } from './enum';
import { ISOPeriod, YearMonthDay } from './period';

export type UpdatePriceParams = {
  stripePriceId: string;
  nickname?: string;
  description?: string;
};

export type NewPriceParams = Edition & {
  productId: string;
  createdBy: string; // Not part of form data.
  unitAmount: number;
} & UpdatePriceParams;

/**
 * @description Price determines how much a product cost.
 */
export type Price = NewPriceParams & {
  id: string;
  active: boolean;
  archived: boolean;
  currency: string;
  createdUtc: string;
  liveMode: boolean;
};

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
