import { useState } from 'react';
import ProgressButton from '../../components/buttons/ProgressButton';
import { Outlet } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { LiveMode } from '../../features/paywall/LiveMode';
import { liveModeState } from '../../store/state';


function RebuildButton() {
  const [submitting, setSubmitting] = useState(false);

  const handleRebuild = () => {
    setSubmitting(true);
    console.log('Start rebuiding paywall...');
  };

  return (
    <ProgressButton
      disabled={submitting}
      text="Rebuild Paywall"
      isSubmitting={submitting}
      onClick={handleRebuild}
    />
  )
}

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

  const [ live, setLive ] = useRecoilState(liveModeState);

  return (
    <div>Use paywall data for {live ? 'live mode' : 'sandbox mode'}</div>
  );
}



