import { FormikHelpers } from 'formik';
import { doc } from 'prettier';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../components/hooks/useAuth';
import { FullscreenDialog } from '../../components/layout/FullscreenDialog';
import { CircleLoader } from '../../components/progress/CircleLoader';
import { loadingErrored, loadingStarted, loadingStopped, ProgressOrError } from '../../components/progress/ProgressOrError';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { PublishBadge } from '../../components/text/Badge';
import { LegalDoc, LegalPublishParams } from '../../data/legal';
import { LegalDocForm, LegalFormVal, newLegalDocParams } from '../../features/legal/LegalDocForm';
import { loadLegalDoc, publishLegalDoc, updateLegalDoc } from '../../repository/legal-doc';
import { ResponseError } from '../../repository/response-error';

export function LegalDetailPage() {
  const { id } = useParams<'id'>();
  const { passport } = useAuth();
  const [ showEdit, setShowEdit ] = useState(false);
  const {
    loading,
    onInit,
    doc,
    onUpdateDoc,
    publishing,
    onPublish,
    serverErr,
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
  }, []);

  useEffect(() => {
    if (serverErr) {
      toast.error(serverErr);
    }
  }, [serverErr]);

  return (
    <ProgressOrError
      state={loading}
    >
      <Row>
        <Col sm={12} md={9}>
          {
            doc && <DocDetails doc={doc} />
          }
        </Col>
        <Col sm={12} md={3}>
          {
            doc &&
            <DocMenu
              published={doc.active}
              publishing={publishing}
              onPublish={(params) => {
                onPublish(params, passport.token);
              }}
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
        </Col>
      </Row>
    </ProgressOrError>
  );
}

function DocDetails(
  props: {
    doc: LegalDoc;
  }
) {
  return (
    <section>
      <h2>
        {props.doc.title}
      </h2>

      <div className="mb-3 mt-3 border-bottom text-black60">
        <div>
          <PublishBadge active={props.doc.active} />
          {
            props.doc.active && <a href={`https://next.ftacademy.cn/terms/${props.doc.id}`} target="_blank" className="ms-3">Clike here to preview</a>
          }
        </div>
        <div>Published by <em>{props.doc.author}</em>, {props.doc.createdUtc}</div>
        <div>Lasted updated {props.doc.updatedUtc}</div>
      </div>

      <div>

        {props.doc.body.split('\n').map((line, i) => <p key={i}>{line}</p>)}

      </div>
    </section>
  )
}

function DocMenu(
  props: {
    published: boolean;
    publishing: boolean;
    onPublish: (p: LegalPublishParams) => void;
    onEdit: () => void;
  }
) {
  return (
    <div className="d-flex flex-row flex-md-column justify-content-between mt-3">
      <Button
        className="mb-3" size="sm"
        onClick={() => {
          props.onPublish({
            publish: !props.published
          });
        }}
        disabled={props.publishing}
      >
        <CircleLoader progress={props.publishing} />
        {props.published ? 'Undo Publish' : 'Publish'}
      </Button>
      <Button
        className="mb-3" size="sm"
        onClick={props.onEdit}
        disabled={props.publishing}
      >
        Edit
      </Button>
    </div>
  );
}

function useDetailState() {
  const [ loading, setLoading ] = useState(loadingStarted());
  const [ publishing, setPublishing ] = useState(false);
  const [ doc, setDoc ] = useState<LegalDoc>();
  const [ serverErr, setServerErr ] = useState('');

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
        params,
        token,
      )
      .then(d => {
        helpers.setSubmitting(false);
        setDoc(d);
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
    body: LegalPublishParams,
    token: string
  ) {
    if (!doc) {
      return
    }

    setPublishing(true);

    publishLegalDoc(doc.id, body, token)
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
  };
}
