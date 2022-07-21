import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { Missing, Unauthorized } from '../../components/routes/Unauthorized';
import { CMSPassport } from '../../data/cms-account';
import { CouponFormDialog } from '../../features/stripe/CouponFormDialog';
import { StripePriceScreen } from '../../features/stripe/StripePriceScreen';
import { useStripe } from '../../features/stripe/useStripe';

export function StripePricePage() {
  const { priceId } = useParams<'priceId'>();
  const { passport } = useAuth();

  const { live } = useLiveMode();

  if (!priceId) {
    return <Missing message="Missing price id" />;
  }

  if (!passport) {
    return <Unauthorized />;
  }

  return (
    <PricePageScreen
      priceId={priceId}
      passport={passport}
      live={live}
    />
  );
}

function PricePageScreen(
  props: {
    priceId: string;
    passport: CMSPassport;
    live: boolean;
  }
) {

  const [show, setShow] = useState(false);

  const {
    price,
    loadPrice,
    coupons,
    upsertCoupon,
  } = useStripe();

  // Load stripe price
  useEffect(() => {
    loadPrice(props.priceId, {
      live: props.live,
      token: props.passport.token,
    });
  }, [props.live]);

  if (!price) {
    return <div>Loading stripe price...</div>;
  }

  return (
    <>
      <StripePriceScreen
        price={price}
        coupons={coupons}
        onNewCoupon={() => setShow(true)}
        onUpdateCoupon={(c) => { }}
        onDeleteCoupon={(c) => { }}
      />

      <CouponFormDialog
        passport={props.passport}
        live={props.live}
        price={price}
        show={show}
        onHide={() => setShow(false)}
        onCreated={upsertCoupon}
      />
    </>
  );
}
