import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import parseISO from 'date-fns/parseISO';

export type ValidPeriod = {
  startUtc: string; // ISO
  endUtc: string;
};

export type OptionalPeriod = Partial<ValidPeriod>;

export function parsePeriod(p: ValidPeriod): TimeRange {
  return {
    startUtc: parseISO(p.startUtc),
    endUtc: parseISO(p.endUtc),
  };
}

export type TimeRange = {
  startUtc: Date;
  endUtc: Date;
}

export function isValidPeriod(p: OptionalPeriod): boolean {
  if (!p.startUtc || !p.endUtc) {
    return true;
  }

  const r = parsePeriod({
    startUtc: p.startUtc,
    endUtc: p.endUtc,
  });

  const now = new Date();

  return !isBefore(now, r.startUtc) && !isAfter(now, r.endUtc);
}
