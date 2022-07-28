import { useState } from 'react';
import { ResponseError } from '../../http/response-error';
import { deleteMember } from '../../repository/reader';

export function useMemberState() {
  const [progress, setProgress] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const dropMember = (token: string, compoundId: string): Promise<boolean> => {
    setProgress(true);

    return deleteMember(token, compoundId)
      .then(ok => {
        if (!ok) {
          setErrMsg('Failed')
        }
        return ok;
      })
      .catch((err: ResponseError) => {
        setErrMsg(err.message);
        return false;
      })
      .finally(() => {
        setProgress(false);
      });
  }

  return {
    progress,
    errMsg,
    dropMember,
  }
}
