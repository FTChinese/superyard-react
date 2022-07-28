import { parseISO } from 'date-fns';
import { formatDate, formatTime, formatZone, padSeconds } from '../utils/time-format';

export type DateTimeParts = {
  date: string;
  time: string;
  zone: string;
}

export function defaultDateTimeParts(zone: string = ''): DateTimeParts {
  return {
    date: '',
    time: '00:00:00',
    zone: zone ? zone : formatZone(new Date()),
  };
}

export function newDateTimeParts(date: Date): DateTimeParts {
  return {
    date: formatDate(date),
    time: formatTime(date),
    zone: formatZone(date),
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

