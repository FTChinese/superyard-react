import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { getPagingQuery, PagingQuery, serializePagingQuery } from '../../http/paged-list';
import { CMSPassport } from '../../data/cms-account';
import { CenterColumn } from '../../components/layout/Column';
import { SignUpParams, TestAccount, TestUserList } from '../../data/reader-account';
import Button from 'react-bootstrap/Button';
import { OnNavigatePage, Pagination } from '../../components/Pagination';
import { Modal, Stack } from 'react-bootstrap';
import { useProgress } from '../../components/hooks/useProgress';
import { createSandboxUser, listSandboxUsers } from '../../repository/reader';
import { useEffect, useState } from 'react';
import { ResponseError } from '../../http/response-error';
import { toast } from 'react-toastify';
import { LoadingOrErr } from '../../components/progress/LoadingOrError';
import { SandboxAccountForm } from '../../features/readers/SandboxAccountForm';
import { FormikHelpers } from 'formik';

export function TestUserListPage() {
  const { passport } = useAuth();

  if (!passport) {
    return <Unauthorized />;
  }

  return (
    <CenterColumn>
      <ListPageScreen
        passport={passport}
      />
    </CenterColumn>
  );
}

function ListPageScreen(
  props: {
    passport: CMSPassport;
  }
) {

  const {
    userList,
    progress,
    errMsg,
    startLoading,
    onNewAccount,
  } = useSandboxListState();
  const [searchParams, setSearchParams] = useSearchParams();
  const paging = getPagingQuery(searchParams);
  const [show, setShow] = useState(false);

  useEffect(() => {
    startLoading(props.passport.token, paging);
    window.scrollTo(0, 0);
  }, [paging.page, paging.itemsCount]);

  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg);
    }
  }, [errMsg]);

  if (!userList) {
    return <LoadingOrErr loading={progress} />
  }

  return (
    <>
      <TestUserListScreen
        userList={userList}
        onClickNew={() => setShow(true)}
        onNavigate={(paged) => setSearchParams(serializePagingQuery(paged))}
      />

      <CreateUserDialog
        passport={props.passport}
        show={show}
        onHide={() => setShow(false)}
        onCreated={onNewAccount}
      />
    </>
  );
}

function TestUserListScreen(
  props: {
    userList: TestUserList;
    onClickNew: () => void;
    onNavigate: OnNavigatePage;
  }
) {
  return (
    <div>
      <Stack direction='horizontal'>
        <h2 className="mb-3">Test Accounts</h2>
        <Button
          onClick={props.onClickNew}
          className="ms-auto"
        >
          New
        </Button>
      </Stack>

      {
        props.userList.data.map(u =>
          <UserListItem user={u} key={u.id} />
        )
      }

      <Pagination
        totalItem={props.userList.total}
        currentPage={props.userList.page}
        itemsPerPage={props.userList.limit}
        onNavigate={props.onNavigate}
      />
    </div>
  )
}

function CreateUserDialog(
  props: {
    passport: CMSPassport;
    show: boolean;
    onHide: () => void;
    onCreated: (a: TestAccount) => void;
  }
) {

  const onSubmit = (values: SignUpParams, helpers: FormikHelpers<SignUpParams>) => {
    helpers.setSubmitting(true);

    createSandboxUser(props.passport.token, values)
      .then(a => {
        props.onCreated(a);
        props.onHide();
      })
      .catch((err: ResponseError) => {
        toast.error(err.message);
      })
      .finally(() => {
        helpers.setSubmitting(false)
      })
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>New Sandbox Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Test account always ends with <strong>.test@ftchinese.com</strong>. Do not enter the host part. Simply specify the name prefix will work.</p>

        <SandboxAccountForm
          onSubmit={onSubmit}
        />
      </Modal.Body>
    </Modal>
  )
}

function UserListItem(
  props: {
    user: TestAccount
  }
) {
  return (
    <div className='mb-3'>
      <Link to={props.user.id}>
        {props.user.email}
      </Link>
    </div>
  )
}

function useSandboxListState() {
  const { startProgress, stopProgress, progress } = useProgress();
  const [userList, setUserList] = useState<TestUserList>();
  const [errMsg, setErrMsg] = useState('');

  const startLoading = (token: string, page: PagingQuery) => {
    startProgress();

    listSandboxUsers(token, page)
      .then(list => {
        stopProgress();
        setUserList(list);
      })
      .catch((err: ResponseError) => {
        stopProgress();
        setErrMsg(err.message);
      });
  }

  const onNewAccount = (a: TestAccount) => {

    if (userList) {
      setUserList({
        ...userList,
        data: [
          a,
          ...userList.data
        ]
      })
    } else {
      setUserList({
        total: 1,
        page: 1,
        limit: 20,
        data: [
          a
        ]
      })
    }
  };

  return {
    userList,
    progress,
    errMsg,
    startLoading,
    onNewAccount,
  }
}


