export function formatMoney(currency: string, amount: number): string {
  return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency.toUpperCase(),
      currencyDisplay: 'narrowSymbol',
    })
    .format(amount);
}

export type MoneyParts = {
  symbol: string;
  integer: string;
  decimal: string;
};

export function newMoneyParts(currency: string, amount: number): MoneyParts {
  return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency.toUpperCase(),
      currencyDisplay: 'narrowSymbol',
    })
    .formatToParts(amount)
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
    })
}

export type PriceParts = MoneyParts & {
  cycle: string;
}


