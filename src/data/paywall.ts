import { SelectOption, Tier } from './enum';
import { ValidPeriod } from './period';
import { Discount, Price, priceSelectOption } from './ftc-price';
import { StripePaywallItem } from './stripe-price';

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
  introductory?: Price; // Deprecated
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
  ftcPrices: PaywallPrice[];
  stripe: StripePaywallItem[];
};

/**
 * @description Build a list of option items for <select> element when creating a membership.
 */
export function buildPriceOptions(products: PaywallProduct[]): SelectOption<string>[] {
  return products
    .flatMap(prod => prod.prices.map(p => priceSelectOption(p)))
}

/**
 * @description Describes the structure of ui.
 */
export type ProductItem = {
  product: Product;
  ftcPrices: PaywallPrice[];
  stripePrices: StripePaywallItem[];
}

export function collectProductItems(pw: Paywall): ProductItem[] {
  const ftcGroup = new Map<string, PaywallPrice[]>()
  console.log(pw.ftcPrices);
  for (let price of pw.ftcPrices) {
    const items = ftcGroup.get(price.tier);
    if (!items) {
      ftcGroup.set(price.tier, [price])
    } else {
      items.push(price)
    }
  }
  console.log(ftcGroup);

  const stripeGroup = new Map<string, StripePaywallItem[]>();
  for (let item of pw.stripe) {
    const items = stripeGroup.get(item.price.tier)
    if (!items) {
      stripeGroup.set(item.price.tier, [item]);
    } else {
      items.push(item);
    }
  }

  return pw.products.map<ProductItem>(prod => {
    return {
      product: prod,
      ftcPrices: ftcGroup.get(prod.tier) || [],
      stripePrices: stripeGroup.get(prod.tier) || [],
    };
  });
}
