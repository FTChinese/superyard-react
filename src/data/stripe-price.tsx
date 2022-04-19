import { DiscountStatus, PriceKind, Tier } from './enum';
import { newMoneyParts, PriceParts } from './money-parts';
import { formatPeriods, YearMonthDay } from './period';

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

export function newStripePriceParts(sp: StripePrice): PriceParts {
  return {
    ...newMoneyParts(
      sp.currency,
      sp.unitAmount / 100,
    ),
    cycle: '/' + formatPeriods(sp.periodCount, true)
  }
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
}
