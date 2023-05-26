import { DiscountStatus, isRecurring, PriceKind, Tier } from './enum';
import { formatMoney, newMoneyParts, PriceParts } from './localization';
import { formatYMD, YearMonthDay } from './ymd';

export type StripePrice = {
  id: string;
  active: boolean;
  currency: string;
  kind: PriceKind;
  liveMode: boolean;
  nickname: string;
  productId: string;
  periodCount: YearMonthDay;
  tier: Tier;
  unitAmount: number;
  startUtc?: string;
  endUtc?: string;
  created: number;
};

export function newStripePriceParts(
  sp: StripePrice, // Either trial or recurring price.
): PriceParts {

  return {
    ...newMoneyParts(
      sp.currency,
      sp.unitAmount / 100,
    ),
    cycle: '/' + formatYMD(sp.periodCount, isRecurring(sp.kind)),
  };
}

export type StripePriceParams = {
  introductory: boolean;
  tier: Tier;
  periodCount?: YearMonthDay; // Only required for intro price
  startUtc?: string; // Only for intro price
  endUtc?: string; // Only for intro price.
};

export type CouponParams = {
  priceId: string;
  startUtc: string;
  endUtc: string;
};

export type StripeCoupon = {
  id: string;
  amountOff: number;
  created: number;
  currency: string;
  duration?: string;
  endUtc?: string;
  liveMode: boolean;
  name: string;
  priceId?: string;
  startUtc?: string;
  redeemBy: number;
  status: DiscountStatus
};

export function formatCouponAmount(c: StripeCoupon): string {
  return '-' + formatMoney(c.currency, c.amountOff / 100);
}

export type StripePaywallItem = {
  price: StripePrice;
  coupons: StripeCoupon[];
}
