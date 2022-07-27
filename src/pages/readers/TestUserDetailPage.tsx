import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { IconButton } from '../../components/buttons/Button';
import { Pencil } from '../../components/graphics/icons';
import { useAuth } from '../../components/hooks/useAuth';
import { useProgress } from '../../components/hooks/useProgress';
import { LoadingOrErr } from '../../components/progress/LoadingOrError';
import { Missing, Unauthorized } from '../../components/routes/Unauthorized';
import { CMSPassport } from '../../data/cms-account';
import { TestAccount } from '../../data/reader-account';
import { sitemap } from '../../data/sitemap';
import { SandboxDeleteDialog } from '../../features/readers/SandboxDeleteDialog';
import { SandboxPasswordDialog } from '../../features/readers/SandboxPasswordDialog';
import { ResponseError } from '../../http/response-error';
import { loadSandboxUser } from '../../repository/reader';

export function TestUserDetailPage() {
  const { id } = useParams<'id'>();
  const { passport } = useAuth();

  if (!id) {
    return <Missing message="Missing price id" />;
  }

  if (!passport) {
    return <Unauthorized />;
  }


  return (
    <UserDetailPageScreen
      ftcId={id}
      passport={passport}
    />
  )
}

function UserDetailPageScreen(
  props: {
    ftcId: string;
    passport: CMSPassport;
  }
) {

  const navigate = useNavigate();
  const {
    sandboxAccount,
    progress,
    errMsg,
    startLoading,
    setSandboxAccount
  } = useSandboxDetailState();

  const [showPw, setShowPw] = useState(false);
  const [showDel, setShowDel] = useState(false);

  useEffect(() => {
    startLoading(props.passport.token, props.ftcId);
  }, []);

    useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
    }
    }, [errMsg]);

  if (!sandboxAccount) {
    return <LoadingOrErr loading={progress} />
  }

  return (
    <>
      <UserDetailScreen
        user={sandboxAccount}
        onDelete={() => setShowDel(true) }
        onChangePassword={() => setShowPw(true) }
      />

      <SandboxPasswordDialog
        passport={props.passport}
        user={sandboxAccount}
        show={showPw}
        onHide={() => setShowPw(false)}
        onChanged={setSandboxAccount}
      />

      <SandboxDeleteDialog
        passport={props.passport}
        user={sandboxAccount}
        show={showDel}
        onHide={() => setShowDel(false)}
        onDeleted={() => {
          navigate(sitemap.sandbox);
        }}
      />
    </>
  )
}

function UserDetailScreen(
  props: {
    user: TestAccount;
    onDelete: () => void;
    onChangePassword: () => void;
  }
) {
  return (
    <div>
      <Stack direction='horizontal'>
        <h2 className="mb-3">{props.user.email}</h2>
        <Button
          onClick={props.onDelete}
          className="ms-auto"
          variant='danger'
        >
          Delete
        </Button>
      </Stack>

      <section>
        <h3>Password</h3>

        <div className='d-flex align-items-center'>
          <code className='me-2'>{props.user.password}</code>
          <IconButton
            icon={<Pencil />}
            onClick={props.onChangePassword}
          />
        </div>
      </section>
    </div>
  )
}

function useSandboxDetailState() {
  const { startProgress, stopProgress, progress } = useProgress();
  const [sandboxAccount, setSandboxAccount] = useState<TestAccount>();
  const [errMsg, setErrMsg] = useState('');

  const startLoading = (token: string, ftcId: string) => {
    startProgress();

    loadSandboxUser(token, ftcId)
      .then(a => {
        setSandboxAccount(a);
      })
      .catch((err: ResponseError) => {
        setErrMsg(err.message);
      })
      .finally(() => {
        stopProgress();
      });
  }

  return {
    sandboxAccount,
    progress,
    errMsg,
    startLoading,
    setSandboxAccount,
  }
}
