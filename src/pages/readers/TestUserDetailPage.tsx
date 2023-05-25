import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { LinkButton } from '../../components/buttons/Button';
import { Pencil } from '../../components/graphics/icons';
import { useAuth } from '../../components/hooks/useAuth';
import { useProgress } from '../../components/hooks/useProgress';
import { LoadingOrError } from '../../components/progress/LoadingOrError';
import { Unauthorized } from '../../components/middleware/Unauthorized';
import { CMSPassport } from '../../data/cms-account';
import { TestAccount } from '../../data/reader-account';
import { sitemap } from '../../data/sitemap';
import { SandboxDeleteDialog } from '../../features/readers/SandboxDeleteDialog';
import { SandboxPasswordDialog } from '../../features/readers/SandboxPasswordDialog';
import { ResponseError } from '../../http/response-error';
import { loadSandboxUser } from '../../repository/reader';
import { ReaderDetailPageScreen } from './ReaderDetailPageScreen';
import { AccountKind } from '../../data/enum';
import { ErrorText } from '../../components/text/ErrorText';

export function TestUserDetailPage() {
  const { id } = useParams<'id'>();
  const { passport } = useAuth();

  if (!id) {
    return <ErrorText message="Missing user id" />;
  }

  if (!passport) {
    return <Unauthorized />;
  }


  return (
    <SandboxUserPageScreen
      ftcId={id}
      passport={passport}
    />
  )
}

function SandboxUserPageScreen(
  props: {
    ftcId: string;
    passport: CMSPassport;
  }
) {

  const navigate = useNavigate();
  const {
    progress
  } = useProgress();

  const {
    sandboxAccount,
    errMsg,
    loadSandboxAccount,
    setSandboxAccount,
  } = useSandboxDetailState();

  // Show change password dialog.
  const [showPw, setShowPw] = useState(false);
  // Show delete account dialog
  const [showDel, setShowDel] = useState(false);

  useEffect(() => {
    loadSandboxAccount(props.passport.token, props.ftcId)
  }, []);

  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
    }
  }, [errMsg]);

  if (!sandboxAccount) {
    return <LoadingOrError loading={progress} />
  }

  return (
    <>
      <SandboxUserDetails
        sandbox={sandboxAccount}
        onDelete={() => setShowDel(true)}
        onChangePass={() => setShowPw(true)}
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

      <ReaderDetailPageScreen
        id={props.ftcId}
        kind={AccountKind.Ftc}
        passport={props.passport}
      />
    </>
  )
}

/**
 * @description Displays a sandbox user's account and  password.
 */
function SandboxUserDetails(
  props: {
    sandbox: TestAccount;
    onDelete: () => void;
    onChangePass: () => void;
  }
) {
  return (
    <section>
      <Stack direction='horizontal'>
        <h2 className="mb-3">{props.sandbox.email}</h2>
        <Button
          onClick={props.onDelete}
          className="ms-auto"
          variant='danger'
        >Delete</Button>
      </Stack>

      <h5>Password</h5>

      <Stack direction='horizontal' className='align-items-center mb-3'>
        <code className='me-2'>
          {props.sandbox.password}
        </code>
        <LinkButton
          onClick={props.onChangePass}
        >
          <Pencil />
        </LinkButton>
      </Stack>
    </section>
  );
}

function useSandboxDetailState() {
  const { startProgress, stopProgress } = useProgress();
  const [sandboxAccount, setSandboxAccount] = useState<TestAccount>();
  const [errMsg, setErrMsg] = useState('');

  const loadSandboxAccount = (token: string, ftcId: string): Promise<boolean> => {
    startProgress();

    return loadSandboxUser(token, ftcId)
      .then(a => {
        setSandboxAccount(a);

        return Promise.resolve(true);
      })
      .catch((err: ResponseError) => {
        setErrMsg(err.message);
        return Promise.resolve(false);
      })
      .finally(() => {
        stopProgress();
      });
  };


  return {
    sandboxAccount,
    errMsg,
    loadSandboxAccount,
    setSandboxAccount,
  }
}
