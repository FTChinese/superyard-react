import Badge from 'react-bootstrap/Badge';
import { isoOffset } from '../../utils/time-formatter';

export function ModeBadge(
  props: {
    live: boolean;
  }
) {
  if (props.live) {
    return <Badge bg="info">Live</Badge>;
  }

  return <Badge bg="warning">Sandbox</Badge>;
}

export function ActiveBadge(
  props: {
    active: boolean;
  }
) {
  if (props.active) {
    return <Badge bg="info">Active</Badge>
  }
  return <Badge bg="secondary">Inactive</Badge>;
}

export function TimezoneBadage(
  props: {
    offset?: string
  }
) {
  const offset = props.offset || isoOffset(new Date());

  return <Badge bg="info">{offset}</Badge>
}
