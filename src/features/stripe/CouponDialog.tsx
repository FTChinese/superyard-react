import { StripeCoupon, StripePrice, formatCouponAmount, newStripePriceParts } from '../../data/stripe-price';
import { ModeBadge } from '../../components/text/Badge';
import { FullscreenTwoCols } from '../../components/layout/FullscreenTwoCols';
import { CouponForm } from './CouponForm';
import { CouponCard } from './CouponCard';
import { useCoupon } from './useCoupon';
import { ReqConfig } from '../../http/ReqConfig';
import { FullscreenDialog } from '../../components/dialog/FullscreenDialog';
import { SearchBox } from '../../components/forms/SearchBox';
import { PriceHighlight } from '../../components/text/PriceHighlight';
import { ConfirmDialog } from '../../components/dialog/ConfirmDialog';
import { isActiveDiscount } from '../../data/enum';

export function CouponEditDialog(
  props: {
    show: boolean;
    onHide: () => void;
    config: ReqConfig
    coupon: StripeCoupon;
    onSaved: (c: StripeCoupon) => void;
  }
) {

  const {
    clear,
    updateCoupon,
  } = useCoupon();

  return (
    <FullscreenDialog
      show={props.show}
      onHide={() => {
        clear();
        props.onHide();
      }}
      title='Edit coupon'
      headerExtra={<ModeBadge live={props.config.live} />}
    >
      <FullscreenTwoCols
        right={
          <CouponForm
            onSubmit={
              updateCoupon(
                props.coupon,
                props.config,
                props.onSaved,
              )
            }
            coupon={props.coupon}
          />
        }
      >
        <CouponCard
          coupon={props.coupon}
          menu={null}
        />
      </FullscreenTwoCols>
    </FullscreenDialog>
  );
}

export function CouponPullDialog(props: {
  config: ReqConfig,
  price: StripePrice;
  show: boolean;
  onHide: () => void;
  onSaved: (c: StripeCoupon) => void;
}) {

  const {
    loading,
    getCoupon,
    couponFound,
    clear,
    attachCoupon,
  } = useCoupon();

  return (
    <FullscreenDialog
      show={props.show}
      onHide={() => {
        clear();
        props.onHide();
      }}
      title='Pull a coupon from Stripe and edit it'
      headerExtra={<ModeBadge live={props.config.live} />}
    >
      <>
        <div className='text-center mb-5'>
          <h6>
            Coupon attached to this price
          </h6>
          <PriceHighlight
            parts={
              newStripePriceParts(props.price)
            }
          />
        </div>

        <FullscreenTwoCols
          right={
            couponFound &&
            <CouponForm
              onSubmit={
                attachCoupon(
                  props.price,
                  props.config,
                  props.onSaved,
                )
              }
              coupon={couponFound}
            />
          }
        >
          <>
            <SearchBox
              controlId='s'
              onSubmit={(id) => {
                getCoupon(id, props.config);
              }}
              label='Search Stripe Coupon'
              progress={loading}
              disabled={loading}
              placeholder='Enter Stripe Coupon ID'
              desc={"Copy coupon id from Stripe dashboard and it will be synced to FTC's database"}
            />

            {
              couponFound && <CouponCard
                coupon={couponFound}
                menu={null}
              />
            }
          </>
        </FullscreenTwoCols>
      </>
    </FullscreenDialog>
  );
}

/**
 * Activate or drop a stripe coupon.
 */
export function CouponStatusDialog(
  props: {
    config: ReqConfig;
    coupon: StripeCoupon;
    show: boolean;
    onHide: () => void;
    onSaved: (c: StripeCoupon) => void;
  }
) {

  const isActive = isActiveDiscount(props.coupon.status);

  const {
    clear,
    changeStatus,
    changing,
  } = useCoupon();

  const title = `${isActive ? 'Cancel' : 'Activate'} Coupon ${formatCouponAmount(props.coupon)}`;

  const body = `Are you sure you want to ${ isActive ? 'cancel' : 'activate' } this coupon ?`

  return (
    <ConfirmDialog
      show={props.show}
      onHide={() => {
        clear();
        props.onHide();
      }}
      title={title}
      body={body}
      live={props.config.live}
      onConfirm={() => {
        changeStatus(props.coupon, props.config, props.onSaved);
      }}
      progress={changing}
    />
  );
}
