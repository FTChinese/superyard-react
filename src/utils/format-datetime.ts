import { format, parseISO } from 'date-fns';

export function localizeISO(dateString: string): string {
  return format(parseISO(dateString), 'yyyy年M月d日H时m分s秒')
}



