import { useState } from 'react';
import ProgressButton from '../../components/buttons/ProgressButton';

export function RebuildButton() {
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
