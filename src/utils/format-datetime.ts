import { format, parseISO } from 'date-fns';
import { isZeroYMD, YearMonthDay } from '../data/period';

export function formatISODateTime(dateString: string): string {
  return format(parseISO(dateString), 'yyyy年M月d日H时m分s秒')
}

export function formatYearMonthDay(ymd: YearMonthDay): string {
  if (isZeroYMD(ymd)) {
    return '';
  }

  const str: string[] = [];

  if (ymd.years !== 0) {
    str.push(`${ymd.years}年`);
  }

  if (ymd.months !== 0) {
    str.push(`${ymd.months}个月`);
  }

  if (ymd.days !== 0) {
    str.push(`${ymd.days}天`);
  }

  return str.join('');
}
