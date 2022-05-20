import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { loadingErrored, loadingStarted, loadingStopped } from '../../components/progress/ProgressOrError';
import { Release, ReleaseParams } from '../../data/android';
import { CMSPassport } from '../../data/cms-account';
import { loadRelease, updateRelease } from '../../repository/android';
import { UpsertArgs } from '../../repository/args';
import { ResponseError } from '../../repository/response-error';

export function useReleaseEditState() {
  const [ loading, setLoading ] = useState(loadingStarted());
  const [ release, setRelease ] = useState<Release>();
  const [serverErr, setServerErr ] = useState('');

  function onInit(
    id: string,
    token: string,
  ) {
    setLoading(loadingStarted());

    loadRelease(id, token)
      .then(r => {
        setLoading(loadingStopped());
        setRelease(r);
      })
      .catch((err: ResponseError) => {
        setLoading(loadingErrored(err.message));
      });
  }

  function onUpdateRelease(
    helpers: FormikHelpers<ReleaseParams>,
    args: UpsertArgs<ReleaseParams>,
  ) {
    if (!release) {
      return;
    }

    helpers.setSubmitting(true);
    setServerErr('');

    updateRelease(
        release.versionName,
        { ...args }
      )
      .then(r => {
        helpers.setSubmitting(false);
        setRelease(r);
      })
      .catch((err: ResponseError) => {
        helpers.setSubmitting(false);
        if (err.invalid) {
          helpers.setErrors(err.toFormFields);
          return;
        }

        setServerErr(err.message);
      });
  }

  return {
    loading,
    onInit,
    release,
    onUpdateRelease,
    serverErr,
  }
}
