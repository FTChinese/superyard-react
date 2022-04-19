import { DiscountStatus, PriceKind, Tier } from './enum';
import { YearMonthDay } from './period';
import { PriceFormat } from './price-format';

export type StripePrice = {
  id: string;
  active: boolean;
  currency: string;
  isIntroductory: boolean;
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

export function stripePriceFormat(sp: StripePrice): PriceFormat {
  return new PriceFormat({
    currency: sp.currency,
    amount: sp.unitAmount / 100,
    period: sp.periodCount,
    recurring: true,
  });
}

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
  redeemeBy: number;
  status: DiscountStatus
};
