import { Tier } from './enum';
import { ValidPeriod } from './period';
import { Discount, Price } from './price';
import { StripePrice } from './stripe-price';

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

export type Promo = Banner & ValidPeriod;

export type PromoParams =  BannerParams & ValidPeriod;

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
}

export type NewProductParams = {
  tier: Tier;
  createdBy: string;
} & UpdateProductParams;

export type AttachIntroParams = {
  priceId: string;
};

export type Product = {
  id: string;
  active: boolean;
  liveMode: boolean;
  introductory?: Price;
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

