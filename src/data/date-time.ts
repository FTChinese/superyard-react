import { format, parseISO } from 'date-fns';
import { padSeconds } from '../utils/time-formatter';

export type DateTime = {
  date: string;
  time: string;
}

export function dateTimeZero(): DateTime {
  return {
    date: '',
    time: '00:00:00',
  };
}

export function dateTimeToISO(dt: DateTime, zone: string): string {
  if (!dt.date  || !dt.time || !zone) {
    return '';
  }

  return `${dt.date}T${padSeconds(dt.time)}${zone}`;
}

export function dateTimeFromISO(isoStr: string): DateTime {
  const v = parseISO(isoStr);

  return {
    date: format(v, 'yyyy-MM-dd'),
    time: format(v, 'hh:mm:ss'),
  };
}
