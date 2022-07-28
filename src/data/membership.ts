import { getDate, getMonth, getYear, parseISO } from 'date-fns';
import { isExpired } from '../utils/now';
import { Cycle, OrderKind, PaymentKind, SubStatus, Tier } from './enum';
import { Edition } from './edition';

export type Membership =  {
  ftcId?: string;
  unionId?: string;
  tier?: Tier;
  cycle?: Cycle;
  expireDate?: string;
  payMethod?: PaymentKind;
  ftcPlanId?: string;
  stripeSubsId?: string;
  autoRenew: boolean;
  status?: SubStatus;
  appleSubsId?: string;
  b2bLicenceId?: string;
  standardAddOn: number;
  premiumAddOn: number;
  vip: boolean;
}

export class MemberParsed {

  readonly ftcId?: string;
  readonly unionId?: string;
  readonly tier?: Tier;
  readonly cycle?: Cycle;
  readonly expireDate?: Date;
  readonly payMethod?: PaymentKind;
  readonly stripeSubsId?: string;
  readonly autoRenew: boolean = false;
  readonly status?: SubStatus;
  readonly appleSubsId?: string;
  readonly b2bLicenceId?: string;
  readonly standardAddOn: number = 0;
  readonly premiumAddOn: number = 0;
  readonly vip: boolean = false;

  constructor(m?: Membership) {
    if (m) {
      this.ftcId = m.ftcId;
      this.unionId = m.unionId;
      this.tier = m.tier;
      this.cycle = m.cycle;
      if (m.expireDate) {
        this.expireDate = parseISO(m.expireDate);
      }
      this.payMethod = m.payMethod;
      this.stripeSubsId = m.stripeSubsId;
      this.autoRenew = m.autoRenew;
      this.status = m.status;
      this.appleSubsId = m.appleSubsId;
      this.b2bLicenceId = m.b2bLicenceId;
      this.standardAddOn = m.standardAddOn;
      this.premiumAddOn = m.premiumAddOn;
      this.vip = m.vip;
    }
  }

  isStripe(): boolean {
    return this.payMethod === 'stripe' && !!this.stripeSubsId
  }

  autoRenewMoment(): AutoRenewMoment | null {
    if (!this.expireDate) {
      return null;
    }

    if (!this.cycle) {
      return null;
    }

    return {
      year: `${getYear(this.expireDate)}`,
      month: `${getMonth(this.expireDate)}`,
      date: `${getDate(this.expireDate)}`,
      cycle: this.cycle,
    };
  }

  normalizePayMethod(): PaymentKind | undefined {
    if (this.payMethod) {
      return this.payMethod;
    }

    if (this.tier) {
      return 'alipay';
    }

    return undefined;
  }

  isZero(): boolean {
    return this.tier == null && !this.vip;
  }

  isExpired(): boolean {
    if (!this.expireDate) {
      return true;
    }

    return isExpired(this.expireDate) && !this.autoRenew;
  }

  isOneOff(): boolean {
    return this.payMethod === 'alipay' || this.payMethod === 'wechat';
  }

  isSubs(): boolean {
    return this.payMethod === 'stripe' || this.payMethod === 'apple';
  }

  isStripeRenewOn(): boolean {
    return this.payMethod === 'stripe' && this.autoRenew
  }

  isStripeCancelled(): boolean {
    return this.payMethod === 'stripe' && !this.autoRenew && !this.isExpired();
  }

  /**
   * @description Manipulate addon
   */
  hasAddOn(): boolean {
    return this.standardAddOn > 0 || this.premiumAddOn > 0;
  }

  isConvertableToAddOn(): boolean {
    return this.isOneOff() && !this.isExpired;
  }
}

export type AutoRenewMoment = {
  year: string;
  month: string;
  date: string;
  cycle: Cycle;
};

export type UpdateMemberParams = {
  priceId: string;
  expireDate: string; // ISO year-month-date format.
  payMethod: PaymentKind; // Only alipay/wxpay.
}

export type CreateMemberParams = {
  // One of ftcId or unionId must exists.
  ftcId?: string;
  unionId?: string;
} & UpdateMemberParams

export interface Invoice extends Edition {
  id: string;
  compoundId: string;
  years: number;
  months: number;
  days: number;
  addOnSource: 'carry_over' | 'compensation' | 'user_purchase';
  appleTxId: string | null;
  orderId: string | null;
  orderKind: OrderKind;
  paidAmount: number;
  priceId: string | null;
  stripeSubsId: string | null;
  createdUtc: string | null;
  consumedUtc: string | null;
  startUtc: string | null;
  endUtc: string | null;
  carriedOverUtc: string | null;
}
