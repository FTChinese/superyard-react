import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';
import { Unauthorized } from '../../components/middleware/Unauthorized';
import { LegalList, LegalTeaser } from '../../data/legal';
import { createLegalDoc, listLegalDoc } from '../../repository/legal-doc';
import { ResponseError } from '../../http/response-error';
import { FullscreenDialog } from '../../components/dialog/FullscreenDialog';
import {
  LegalDocForm,
  LegalFormVal,
  newLegalDocParams,
} from '../../features/legal/LegalDocForm';
import { FormikHelpers } from 'formik/dist/types';
import { CMSPassport } from '../../data/cms-account';
import {
  serializePagingQuery,
  getPagingQuery,
  PagingQuery,
} from '../../http/paged-list';
import { toast } from 'react-toastify';
import { LegalListScreen } from '../../features/legal/LegalListScreen';
import { useProgress } from '../../components/hooks/useProgress';

export function LegalListPage() {
  const { passport } = useAuth();

  if (!passport) {
    return <Unauthorized />;
  }

  return (
    <ListPageScreen
      passport={passport}
    />
  );
}

function ListPageScreen(
  props: {
    passport: CMSPassport
  }
) {
  const {
    docList,
    formErr,
    startLoading,
    onCreateDoc,
    showDialog,
    setShowDialog,
  } = useTeaserListState();
  const [searchParams, setSearchParams] = useSearchParams();
  const paging = getPagingQuery(searchParams);

  useEffect(() => {
    startLoading(paging, props.passport.token);

    window.scrollTo(0, 0);
  }, [paging.page, paging.itemsCount]);

  useEffect(() => {
    if (formErr) {
      toast.error(formErr);
    }
  }, [formErr]);

  return (
    <>
      <LegalListScreen
        docList={docList}
        onClickNew={() => setShowDialog(true)}
        onNavigate={(paged) => {
          setSearchParams(serializePagingQuery(paged));
        }}
      />

      <FullscreenDialog
        show={showDialog}
        title="New Legal Document"
        onHide={() => setShowDialog(false)}
      >
        <LegalDocForm
          onSubmit={(value, helpers) => {
            onCreateDoc(value, helpers, props.passport);
          }}
        />
      </FullscreenDialog>
    </>
  );
}

function useTeaserListState() {
  const { startProgress, stopProgress } = useProgress();
  const [docList, setDocList] = useState<LegalList>();
  const [showDialog, setShowDialog] = useState(false);
  const [formErr, setFormErr] = useState('');

  function startLoading(paging: PagingQuery, token: string) {
    startProgress();

    listLegalDoc(paging, token)
      .then((docs) => {
        stopProgress();
        setDocList(docs);
      })
      .catch((err: ResponseError) => {
        stopProgress();
        toast.error(err.message);
      });
  }

  function onCreateDoc(
    values: LegalFormVal,
    helpers: FormikHelpers<LegalFormVal>,
    passport: CMSPassport
  ) {
    helpers.setSubmitting(true);
    setFormErr('');

    const params = newLegalDocParams(values, passport.userName);

    createLegalDoc({
      body: params,
      token: passport.token,
    })
      .then((doc) => {
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
            data: [newTeaser, ...docList.data],
          });
        } else {
          setDocList({
            total: 1,
            page: 1,
            limit: 20,
            data: [newTeaser],
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
    docList,
    formErr,
    setFormErr,
    showDialog,
    setShowDialog,
    startLoading,
    onCreateDoc,
  };
}
