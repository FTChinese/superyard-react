import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';
import { Unauthorized } from '../../components/middleware/Unauthorized';
import { getPagingQuery, PagingQuery, serializePagingQuery } from '../../http/paged-list';
import { CMSPassport } from '../../data/cms-account';
import { CenterColumn } from '../../components/layout/Column';
import { TestAccount, TestUserList } from '../../data/reader-account';
import Button from 'react-bootstrap/Button';
import { OnNavigatePage, Pagination } from '../../components/Pagination';
import { Stack } from 'react-bootstrap';
import { useProgress } from '../../components/hooks/useProgress';
import { listSandboxUsers } from '../../repository/reader';
import { useEffect, useState } from 'react';
import { ResponseError } from '../../http/response-error';
import { toast } from 'react-toastify';
import { SandboxAccountDialog } from '../../features/readers/SandboxAccountDialog';
import { Loading } from '../../components/progress/Loading';

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
    return <Loading loading={progress} />
  }

  return (
    <>
      <TestUserListScreen
        userList={userList}
        onClickNew={() => setShow(true)}
        onNavigate={(paged) => setSearchParams(serializePagingQuery(paged))}
      />

      <SandboxAccountDialog
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
  const {
    startProgress,
    stopProgress,
    progress
  } = useProgress();
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
      })
      .finally(() => {
        stopProgress();
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


