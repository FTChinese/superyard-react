import { ISOPeriod } from '../../data/period';
import { formatISODateTime } from '../../utils/format-datetime';

export function EffectivePeriod(
  props: {
    period: Partial<ISOPeriod>;
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  }) {
  if (!props.period.startUtc || !props.period.endUtc) {
    return <>Forever</>;
  }

  return (
    <span className={`d-flex flex-${props.direction || 'row'}`}>
      <span>Start: {formatISODateTime(props.period.startUtc)}</span>
      <span>End: {formatISODateTime(props.period.endUtc)}</span>
    </span>
  );
}
