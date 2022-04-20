import { format, parseISO } from 'date-fns';

export class DateTimeFormat {
  static fromISO(str: string): DateTimeFormat {
    return new DateTimeFormat(parseISO(str));
  }

  static fromNow(): DateTimeFormat {
    return new DateTimeFormat(new Date());
  }

  constructor(private date: Date) {}

  formatToCn(): string {
    return format(this.date, 'yyyy年M月d日H时m分s秒');
  }
}
