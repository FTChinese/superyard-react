import { useState } from 'react';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { Unauthorized } from '../../components/middleware/Unauthorized';
import { CMSPassport } from '../../data/cms-account';
import { useStripeList } from '../../features/stripe/useStripeList';
import { Loading } from '../../components/progress/Loading';
import { Flex } from '../../components/layout/Flex';
import { StripePriceDialog } from '../../features/stripe/StripePriceDialog';

export function StripePricesPage() {
  const { live } = useLiveMode();
  const { passport } = useAuth();

  if (!passport) {
    return <Unauthorized />;
  }

  return (
    <StripePriceListScreen
      passport={passport}
      live={live}
    />
  )
}

function StripePriceListScreen(
  props: {
    passport: CMSPassport,
    live: boolean,
  }
) {
  const [showForm, setShowForm] = useState(false);

  return (
    <Loading loading={false}>
      <div>
        <Flex
          start={
            <h2 className="mb-3">Stripe Prices</h2>
          }
          end={
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              New
            </button>
          }
        />

        <StripePriceDialog
          passport={props.passport}
          live={props.live}
          show={showForm}
          onHide={() => {
            setShowForm(false);
          }}
        />
      </div>
    </Loading>
  );
}
