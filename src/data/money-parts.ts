/**
 * MoneyParts dissects payment amount so that UI
 * could display each part in different ways.
 */
export type MoneyParts = {
  symbol: string;
  integer: string;
  decimal: string;
};

export class MoneyFormat {
  constructor(
    private currency: string,
    private amount: number,
  ) {}

  formatToParts(): MoneyParts {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: this.currency.toUpperCase(),
      currencyDisplay: 'narrowSymbol',
    })
    .formatToParts(this.amount)
    .reduce<MoneyParts>((prev, curr) => {
      switch (curr.type) {
        case 'currency':
          prev.symbol = curr.value;
          break;

        case 'integer':
          prev.integer += curr.value;
          break;

        case 'decimal':
        case 'fraction':
          prev.decimal += curr.value;
          break;
      }

      return prev;
    }, {
      symbol: '',
      integer: '',
      decimal: '',
    });
  }

  format(): string {
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: this.currency.toUpperCase(),
        currencyDisplay: 'narrowSymbol',
      })
      .format(this.amount);
  }
}
