import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { loadingStarted, loadingStopped, loadingErrored } from '../../components/progress/ProgressOrError';
import { ReleaseList, ReleaseParams } from '../../data/android';
import { CMSPassport } from '../../data/cms-account';
import { PagedNavParams } from '../../data/paged-list';
import { listReleases, createRelease } from '../../repository/android';
import { UpsertArgs } from '../../repository/args';
import { ResponseError } from '../../repository/response-error';

export function useReleaseListState() {
  const [ loading, setLoading ] = useState(loadingStarted());
  const [ showDialog, setShowDialog ] = useState(false);
  const [ formErr, setFormErr ] = useState('');
  const [ releaseList, setReleaseList ] = useState<ReleaseList>();

  function initLoading(
    paging: PagedNavParams,
    token: string,
  ) {
    listReleases(paging, token)
      .then(list => {
        setLoading(loadingStopped());
        setReleaseList(list);
      })
      .catch((err: ResponseError) => {
        setLoading(loadingErrored(err.message))
      });
  }

  function onCreateRelease(
    helpers: FormikHelpers<ReleaseParams>,
    args: UpsertArgs<ReleaseParams>,
  ) {
    helpers.setSubmitting(true);
    setFormErr('')

    createRelease(args)
      .then(release => {
        helpers.setSubmitting(false);
        if (releaseList) {
          setReleaseList({
            total: releaseList.total + 1,
            page: releaseList.page,
            limit: releaseList.limit,
            data: [
              release,
              ...releaseList.data
            ]
          });
        } else {
          setReleaseList({
            total: 1,
            page: 1,
            limit: 20,
            data: [
              release,
            ]
          });
        }
        setShowDialog(false);
      })
      .catch((err: ResponseError) => {
        helpers.setSubmitting(false);
        if (err.invalid) {
          helpers.setErrors(err.toFormFields);
          return;
        }

        setFormErr(err.message);
      });
  }

  return {
    initLoading,
    loading,
    releaseList,
    showDialog,
    setShowDialog,
    formErr,
    setFormErr,
    onCreateRelease,
  }
}
