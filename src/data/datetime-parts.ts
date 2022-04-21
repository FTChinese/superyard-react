import { format, parseISO } from 'date-fns';
import { padSeconds, timeLayout } from '../utils/time-format';

export type DateTimeParts = {
  date: string;
  time: string;
  zone: string;
}

export function defaultDateTimeParts(zone: string = ''): DateTimeParts {
  return {
    date: '',
    time: '00:00:00',
    zone: zone ? zone : format(new Date(), timeLayout.isoZone),
  };
}

export function newDateTimeParts(date: Date): DateTimeParts {
  return {
    date: format(date, timeLayout.isoDate),
    time: format(date, timeLayout.isoTime),
    zone: format(date, timeLayout.isoZone),
  };
}

export function parseISOToParts(isoStr: string): DateTimeParts {
  return newDateTimeParts(parseISO(isoStr));
}

export function joinDateTimeParts(parts: DateTimeParts): string {
  if (!parts.date  || !parts.time || !parts.zone) {
    return '';
  }

  return `${parts.date}T${padSeconds(parts.time)}${parts.zone}`;
}

