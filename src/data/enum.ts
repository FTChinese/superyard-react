export type LoginMethod = 'email' | 'mobile' | 'wechat';
export type PaymentMethod = 'alipay' | 'wechat' | 'stripe' | 'apple' | 'b2b';
export type Tier = 'standard' | 'premium';
export type Cycle = 'month' | 'year';
export type Gender = 'M' | 'F';
export type Platform = 'web' | 'ios' | 'android';
export type SubStatus = 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
export type OrderKind = 'create' | 'renew' | 'upgrade' | 'downgrade' | 'add_on';
export type AccountKind = 'ftc' | 'mobile' | 'wechat' | 'linked';
export type PriceSource = 'ftc' | 'stripe';
export type OfferKind = 'promotion' | 'retention' | 'win_back' | 'introductory';
export type DiscountStatus = 'active' | 'paused' | 'cancelled';
export type WxOAuthKind = 'login' | 'link';
export type WxUnlinkAnchor = 'ftc' | 'wechat';

export const tiers: Tier[] = ['standard', 'premium'];
export const cycles: Cycle[] = ['month', 'year'];

export function isInvalidSubStatus(s: SubStatus): boolean {
  if (s === 'incomplete_expired' || s === 'past_due' || s === 'unpaid') {
    return true;
  }

  return false;
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
