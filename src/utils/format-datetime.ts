import { format, parseISO } from 'date-fns';
import { isZeroYMD, YearMonthDay } from '../data/period';

export function formatISODateTime(dateString: string): string {
  return format(parseISO(dateString), 'yyyy年M月d日H时m分s秒')
}

export function formatYearMonthDay(ymd: YearMonthDay): string {

  const str: string[] = [];

  str.push(`${ymd.years} ${pluralize('year', ymd.years > 1)}`);

  str.push(`${ymd.months} ${pluralize('month', ymd.months > 1)}`);

  str.push(`${ymd.days} ${pluralize('day', ymd.days > 1)}`);

  return str.join(', ');
}

function pluralize(word: string, plural: boolean): string {
  return plural ? `${word}s` : word
}
