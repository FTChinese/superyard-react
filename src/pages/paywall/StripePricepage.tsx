import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { useProgress } from '../../components/hooks/useProgress';
import { Unauthorized } from '../../components/middleware/Unauthorized';
import { StripeCoupon } from '../../data/stripe-price';
import { CouponCard, CouponMenu } from '../../features/stripe/CouponCard';
import { CouponListSection } from '../../features/stripe/CouponList';
import { useStripePrice } from '../../features/stripe/useStripePrice';
import { isOneTime } from '../../data/enum';
import { ErrorText } from '../../components/text/ErrorText';
import { StripePriceSection } from '../../features/stripe/StripePriceCard';
import { StripePriceEdit, StripePriceStatusDialog } from '../../features/stripe/StripePriceDialog';
import { CouponEditDialog, CouponPullDialog, CouponStatusDialog } from '../../features/stripe/CouponDialog';
import { toast } from 'react-toastify';
import { useCoupon } from '../../features/stripe/useCoupon';
import { ReqConfig } from '../../http/ReqConfig';

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
      config={{
        live,
        token: passport.token,
      }}
    />
  );
}

function PricePageScreen(
  props: {
    priceId: string;
    config: ReqConfig;
  }
) {

  const { progress } = useProgress();
  const [showPriceEdit, setShowPriceEdit] = useState(false);
  // Show dialog to change price status to activate or deactivate.
  const [showPriceStatus, setShowPriceStatus] = useState(false);

  const [showPullCoupon, setShowPullCoupon] = useState(false);
  // Coupon to edit.
  const [editCoupon, setEditCoupon] = useState<StripeCoupon>();
  // Coupon to activate/deactivate.
  const [statusCouon, setStatusCoupon] = useState<StripeCoupon>();


  const {
    loadPrice,

    price,

    coupons,

    onCouponUpdated,
    onPriceUpdated,
  } = useStripePrice();

  const {
    refreshCoupon,
  } = useCoupon();

  // Load stripe price.
  // Not passing `refresh: true` upon initial loading.
  useEffect(() => {
    loadPrice(props.priceId, props.config);
  }, [props.config.live]);

  if (!price) {
    return <div>Loading stripe price...</div>;
  }

  return (
    <>
      <StripePriceSection
        price={price}
        onRefresh={() => {
          loadPrice(props.priceId, {
            ...props.config,
            refresh: true,
          });
        }}
        progress={progress}
        onActivate={() => {
          setShowPriceStatus(true);
        }}
        onEdit={() => {
          setShowPriceEdit(true);
        }}
      />

      <StripePriceEdit
        config={props.config}
        price={price}
        show={showPriceEdit}
        onHide={() => {
          setShowPriceEdit(false);
        }}
        onSaved={onPriceUpdated}
      />

      <StripePriceStatusDialog
        config={props.config}
        price={price}
        show={showPriceStatus}
        onHide={() => {
          setShowPriceStatus(false);
        }}
        onSaved={(p) => {
          onPriceUpdated(p);
          setShowPriceStatus(false);
        }}
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
                          refreshCoupon(c.id, props.config)
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
            config={props.config}
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
                config={props.config}
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
                config={props.config}
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


