import { Outlet } from 'react-router-dom';
import { LiveMode } from '../../features/paywall/LiveMode';
import { useLiveState } from '../../store/useLiveState';
import { RebuildButton } from '../../features/paywall/RebuildButton';

export function PaywallLayout() {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <LiveMode />
        <RebuildButton/>
      </div>
      <Outlet/>
    </>
  );
}

export function PaywallPage() {

  const { live } = useLiveState();

  return (
    <div>Use paywall data for {live ? 'live mode' : 'sandbox mode'}</div>
  );
}



