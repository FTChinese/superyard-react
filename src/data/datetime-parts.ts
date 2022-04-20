import { format, parseISO } from 'date-fns';
import { padSeconds, timeLayout } from '../utils/time-format';

export type DateTimeParts = {
  date: string;
  time: string;
}

export function defaultDateTimeParts(): DateTimeParts {
  return {
    date: '',
    time: '00:00:00',
  };
}

export function dateTimePartsFromISO(isoStr: string): DateTimeParts {
  const v = parseISO(isoStr);

  return {
    date: format(v, timeLayout.isoDate),
    time: format(v, timeLayout.isoTime),
  };
}

export function concatDateTimePartsISO(dt: DateTimeParts, zone: string): string {
  if (!dt.date  || !dt.time || !zone) {
    return '';
  }

  return `${dt.date}T${padSeconds(dt.time)}${zone}`;
}


