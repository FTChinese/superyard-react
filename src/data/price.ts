import { Edition } from './edition';
import { DiscountStatus, OfferKind } from './enum';

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

export type DiscountParams = {
  createdBy: string; // Not part of form data.
  description?: string;
  kind: OfferKind;
  startUtc?: string;
  endUtc?: string;
  priceOff: number;
  priceId: string;
  recurring: boolean;
};

export type Discount = {
  id: string;
  liveMode: boolean;
  status: DiscountStatus;
  createdUtc: string;
} & DiscountParams;
