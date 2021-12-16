import { pluralize } from '../utils/pluralize';

export type ISOPeriod = {
  startUtc: string; // ISO
  endUtc: string;
};

export type YearMonthDay = {
  years: number;
  months: number;
  days: number;
}

export function isZeroYMD(ymd: YearMonthDay): boolean {
  return ymd.years === 0 && ymd.months === 0 && ymd.days === 0;
}

export function ymdZero(): YearMonthDay {
  return {
    years: 0,
    months: 0,
    days: 0,
  };
}

export function formatYMD(ymd: YearMonthDay): string {
  const str: string[] = [];

  str.push(`${ymd.years} ${pluralize('year', ymd.years > 1)}`);

  str.push(`${ymd.months} ${pluralize('month', ymd.months > 1)}`);

  str.push(`${ymd.days} ${pluralize('day', ymd.days > 1)}`);

  return str.join(', ');
}
