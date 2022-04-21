import Badge from 'react-bootstrap/Badge';
import { isoOffset } from '../../utils/time-format';

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

export function TimezoneGuide() {

  return (
    <div className="mb-3 text-muted">
      时间按你当前所处时区选择即可，不需要做转换。数据提交后会统一转换为0区ISO8601标准时间格式
    </div>
  );
}
