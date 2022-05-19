import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';
import { Flex } from '../../components/layout/Flex';
import { loadingErrored, loadingStarted, loadingStopped, ProgressOrError } from '../../components/progress/ProgressOrError';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { LegalList, LegalTeaser } from '../../data/legal';
import { createLegalDoc, listLegalDoc } from '../../repository/legal-doc';
import { ResponseError } from '../../repository/response-error';
import { FullscreenDialog } from '../../components/layout/FullscreenDialog';
import { LegalDocForm, LegalFormVal, newLegalDocParams } from '../../features/legal/LegalDocForm';
import { FormikHelpers } from 'formik/dist/types';
import { CMSPassport } from '../../data/cms-account';
import { PublishBadge } from '../../components/text/Badge';
import { Pagination } from '../../components/Pagination';
import {serializePagingQuery, parsePagingQuery, PagedNavParams} from '../../data/paged-list';
import { toast } from 'react-toastify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export function LegalListPage() {
  const { passport } = useAuth();
  const {
    loading,
    docList,
    formErr,
    startLoading,
    onCreateDoc,
    showDialog,
    setShowDialog,
  } = useTeaserListState();
  const [ searchParams, setSearchParams ] = useSearchParams();
  const paging = parsePagingQuery(searchParams);

  if (!passport) {
    return <Unauthorized/>;
  }

  useEffect(
    () => {
      startLoading(
        paging,
        passport.token
      );

      window.scrollTo(0, 0);
    },
    [
      paging.prevNext,
      paging.itemsPerPage,
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
      <Row className="justify-content-center">
        <Col md={10} lg={8}>

          <PageHeader
            onClick={() => setShowDialog(true)}
          />

          {
            docList && docList.data.map(item =>
              <TeaserItem
                teaser={item}
                key={item.id}
              />
            )
          }

          {
            docList && <Pagination
              totalItem={docList.total}
              currentPage={docList.page}
              itemsPerPage={docList.limit}
              onNavigate={(paged) => {
                setSearchParams(
                  serializePagingQuery(paged)
                );
              }}
            />
          }

          <FullscreenDialog
            show={showDialog}
            title="New Legal Document"
            onHide={() => setShowDialog(false)}
          >
            <LegalDocForm
              onSubmit={(value, helpers) => {
                onCreateDoc(
                  value,
                  helpers,
                  passport,
                )
              }}
            />
          </FullscreenDialog>
        </Col>
      </Row>
    </ProgressOrError>
  );
}

function PageHeader(
  props: {
    onClick: () => void;
  }
) {
  return (
    <Flex>
      <>
        <h2 className="mb-3">Legal Documents</h2>
        <button
          className="btn btn-primary"
          onClick={ props.onClick }
        >
          New
        </button>
      </>
    </Flex>
  );
}

function TeaserItem(
  props: {
    teaser: LegalTeaser,
  }
) {

  return (
    <Card className="mb-3">
      <Card.Header>
        <PublishBadge active={props.teaser.active} />
      </Card.Header>
      <Card.Body>
        <Link to={props.teaser.id}>
          {props.teaser.title}
        </Link>
        <p>
          {props.teaser.summary}
        </p>
      </Card.Body>
    </Card>
  )
}

function useTeaserListState() {
  const [ loading, setLoading ] = useState(loadingStarted());
  const [ docList, setDocList ] = useState<LegalList>();
  const [ showDialog, setShowDialog ] = useState(false);
  const [ formErr, setFormErr ] = useState('');

  function startLoading(
    paging: PagedNavParams,
    token: string,
  ) {
    setLoading(loadingStarted());

    listLegalDoc(paging, token)
      .then(docs => {
        setLoading(loadingStopped());
        setDocList(docs);
      })
      .catch((err: ResponseError) => {
        setLoading(loadingErrored(err.message))
      });
  }

  function onCreateDoc(
    values: LegalFormVal,
    helpers: FormikHelpers<LegalFormVal>,
    passport: CMSPassport,
  ) {
    helpers.setSubmitting(true);
    setFormErr('');

    const params = newLegalDocParams(values, passport.userName);

    createLegalDoc(
        params,
        passport.token,
      )
      .then(doc => {
        helpers.setSubmitting(false);

        const newTeaser: LegalTeaser = {
          id: doc.id,
          active: doc.active,
          title: doc.title,
          summary: doc.summary,
        };

        if (docList) {
          setDocList({
            total: docList.total + 1,
            page: docList.page,
            limit: docList.limit,
            data: [
              newTeaser,
              ...docList.data
            ]
          })
        } else {
          setDocList({
            total: 1,
            page: 1,
            limit: 20,
            data: [
              newTeaser,
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
    loading,
    docList,
    formErr,
    setFormErr,
    showDialog,
    setShowDialog,
    startLoading,
    onCreateDoc,
  }
}

