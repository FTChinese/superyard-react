import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { useProgress } from '../../components/hooks/useProgress';
import { Unauthorized } from '../../components/middleware/Unauthorized';
import { CMSPassport } from '../../data/cms-account';
import { StripeCoupon, StripePrice } from '../../data/stripe-price';
import { CouponUpsertDialog } from '../../features/stripe/CouponUpsertDialog';
import { CouponAction } from '../../features/stripe/CouponItem';
import { CouponList } from '../../features/stripe/CouponList';
import { useStripePrice } from '../../features/stripe/useStripePrice';
import { CancelCouponDialog } from '../../features/stripe/CancelCouponDialog';
import { isOneTime } from '../../data/enum';
import { toast } from 'react-toastify';
import { ErrorText } from '../../components/text/ErrorText';
import { StripePriceSection } from '../../features/stripe/StripePriceCard';
import { StripePriceEdit } from '../../features/stripe/StripePriceEdit';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ModeBadge } from '../../components/text/Badge';
import { localizedTier } from '../../data/localization';

export function StripePricePage() {
  const { priceId } = useParams<'priceId'>();
  const { passport } = useAuth();

  const { live } = useLiveMode();

  if (!priceId) {
    return <ErrorText message="Missing price id" />;
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
  const [showEdit, setShowEdit] = useState(false);

  const {
    price,
    loadPrice,

    activatePrice,
    showPriceActivate,
    setShowPriceActivate,

    coupons,
    onCouponCreated,
    onCouponUpdated,
    activateCoupon,
  } = useStripePrice();

  // Load stripe price.
  // Not passing `refresh: true` upon initial loading.
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
      <StripePriceSection
        price={price}
        onRefresh={() => {
          loadPrice(props.priceId, {
            live: props.live,
            token: props.passport.token,
            refresh: true,
          });
        }}
        progress={progress}
        onActivate={() => {
          setShowPriceActivate(true);
        }}
        onEdit={() => {
          setShowEdit(true);
        }}
      />

      <StripePriceEdit
        price={price}
        passport={props.passport}
        live={props.live}
        show={showEdit}
        onHide={() => {
          setShowEdit(false);
        }}
      />

      <ActivateOrDeactivate
        price={price}
        live={props.live}
        show={showPriceActivate}
        onHide={() => {
          setShowPriceActivate(false);
        }}
        onClick={() => {
          activatePrice(price, {
            live: props.live,
            token: props.passport.token,
          });
        }}
        progress={progress}
      />

      {
        isOneTime(price.kind) ?
        <div className='text-danger'>
          Introductory price cannot have any coupons
        </div> :
        <>
          <CouponList
            coupons={coupons}
            handlingCoupon={progress}
            onNewCoupon={() => {
              if (isOneTime(price.kind)) {
                toast.error('Introductory price cannot have coupons');
                return;
              }
              setShowForm(true);
            }}
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
      }
    </>
  );
}

function ActivateOrDeactivate(
  props: {
    price: StripePrice;
    live: boolean;
    show: boolean;
    onHide: () => void;
    onClick: () => void;
    progress: boolean;
  }
) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className="me-3">
          {props.price.onPaywall ? 'Deactivate' : 'Activate'} Stripe Price
        </Modal.Title>
        <ModeBadge live={props.live} />
      </Modal.Header>

      <Modal.Body>
        Are you sure you want to {props.price.onPaywall ? 'deactivate' : 'activate'} price {props.price.id} {localizedTier(props.price.tier)}
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={props.onClick}
          disabled={props.progress}
        >
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
