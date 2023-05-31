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
import { CouponEditDialog } from '../../features/stripe/CouponEditDialog';
import { toast } from 'react-toastify';
import { useCoupon } from '../../features/stripe/useCoupon';

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

  // Coupon to edit.
  const [editCoupon, setEditCoupon] = useState<StripeCoupon>();
  // Coupon to activate/deactivate.
  const [statusCouon, setStatusCoupon] = useState<StripeCoupon>();


  const {
    loadPrice,

    price,
    activatePrice,
    showPriceActivate,
    setShowPriceActivate,

    coupons,

    onCouponUpdated,
  } = useStripePrice();

  const {
    refreshCoupon,
  } = useCoupon();

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
              onNewCoupon={() => {
                toast.info('Not implemented!')
              }}
              onPull={() => {
                setShowPullCoupon(true)
              }}
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
                        onEdit={setEditCoupon}
                        onActivateOrDrop={setStatusCoupon}
                        onRefresh={(c) => {
                          refreshCoupon(c.id, {
                            live: props.live,
                            token: props.passport.token
                          })
                            .then(refreshed => {
                              if (refreshed) {
                                onCouponUpdated(refreshed);
                              }
                            })
                        }}
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
            show={showPullCoupon}
            onHide={() => {
              setShowPullCoupon(false)
            }}
            onSaved={onCouponUpdated}
          />

          {
            editCoupon &&
              <CouponEditDialog
                passport={props.passport}
                live={props.live}
                show={!!editCoupon}
                coupon={editCoupon}
                onHide={() => {
                  setEditCoupon(undefined);
                }}
                onSaved={onCouponUpdated}
              />
          }

          {
            statusCouon &&
              <CouponStatusDialog
                passport={props.passport}
                live={props.live}
                coupon={statusCouon}
                show={!!statusCouon}
                onHide={() => {
                  setStatusCoupon(undefined);
                }}
                onSaved={(c) => {
                  onCouponUpdated(c);
                  setStatusCoupon(undefined);
                }}
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
