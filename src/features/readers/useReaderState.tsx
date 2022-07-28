import { useState } from 'react';
import { useProgress } from '../../components/hooks/useProgress';
import { Membership } from '../../data/membership';
import { ReaderAccount } from '../../data/reader-account';
import { ResponseError } from '../../http/response-error';
import { loadFtcAccount } from '../../repository/reader';

export function useReaderState() {
  const {
    startProgress,
    stopProgress,
  } = useProgress();

  const [readerAccount, setReaderAccount] = useState<ReaderAccount>();

  const [errMsg, setErrMsg] = useState('');

  const loadReader = (token: string, ftcId: string) => {
    startProgress();

    loadFtcAccount(token, ftcId)
      .then(a => {
        setReaderAccount(a);
      })
      .catch((err: ResponseError) => {
        setErrMsg(err.message);
      })
      .finally(() => {
        stopProgress();
      });
  };

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
    readerAccount,
    loadReader,
    onMemberModified,
  }
}
