export type LoginMethod = 'email' | 'mobile' | 'wechat';
export type PaymentMethod = 'alipay' | 'wechat' | 'stripe' | 'apple' | 'b2b';
export type Tier = 'standard' | 'premium';
export type Cycle = 'month' | 'year';
export type Gender = 'M' | 'F';
export type Platform = 'web' | 'ios' | 'android';
export type SubStatus = 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
export type OrderKind = 'create' | 'renew' | 'upgrade' | 'downgrade' | 'add_on';
export type AccountKind = 'ftc' | 'mobile' | 'wechat' | 'linked';
export type PriceKind = 'recurring' | 'one_time';
export type OfferKind = 'promotion' | 'retention' | 'win_back' | 'introductory';
export type DiscountStatus = 'active' | 'paused' | 'cancelled';
export type WxOAuthKind = 'login' | 'link';
export type WxUnlinkAnchor = 'ftc' | 'wechat';

export type Direction = 'row' | 'column';

export const tiers: Tier[] = ['standard', 'premium'];
export const cycles: Cycle[] = ['month', 'year'];

export function isInvalidSubStatus(s: SubStatus): boolean {
  if (s === 'incomplete_expired' || s === 'past_due' || s === 'unpaid') {
    return true;
  }

  return false;
}

export function isRecurring(k: PriceKind): boolean {
  return k === 'recurring';
}

export function isOneTime(k: PriceKind): boolean {
  return k === 'one_time';
}
export interface SelectOption<T> {
  disabled: boolean;
  name: string;
  value: T;
}

export const tierOpts: SelectOption<Tier>[] = [
  {
    disabled: false,
    name: 'Standard',
    value: 'standard',
  },
  {
    disabled: false,
    name: 'Premium',
    value: 'premium',
  },
];

export const cycleOpts: SelectOption<Cycle>[] = [
  {
    disabled: false,
    name: 'Year',
    value: 'year',
  },
  {
    disabled: false,
    name: 'Month',
    value: 'month',
  },
];

export const offerKindOpts: SelectOption<OfferKind>[] = [
  {
    disabled: false,
    name: 'Introductory - new subscripiton only',
    value: 'introductory',
  },
  {
    disabled: false,
    name: 'Promotion - applicable to anyone',
    value: 'promotion',
  },
  {
    disabled: false,
    name: 'Retention - valid subscription only',
    value: 'retention',
  },
  {
    disabled: false,
    name: 'Win back - expired subscripiton only',
    value: 'win_back',
  }
];

export const priceKindOpts: SelectOption<PriceKind>[] = [
  {
    disabled: false,
    name: 'Recurring - Regular price',
    value: 'recurring',
  },
  {
    disabled: false,
    name: 'One time - Introductory price',
    value: 'one_time',
  }
];
