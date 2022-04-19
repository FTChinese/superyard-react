import { MoneyFormat, MoneyParts } from './money-parts';
import { formatPeriods, YearMonthDay } from './period';

export type PriceParts = MoneyParts & {
  cycle: string;
}

type PriceFormatParams = {
  currency: string;
  amount: number;
  period: YearMonthDay;
  recurring: boolean;
}

export class PriceFormat {
  constructor(private params: PriceFormatParams) {}

  private get formatCycle(): string {
    return '/' + formatPeriods(this.params.period, this.params.recurring)
  }

  formatToParts(): PriceParts {
    const parts = new MoneyFormat(
        this.params.currency,
        this.params.amount
      )
      .formatToParts();

    return {
      ...parts,
      cycle: this.formatCycle
    }
  }

  format(): string {
    const money = new MoneyFormat(
        this.params.currency,
        this.params.amount
      )
      .format();

    return `${money}/${formatPeriods(this.params.period, this.params.recurring)}`;
  }
}
