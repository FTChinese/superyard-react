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

function convertProduct(prod: PaywallProduct, stripeCollection: Map<string, StripePaywallItem>): ProductItem {
  const ftcPrices: PaywallPrice[] = prod.introductory
    ? [
      {
        ...prod.introductory,
        offers: []
      },
      ...prod.prices
    ]
    : prod.prices;

  const stripeItems: StripePaywallItem[] = [];

  ftcPrices.forEach(ftcPrice => {
    const sp = stripeCollection.get(ftcPrice.stripePriceId);
    if (sp) {
      stripeItems.push(sp);
    }
  });

  return {
    product: prod,
    ftcPrices,
    stripePrices: stripeItems,
  }
}

export function collectProductItems(pw: Paywall): ProductItem[] {
  const indexedStripePrices = pw.stripe.reduce((prev, curr) => {
    prev.set(curr.price.id, curr);
    return prev;
  }, new Map<string, StripePaywallItem>());

  return pw.products.map<ProductItem>(prod => convertProduct(prod, indexedStripePrices))
}
