import { Outlet } from 'react-router-dom';
import { LiveModeToggler } from '../../features/paywall/LiveModeToggler';
import { useLiveState } from '../../store/useLiveState';
import { RebuildButton } from '../../features/paywall/RebuildButton';
import { ErrorBoudary } from '../../components/ErrorBoundary';
import { LoadingSpinner } from '../../components/progress/LoadingSpinner';
import { useEffect, useState } from 'react';
import { loadPaywall } from '../../repository/paywall';
import { useAuthContext } from '../../store/AuthContext';
import { ResponseError } from '../../repository/response-error';
import { Paywall } from '../../data/paywall';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { DisplayPaywall } from '../../features/paywall/DisplayPaywall';

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

  const { live } = useLiveState();
  const { passport } = useAuthContext();
  const [ err, setErr ] = useState('');
  const [ loading, setLoading ] = useState(true);
  const [ paywall, setPaywall ] = useState<Paywall>();

  if (!passport) {
    return <Unauthorized/>;
  }

  useEffect(() => {
    console.log(`Retrieving paywall data for ${live ? 'live' : 'sandbox'} mode`);

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
          {paywall && <DisplayPaywall paywall={paywall} passport={passport} />}
        </>
      </LoadingSpinner>
    </ErrorBoudary>

  );
}

