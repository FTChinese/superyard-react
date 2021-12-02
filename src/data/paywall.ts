import { Tier } from './enum';
import { ISOPeriod } from './period';
import { Discount, Price } from './price';

export type BannerParams = {
  heading: string;
  subHeading?: string;
  coverUrl?: string;
  content?: string;
  terms?: string;
};

export type Banner = {
  id: string;
} & BannerParams;

export type Promo = Banner & ISOPeriod;

export type PromoParams =  BannerParams & ISOPeriod;

export type PaywallDoc = {
  id: number;
  banner: Banner;
  promo: Promo;
  liveMode: boolean;
  createdUtc?: string;
};

export type UpdateProductParams = {
  description: string;
  heading: string;
  smallPrint?: string;
  introductory: {
    stripePriceId?: string;
  }
}

export type NewProductParams = {
  tier: Tier;
  createdBy: string;
} & UpdateProductParams;

export type Product = {
  id: string;
  active: boolean;
  liveMode: boolean;
  createdUtc: string;
  updatedUtc?: string;
} & NewProductParams;

export type PaywallPrice = Price & {
  offers: Discount[];
};

export type PaywallProduct = Product & {
  prices: PaywallPrice[];
};

export type Paywall = PaywallDoc & {
  products: PaywallProduct[];
};

export type RebuiltResult = {
  paywall: Paywall;
  stripePrices: StripePrice[];
}

export type StripePrice = {
  id: string;
  active: boolean;
  created: number;
  currency: string;
  liveMode: boolean;
  metadata: {
    tier?: Tier;
    periodDays: number;
    introductory: boolean;
    startUtc?: string;
    endUtc?: string;
  }
};
