import { useState } from 'react';
import { atom, useRecoilState } from 'recoil';
import { Paywall } from '../../data/paywall';
import { ResponseError } from '../../http/response-error';
import { loadPaywall } from '../../repository/paywall';

const paywallState = atom<Paywall | undefined>({
  key: 'paywallRebuilt',
  default: undefined,
});

export function usePaywall() {
  const [pwErr, setPwErr] = useState('');
  const [progress, setProgress] = useState(false);
  const [paywall, setPaywall] = useRecoilState(paywallState);

  const forceLoadPaywall = (token: string, live: boolean) => {
    setProgress(true);

    loadPaywall({ token, live })
      .then(pw => {
        setPaywall(pw);
      })
      .catch((err: ResponseError) => {
        setPwErr(err.message);
      })
      .finally(() => {
        setProgress(false)
      });
  };

  const loadPaywallIfEmpty = (token: string, live: boolean) => {
    if (paywall) {
      return;
    }

    forceLoadPaywall(token, live);
  }

  return {
    pwErr,
    progress,
    forceLoadPaywall,
    loadPaywallIfEmpty,
    paywall,
    setPaywall,
  }
}

