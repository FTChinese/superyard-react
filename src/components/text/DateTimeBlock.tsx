import { format, parseISO } from 'date-fns';
import { timeLayout } from '../../utils/time-format';

export function ISOTimeColumn(
  props: {
    date?: string;
  }
) {
  if (!props.date) {
    return null;
  }

  return (
    <DateColumn
      date={parseISO(props.date)}
    />
  );
}

export function DateColumn(
  props: {
    date: Date;
  }
) {

  const date = format(props.date, timeLayout.isoDate);
  const time = format(props.date, timeLayout.isoTime);
  const zone = format(props.date, timeLayout.isoZone);

  return (
    <span className="d-flex flex-column">
      <span>{date}</span>
      <span>{time}</span>
      <span>{zone}</span>
    </span>
  );
}

