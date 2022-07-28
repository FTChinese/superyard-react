import { parseISO } from 'date-fns';
import { formatDate, formatTime, formatZone } from '../../utils/time-format';

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

  const date = formatDate(props.date);
  const time = formatTime(props.date);
  const zone = formatZone(props.date);

  return (
    <span className="d-flex flex-column">
      <span>{date}</span>
      <span>{time}</span>
      <span>{zone}</span>
    </span>
  );
}

