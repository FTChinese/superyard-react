import { FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../components/hooks/useAuth';
import { FullscreenDialog } from '../../components/layout/FullscreenDialog';
import { loadingErrored, loadingStarted, loadingStopped, ProgressOrError } from '../../components/progress/ProgressOrError';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { LegalDoc, LegalPublishParams } from '../../data/legal';
import { LegalDetailScreen } from '../../features/legal/LegalDetailScreen';
import { LegalDocForm, LegalFormVal, newLegalDocParams } from '../../features/legal/LegalDocForm';
import { loadLegalDoc, publishLegalDoc, updateLegalDoc } from '../../repository/legal-doc';
import { ResponseError } from '../../repository/response-error';

export function LegalDetailPage() {
  const { id } = useParams<'id'>();
  const { passport } = useAuth();
  const {
    loading,
    onInit,
    doc,
    onUpdateDoc,
    publishing,
    onPublish,
    serverErr,
    showEdit,
    setShowEdit
  } = useDetailState();

  if (!id) {
    return <div>Pleaser provide document id!</div>;
  }

  if (!passport) {
    return <Unauthorized/>;
  }

  useEffect(() => {
    onInit(
      id,
      passport.token,
    )
  }, [id]);

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
          doc &&
          <LegalDetailScreen
            doc={doc}
            published={doc.active}
            publishing={publishing}
            onPublish={() => onPublish(passport.token)}
            onEdit={() => setShowEdit(true)}
          />
        }

        <FullscreenDialog
          show={showEdit}
          title="Edit Legal Document"
          onHide={() => setShowEdit(false)}
        >
          <LegalDocForm
            onSubmit={(value, helpers) => {
              onUpdateDoc(value, helpers, passport.token)
            }}
            doc={doc}
          />
        </FullscreenDialog>
      </>
    </ProgressOrError>
  );
}

function useDetailState() {
  const [ loading, setLoading ] = useState(loadingStarted());
  const [ publishing, setPublishing ] = useState(false);
  const [ doc, setDoc ] = useState<LegalDoc>();
  const [ serverErr, setServerErr ] = useState('');
  const [ showEdit, setShowEdit ] = useState(false);

  function onInit(
    id: string,
    token: string,
  ) {
    setLoading(loadingStarted());

    loadLegalDoc(id, token)
      .then(doc => {
        setLoading(loadingStopped());
        setDoc(doc);
      })
      .catch((err: ResponseError) => {
        setLoading(loadingErrored(err.message));
      });
  }

  function onUpdateDoc(
    formValues: LegalFormVal,
    helpers: FormikHelpers<LegalFormVal>,
    token: string,
  ) {
    if (!doc) {
      return;
    }

    helpers.setSubmitting(true);
    setServerErr('');

    // Not author field won't be changed on server side.
    const params = newLegalDocParams(
      formValues,
      ''
    );

    updateLegalDoc(
        doc.id,
        {
          body: params,
          token: token,
        }
      )
      .then(d => {
        helpers.setSubmitting(false);
        setDoc(d);
        setShowEdit(false);
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

  function onPublish(
    token: string
  ) {
    if (!doc) {
      return
    }

    setPublishing(true);

    const body: LegalPublishParams = {
      publish: !doc.active
    };

    publishLegalDoc(doc.id, {body, token})
      .then(d => {
        setPublishing(false);
        setDoc(d);
      })
      .catch((err: ResponseError) => {
        setPublishing(false);
        setServerErr(err.message);
      });
  }

  return {
    loading,
    onInit,
    doc,
    onUpdateDoc,
    publishing,
    onPublish,
    serverErr,
    showEdit,
    setShowEdit
  };
}
