import { padSeconds } from '../utils/time-formatter';

export type ISOPeriod = {
  startUtc: string; // ISO
  endUtc: string;
};

export type DateTime = {
  date: string;
  time: string;
}

export function concatDateTime(dt: DateTime, zone: string): string {
  if (!dt.date  || !dt.time || !zone) {
    return '';
  }

  return `${dt.date}T${padSeconds(dt.time)}${zone}`;
}

export type YearMonthDay = {
  years: number;
  months: number;
  days: number;
}

export function isZeroYMD(ymd: YearMonthDay): boolean {
  return ymd.years === 0 && ymd.months === 0 && ymd.days === 0;
}
