import { useAuthContext } from '../../store/AuthContext';
import { ContentLayout } from '../../components/Layout';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { Switch } from '../../components/controls/Switch';
import { useState } from 'react';
import ProgressButton from '../../components/buttons/ProgressButton';
import { Outlet } from 'react-router-dom';

function LiveMode() {
  const [live, setLive] = useState(true);

  return (
    <div className={live ? '' : 'text-danger'}>
      <Switch
        key="live"
        label={live ? 'Live Mode' : 'Sandbox Mode'}
        checked={live}
        onToggle={setLive}
      />
    </div>
  );
}

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
  const { passport } = useAuthContext();

  if (!passport) {
    return <Unauthorized />;
  }


  return (
    <div>Paywall</div>
  );
}



