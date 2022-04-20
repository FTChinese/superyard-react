import { ValidPeriod } from '../../data/period';

export function EffectivePeriod(
  props: {
    period: Partial<ValidPeriod>;
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  }) {
  if (!props.period.startUtc || !props.period.endUtc) {
    return <>Forever</>;
  }

  return (
    <span className={`d-flex flex-${props.direction || 'row'}`}>
      <span>Start: {props.period.startUtc}</span>
      <span>End: {props.period.endUtc}</span>
    </span>
  );
}

export function EffectiveRow(
  props: {
    start?: string;
    end?: string;
  }
) {
  if (!props.start || !props.end) {
    return <>NULL</>;
  }

  return (
    <span className="d-flex flex-row">
      <span className="me-3">From</span>
      <span>{props.start}</span>
      <span className="me-3 ms-3">To</span>
      <span>{props.end}</span>
    </span>
  );
}
