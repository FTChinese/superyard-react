import { MoneyFormat, MoneyParts } from './money-parts';
import { YearMonthDayFormat, YearMonthDay } from './ymd';

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
    return new YearMonthDayFormat(this.params.period)
      .withSeporator()
      .formatToCycle(this.params.recurring);
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

    return `${money}${this.formatCycle}`;
  }
}
