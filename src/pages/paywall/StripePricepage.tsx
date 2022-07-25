import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { useProgress } from '../../components/hooks/useProgress';
import { Missing, Unauthorized } from '../../components/routes/Unauthorized';
import { CMSPassport } from '../../data/cms-account';
import { StripeCoupon } from '../../data/stripe-price';
import { CouponUpsertDialog } from '../../features/stripe/CouponUpsertDialog';
import { CouponAction } from '../../features/stripe/CouponItem';
import { StripePriceScreen } from '../../features/stripe/StripePriceScreen';
import { useStripe } from '../../features/stripe/useStripe';
import { CancelCouponDialog } from '../../features/stripe/CancelCouponDialog';

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

  const [showForm, setShowForm] = useState(false);
  const [editCoupon, setEditCoupon] = useState<StripeCoupon>();
  const [alertDelete, setAlertDelete] = useState<StripeCoupon>();
  const { progress } = useProgress();

  const {
    price,
    loadPrice,
    coupons,
    onCouponCreated,
    onCouponUpdated,
    activateCoupon,
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

  const modifyCoupon = (c: StripeCoupon, action: CouponAction) => {
    switch (action) {
      case CouponAction.Edit:
        setEditCoupon(c);
        setShowForm(true);
        break;

      case CouponAction.Drop:
        setAlertDelete(c);
        break;

      case CouponAction.Activate:
        activateCoupon(
          c.id,
          {
            live: props.live,
            token: props.passport.token,
          }
        );
        break;
    }
  }

  return (
    <>
      <StripePriceScreen
        price={price}
        coupons={coupons}
        handlingCoupon={progress}
        onNewCoupon={() => setShowForm(true)}
        onModifyCoupon={modifyCoupon}
      />

      <CouponUpsertDialog
        passport={props.passport}
        live={props.live}
        price={price}
        coupon={editCoupon}
        show={showForm}
        onHide={() => {
          setEditCoupon(undefined);
          setShowForm(false);
        }}
        onCreated={(c) => {
          if (editCoupon) {
            onCouponUpdated(c);
          } else {
            onCouponCreated(c);
          }

          setEditCoupon(undefined);
          setShowForm(false);
        }}
      />

      {
        alertDelete &&
        <CancelCouponDialog
          passport={props.passport}
          live={props.live}
          coupon={alertDelete}
          show={!!alertDelete}
          onHide={() => setAlertDelete(undefined)}
          onCancelled={(c) => {
            onCouponUpdated(c);
            setAlertDelete(undefined);
          }}
        />
      }

    </>
  );
}
