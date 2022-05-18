import { loadingStopped, ProgressOrError } from '../../components/progress/ProgressOrError';

export function LegalDetailPage() {
  return (
    <ProgressOrError
      state={loadingStopped()}
    >
      <></>
    </ProgressOrError>
  );
}
