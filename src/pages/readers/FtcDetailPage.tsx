import { useParams } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';
import { Missing, Unauthorized } from '../../components/routes/Unauthorized';
import { AccountKind } from '../../data/enum';
import { ReaderDetailPageScreen } from './ReaderDetailPageScreen';

export function FtcDetailPage() {
  const { id } = useParams<'id'>();
  const { passport } = useAuth();

  if (!id) {
    return <Missing message="Missing user id" />;
  }

  if (!passport) {
    return <Unauthorized />;
  }

  return (
    <ReaderDetailPageScreen
      id={id}
      kind={AccountKind.Ftc}
      passport={passport}
    />
  );
}
