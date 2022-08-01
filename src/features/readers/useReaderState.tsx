import { useState } from 'react';
import { Membership } from '../../data/membership';
import { ReaderAccount } from '../../data/reader-account';
import { ResponseError } from '../../http/response-error';
import { loadFtcAccount } from '../../repository/reader';

export function useReaderState() {
  const [progress, setProgress] = useState(false);
  const [readerAccount, setReaderAccount] = useState<ReaderAccount>();

  const [errMsg, setErrMsg] = useState('');

  const loadReader = (token: string, ftcId: string) => {
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
    loadReader,
    onMemberModified,
  }
}
