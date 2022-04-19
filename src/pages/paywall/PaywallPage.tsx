import { Outlet } from 'react-router-dom';
import { LiveModeToggler } from '../../features/paywall/LiveModeToggler';
import { RebuildButton } from '../../features/paywall/RebuildButton';
import { useEffect, useState } from 'react';
import { loadPaywall } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { Paywall } from '../../data/paywall';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { PaywallContent } from '../../features/paywall/PaywallContent';
import { useRecoilValue } from 'recoil';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { paywallRebuiltState } from '../../components/hooks/recoil-state';
import { loadingErrored, ProgressOrError, loadingStarted, loadingStopped } from '../../components/progress/ProgressOrError';

export function PaywallLayout() {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <LiveModeToggler />
        <RebuildButton/>
      </div>
      <Outlet/>
    </>
  );
}

export function PaywallPage() {

  const { live } = useLiveMode();
  const { passport } = useAuth();
  const [ err, setErr ] = useState('');
  const [ loading, setLoading ] = useState(loadingStarted);
  const [ paywall, setPaywall ] = useState<Paywall>();
  const paywallRebuilt = useRecoilValue(paywallRebuiltState);

  if (!passport) {
    return <Unauthorized/>;
  }

  useEffect(() => {
    setPaywall(paywallRebuilt);
  }, [paywallRebuilt.id]);

  useEffect(() => {
    console.log(`Retrieving paywall data for ${live ? 'live' : 'sandbox'} mode`);

    setPaywall(undefined);
    setLoading(loadingStarted());
    console.log('UI reset');

    loadPaywall({
      live,
      token: passport.token,
    })
    .then(pw => {
      setLoading(loadingStopped());
      setPaywall(pw);
      console.log(pw);
    })
    .catch((err: ResponseError) => {
      setLoading(loadingErrored(err.message));
    });

  }, [live]);

  return (
    <ProgressOrError
      state={loading}
    >
      <>
        { paywall &&
          <PaywallContent
            paywall={paywall}
            passport={passport}
          />
        }
      </>
    </ProgressOrError>
  );
}

