import { useState } from 'react';
import { AccountKind } from '../../data/enum';
import { Membership } from '../../data/membership';
import { ReaderAccount } from '../../data/reader-account';
import { ResponseError } from '../../http/response-error';
import { loadFtcAccount, loadWxAccount } from '../../repository/reader';

export function useReaderState() {
  const [progress, setProgress] = useState(false);
  const [readerAccount, setReaderAccount] = useState<ReaderAccount>();

  const [errMsg, setErrMsg] = useState('');

  const loadFtcUser = (token: string, ftcId: string) => {
    setProgress(true);

    loadFtcAccount(token, ftcId)
      .then(a => {
        setReaderAccount(a);
      })
      .catch((err: ResponseError) => {
        setErrMsg(err.message);
      })
      .finally(() => {
        setProgress(false);
      });
  };

  const loadWxUser = (token: string, unionId: string) => {
    setProgress(true);
    loadWxAccount(token, unionId)
      .then(a => {
        setReaderAccount(a);
      })
      .catch((err: ResponseError) => {
        setErrMsg(err.message);
      })
      .finally(() => {
        setProgress(false);
      });
  }

  const loadAccount = (
    token: string,
    props: {
      userId: string,
      kind: AccountKind
    },
  ) => {
    switch (props.kind) {
      case AccountKind.Ftc:
        loadFtcUser(token, props.userId);
        break;

      case AccountKind.Wechat:
        loadWxUser(token, props.userId);
        break;
    }
  }

  const onMemberModified = (m: Membership) => {
    if (!readerAccount) {
      return;
    }

    setReaderAccount({
      ...readerAccount,
      membership: m,
    });
  };

  return {
    errMsg,
    progress,
    readerAccount,
    loadAccount,
    onMemberModified,
  }
}
