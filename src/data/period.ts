import { padSeconds } from '../utils/time-formatter';

export type Period = {
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
