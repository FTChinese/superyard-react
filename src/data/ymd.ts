import { formatDuration } from 'date-fns';
import { Cycle } from './enum';

enum TemporalUnit {
  Year,
  Month,
  Day,
}

const temporalUnitsCN: Record<TemporalUnit, string> = {
  0: '年',
  1: '月',
  2: '天',
}

type TemporalDuration = {
  count: number;
  unit: TemporalUnit
}

function formatDurationCN(dur: TemporalDuration, recurring: boolean): string {
  const infix = (dur.unit === TemporalUnit.Month)
    ? '个'
    : '';

    if (dur.count === 0) {
      return ''
    }

    if (dur.count === 1 && recurring) {
      return temporalUnitsCN[dur.unit];
    }

    return `${dur.count}${infix}${temporalUnitsCN[dur.unit]}`;
}

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

export function ymdToCycle(ymd: YearMonthDay): Cycle {
  if (ymd.years > 0) {
    return 'year';
  }

  if (ymd.months > 0) {
    return 'month';
  }

  if (ymd.days > 365) {
    return 'year';
  }

  return 'month';
}

export function formatYMD(ymd: YearMonthDay): string {
  return formatDuration({
    years: ymd.years,
    months: ymd.months,
    days: ymd.days,
  });
}

export class CycleFormat {

  private separator = '';

  constructor(private ymd: YearMonthDay) {}

  private get toDurations(): TemporalDuration[] {
    return [
      {
        count: this.ymd.years,
        unit: TemporalUnit.Year,
      },
      {
        count: this.ymd.months,
        unit: TemporalUnit.Month,
      },
      {
        count: this.ymd.days,
        unit: TemporalUnit.Day,
      }
    ];
  }

  withSeporator(s: string = '/'): CycleFormat {
    this.separator = s;

    return this;
  }

  format(recurring: boolean): string {
    const durs = this.toDurations
      .filter(item => item.count > 0);

    switch (durs.length) {
      case 0:
        return '';

      case 1:
        return this.separator + formatDurationCN(durs[0], recurring);

      default:
        // If there are more than one units, you should
        // product a string linke 1年1个月; otherwise a
        // recurring price might get a string like 年月
        return this.separator + durs.reduce((prev, curr) => {
          prev += formatDurationCN(curr, false);
          return prev;
        }, '')
    }
  }
}
