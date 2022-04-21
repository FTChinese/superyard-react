import { YearMonthDay } from '../../data/ymd';
import { pluralize } from '../../utils/pluralize';

export function YMDColumn(
  props: {
    ymd: YearMonthDay;
    direction?: 'row' | 'column';
  }
) {
  return (
    <span className="d-flex flex-column">
      <span>{props.ymd.years} {pluralize('year', props.ymd.years > 1)}</span>
      <span>{props.ymd.months} {pluralize('month', props.ymd.months > 1)}</span>
      <span>{props.ymd.days} {pluralize('day', props.ymd.days > 1)}</span>
    </span>
  )
}
