import Modal from 'react-bootstrap/Modal';
import { ModeBadge } from '../../components/text/Badge';
import { PriceHighlight } from '../../components/text/PriceHighlight';
import {
  newStripePriceParts,
  StripeCoupon,
  StripePrice,
} from '../../data/stripe-price';
import { CouponForm } from './CouponForm';
import { FullscreenTwoCols } from '../../components/layout/FullscreenTwoCols';
import { useCoupon } from './useCoupon';
import { SearchBox } from '../../components/forms/SearchBox';
import { CouponCard } from './CouponCard';
import { ReqConfig } from '../../http/ReqConfig';

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
    <Modal
      show={props.show}
      fullscreen={true}
      onHide={() => {
        clear();
        props.onHide();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title className="me-3">
          Pull a coupon from Stripe and edit it
        </Modal.Title>
        <ModeBadge live={props.config.live} />
      </Modal.Header>

      <Modal.Body>
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
      </Modal.Body>
    </Modal>
  );
}
