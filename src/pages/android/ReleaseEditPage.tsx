import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../components/hooks/useAuth';
import { ProgressOrError } from '../../components/progress/ProgressOrError';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { ReleaseEditScreen } from '../../features/android/ReleaseEditScreen';
import { useReleaseEditState } from '../../features/android/useReleaseEditState';

export function ReleaseEditPage() {
  const { versionName } = useParams<'versionName'>();
  const { passport } = useAuth();
  const {
    loading,
    onInit,
    release,
    onUpdateRelease,
    serverErr,
  } = useReleaseEditState();

  if (!versionName) {
    return <div>Pleaser provide document id!</div>;
  }

  if (!passport) {
    return <Unauthorized/>;
  }

  useEffect(() => {
    onInit(versionName, passport.token)
  }, [versionName]);

  useEffect(() => {
    if (serverErr) {
      toast.error(serverErr);
    }
  }, [serverErr]);

  return (
    <ProgressOrError
      state={loading}
    >
      <>
      {
        release &&
        <ReleaseEditScreen
          release={release}
          onSubmit={(values, helpers) => {
            onUpdateRelease(helpers, {
              body: values,
              token: passport.token,
            })
          }}
        />
      }
      </>
    </ProgressOrError>
  )
}
