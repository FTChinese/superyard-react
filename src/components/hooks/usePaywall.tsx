import { useState } from 'react';
import { atom, useRecoilState } from 'recoil';
import { Banner, Paywall, Promo } from '../../data/paywall';
import { ResponseError } from '../../http/response-error';
import { loadPaywall } from '../../repository/paywall';
import { useProgress } from './useProgress';
import { ReqConfig } from '../../http/ReqConfig';

const paywallState = atom<Paywall | undefined>({
  key: 'paywallRebuilt',
  default: undefined,
});

export function usePaywall() {
  const [pwErr, setPwErr] = useState('');
  const {progress, setProgress} = useProgress();
  const [paywall, setPaywall] = useRecoilState(paywallState);

  const forceLoadPaywall = (config: ReqConfig) => {
    setProgress(true);

    loadPaywall(config)
      .then(pw => {
        setPaywall(pw);
      })
      .catch((err: ResponseError) => {
        setPwErr(err.message);
      })
      .finally(() => {
        setProgress(false);
      });
  };

  const loadPaywallIfEmpty = (config: ReqConfig) => {
    if (paywall && paywall.liveMode === config.live) {
      return;
    }

    forceLoadPaywall(config);
  }

  const onBannerUpdated = (b: Banner) => {
    if (paywall) {
      setPaywall({
        ...paywall,
        banner: b,
      })
    }
  }

  const onPromoUpdated = (p: Promo) => {
    if (paywall) {
      setPaywall({
        ...paywall,
        promo: p,
      })
    }
  }

  return {
    pwErr,
    progress,
    forceLoadPaywall,
    loadPaywallIfEmpty,
    paywall,
    setPaywall,
    onBannerUpdated,
    onPromoUpdated,
  }
}

