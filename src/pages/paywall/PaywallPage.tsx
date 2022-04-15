import { Outlet } from 'react-router-dom';
import { LiveModeToggler } from '../../features/paywall/LiveModeToggler';
import { RebuildButton } from '../../features/paywall/RebuildButton';
import { ErrorBoudary } from '../../components/ErrorBoundary';
import { LoadingSpinner } from '../../components/progress/LoadingSpinner';
import { useEffect, useState } from 'react';
import { loadPaywall } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { Paywall } from '../../data/paywall';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { PaywallContent } from '../../features/paywall/PaywallContent';
import { useRecoilValue } from 'recoil';
import { liveModeState, paywallRebuiltState } from '../../store/recoil-state';
import { useAuth } from '../../components/hooks/useAuth';

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

  const live = useRecoilValue(liveModeState);
  const { passport } = useAuth();
  const [ err, setErr ] = useState('');
  const [ loading, setLoading ] = useState(true);
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
    setLoading(true);
    console.log('UI reset');

    loadPaywall({
      live,
      token: passport.token,
    })
    .then(pw => {
      setLoading(false);
      setPaywall(pw);
      console.log(pw);
    })
    .catch((err: ResponseError) => {
      setLoading(false);
      setErr(err.message);
    });

  }, [live]);

  return (
    <ErrorBoudary
      errMsg={err}
    >
      <LoadingSpinner
        loading={loading}
      >
        <>
          { paywall &&
            <PaywallContent
              paywall={paywall}
              passport={passport}
            />
          }
        </>
      </LoadingSpinner>
    </ErrorBoudary>

  );
}

