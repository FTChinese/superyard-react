import { Edition } from './edition';
import { DiscountStatus, OfferKind } from './enum';

export type PriceUpdateParams = {
  description?: string;
  nickname: string | null;
  stripePriceId: string;
};

export type PriceCreationParams = PriceUpdateParams & Edition & {
  createdBy: string; // Not part of form data.
  productId: string;
  unitAmount: number;
};

/**
 * @description Price determines how much a product cost.
 */
export type Price = PriceCreationParams & {
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
