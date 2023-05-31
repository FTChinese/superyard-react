import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { useProgress } from '../../components/hooks/useProgress';
import { Unauthorized } from '../../components/middleware/Unauthorized';
import { CMSPassport } from '../../data/cms-account';
import { StripeCoupon, StripePrice, newStripePriceParts } from '../../data/stripe-price';
import { CouponPullDialog } from '../../features/stripe/CouponPullDialog';
import { CouponCard, CouponMenu } from '../../features/stripe/CouponCard';
import { CouponListSection } from '../../features/stripe/CouponList';
import { useStripePrice } from '../../features/stripe/useStripePrice';
import { CouponStatusDialog } from '../../features/stripe/CouponStatusDialog';
import { isOneTime } from '../../data/enum';
import { ErrorText } from '../../components/text/ErrorText';
import { StripePriceSection } from '../../features/stripe/StripePriceCard';
import { StripePriceEdit } from '../../features/stripe/StripePriceEdit';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ModeBadge } from '../../components/text/Badge';
import { concatPriceParts } from '../../data/localization';

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

  const { progress } = useProgress();
  const [showPriceEdit, setShowPriceEdit] = useState(false);
  const [showPullCoupon, setShowPullCoupon] = useState(false);

  // Current coupon to edit/activate/deactivate
  // Since coupon is in a list,
  // we have to save it here so that dialog knows which
  // one is being edited.
  // Editing coupon uses the same dialog as creating new coupon.
  const [editableCoupon, setEditableCoupon] = useState<StripeCoupon>();


  const {
    loadPrice,

    price,
    activatePrice,
    showPriceActivate,
    setShowPriceActivate,

    coupons,
    activateCoupon,
    showCouponActivate,
    setShowCouponActivate,

    onCouponCreated,
    onCouponUpdated,
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

  const onPullCoupon = () => {
    setEditableCoupon(undefined);
    setShowPullCoupon(true);
  };

  // Handle event of clicking coupon edit button
  const onEditCoupon = (c: StripeCoupon) => {
    // Save targeting coupon
    setEditableCoupon(c);
    // show dialog of coupon form.
    setShowPullCoupon(true);
  };

  const onHideCouponForm = () => {
    setEditableCoupon(undefined);
    setShowPullCoupon(false);
  }

  const onCouponUpserted = (c: StripeCoupon) => {
    if (editableCoupon) {
      onCouponUpdated(c);
    } else {
      onCouponCreated(c);
    }

    setEditableCoupon(undefined);
    setShowPullCoupon(false);
  }

  const onActivateOrDropCoupon = (c: StripeCoupon) => {
    // Save targeting coupon;
    setEditableCoupon(c);
    // Show dialog of cofiguring activate or drop.
    setShowCouponActivate(true);
  };

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
          setShowPriceEdit(true);
        }}
      />

      <StripePriceEdit
        price={price}
        passport={props.passport}
        live={props.live}
        show={showPriceEdit}
        onHide={() => {
          setShowPriceEdit(false);
        }}
      />

      <ActivateOrDeactivatePrice
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
          <CouponListSection
              onNewCoupon={onPullCoupon}
              onPull={onPullCoupon}
          >
            <>
            {
              coupons.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  menu={
                    <CouponMenu
                      coupon={coupon}
                      progress={progress}
                      onEdit={onEditCoupon}
                      onActivateOrDrop={onActivateOrDropCoupon}
                    />
                  }
                />
              ))
            }
            </>
          </CouponListSection>

          <CouponPullDialog
            passport={props.passport}
            live={props.live}
            price={price}
            coupon={editableCoupon}
            show={showPullCoupon}
            onHide={onHideCouponForm}
            onCreated={onCouponUpdated}
          />

          {
            editableCoupon &&
              <CouponStatusDialog
                live={props.live}
                coupon={editableCoupon}
                show={showCouponActivate}
                onHide={() => {
                  setEditableCoupon(undefined);
                  setShowCouponActivate(false);
                }}
                onConfirm={(c) => {
                  activateCoupon(c, {
                    live: props.live,
                    token: props.passport.token,
                  });
                }}
                progress={progress}
              />
          }
        </>
      }
    </>
  );
}

/**
 * Activate or deactivate a stripe price.
 */
function ActivateOrDeactivatePrice(
  props: {
    live: boolean;
    price: StripePrice;
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
          {props.price.onPaywall ? 'Deactivate' : 'Activate'} { concatPriceParts(newStripePriceParts(props.price))}
        </Modal.Title>
        <ModeBadge live={props.live} />
      </Modal.Header>

      <Modal.Body>
        Are you sure you want to {props.price.onPaywall ? 'deactivate' : 'activate'} price {props.price.id}
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
