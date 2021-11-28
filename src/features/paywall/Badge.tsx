import Badge from 'react-bootstrap/Badge';

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
