import { useState } from 'react';
import { useAuthContext } from '../../store/AuthContext';
import ProgressButton from '../buttons/ProgressButton';
import { Switch } from '../controls/Switch';
import { ContentLayout } from '../Layout';
import { Unauthorized } from '../routes/Unauthorized';

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

export function PaywallPage() {
  const { passport } = useAuthContext();

  if (!passport) {
    return <Unauthorized />;
  }


  return (
    <ContentLayout>
      <div className="d-flex justify-content-between align-items-center">
        <RebuildButton/>
        <LiveMode />
      </div>
    </ContentLayout>
  );
}



