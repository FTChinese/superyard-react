import { Tier } from './enum';
import { Discount, Price } from './price';

type Period = {
  startUtc: string;
  endUtc: string;
};

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

export type Promo = Banner & Period;

export type PromoParams =  BannerParams & Period;

export type PaywallDoc = {
  id: number;
  banner: Banner;
  promo: Promo;
  liveMode: boolean;
  createdUtc?: string;
};

export type ProductParams = {
  createdBy: string;
  description: string;
  heading: string;
  smallPrint?: string;
  tier: Tier;
}

export type Product = {
  id: string;
  active: boolean;
  liveMode: boolean;
  createdUtc: string;
  updatedUt?: string;
} & ProductParams;

export type PaywallPrice = Price & {
  offers: Discount[];
};

export type PaywallProduct = Product & {
  prices: PaywallPrice[];
};

export type Paywall = PaywallDoc & {
  products: PaywallProduct[];
};
