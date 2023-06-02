import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';
import { ProgressOrError } from '../../components/progress/ProgressOrError';
import { Unauthorized } from '../../components/middleware/Unauthorized';
import { getPagingQuery, serializePagingQuery } from '../../http/paged-list';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { FullscreenDialog } from '../../components/dialog/FullscreenDialog';
import { FullscreenSingleCol } from '../../components/layout/FullscreenSingleCol';
import { ReleaseForm } from '../../features/android/ReleaseForm';
import { ReleaseListScreen } from '../../features/android/ReleaseListScreen';
import { useReleaseListState } from '../../features/android/useReleaseListState';

export function ReleaseListPage() {
  const { passport } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const paging = getPagingQuery(searchParams);
  const {
    initLoading,
    loading,
    showDialog,
    setShowDialog,
    releaseList,
    formErr,
    onCreateRelease,
  } = useReleaseListState()

  if (!passport) {
    return <Unauthorized />;
  }

  useEffect(
    () => {
      initLoading(
        paging,
        passport.token
      );

      window.scrollTo(0, 0);
    },
    [
      paging.page,
      paging.itemsCount,
    ]
  );

  useEffect(() => {
    if (formErr) {
      toast.error(formErr);
    }
  }, [formErr]);

  return (
    <ProgressOrError
      state={loading}
    >
      <>
        <ReleaseListScreen
          releaseList={releaseList}
          onClickNew={() => setShowDialog(true)}
          onNavigatePage={(paged) => {
            setSearchParams(serializePagingQuery(paged));
          }}
        />

        <FullscreenDialog
          show={showDialog}
          title="New Release"
          onHide={() => setShowDialog(false)}
        >
          <FullscreenSingleCol>
            <ReleaseForm
              onSubmit={(values, helpers) => {
                onCreateRelease(
                  helpers,
                  {
                    body: values,
                    token: passport.token,
                  }
                );
              }}
            />
          </FullscreenSingleCol>
        </FullscreenDialog>
      </>
    </ProgressOrError>
  );
}






