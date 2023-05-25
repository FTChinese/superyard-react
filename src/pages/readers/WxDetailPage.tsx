import { useParams } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';
import { Unauthorized } from '../../components/middleware/Unauthorized';
import { AccountKind } from '../../data/enum';
import { ReaderDetailPageScreen } from './ReaderDetailPageScreen';
import { ErrorText } from '../../components/text/ErrorText';

export function WxDetailPage() {
  const { id } = useParams<'id'>();
  const { passport } = useAuth();

  if (!id) {
    return <ErrorText message="Missing user id" />;
  }

  if (!passport) {
    return <Unauthorized />;
  }

  return (
    <ReaderDetailPageScreen
      id={id}
      kind={AccountKind.Wechat}
      passport={passport}
    />
  );
}
