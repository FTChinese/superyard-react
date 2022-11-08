import { Outlet } from 'react-router-dom';
import { LiveModeToggler } from '../../features/paywall/LiveModeToggler';
import { RebuildButton } from '../../features/paywall/RebuildButton';
import { useEffect } from 'react';
import { Unauthorized } from '../../components/middleware/Unauthorized';
import { PaywallContent } from '../../features/paywall/PaywallContent';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { usePaywall } from '../../components/hooks/usePaywall';
import { LoadingOrError } from '../../components/progress/LoadingOrError';

export function PaywallLayout() {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <LiveModeToggler />
        <RebuildButton />
      </div>
      <Outlet />
    </>
  );
}

export function PaywallPage() {
  const { live } = useLiveMode();
  const { passport } = useAuth();
  const {
    pwErr,
    progress,
    forceLoadPaywall,
    paywall
  } = usePaywall();

  if (!passport) {
    return <Unauthorized />;
  }

  useEffect(() => {
    console.log(
      `Retrieving paywall data for ${live ? 'live' : 'sandbox'} mode`
    );

    forceLoadPaywall(passport.token, live);
  }, [live]);

  if (pwErr) {
    return <LoadingOrError loading={false} error={pwErr} />
  }

  if (!paywall) {
    return null;
  }

  return (
    <PaywallContent paywall={paywall} passport={passport} />
  );
}
