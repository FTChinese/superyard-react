import Button from 'react-bootstrap/Button';
import { Flex } from '../../components/layout/Flex';
import { StripeCoupon, StripePrice } from '../../data/stripe-price';
import { CouponAction, CouponItem } from './CouponItem';
import { StripePriceDetail } from './StripePriceDetail';

export function StripePriceScreen(
  props: {
    price: StripePrice;
    coupons: StripeCoupon[];
    handlingCoupon: boolean;
    onNewCoupon: () => void;
    onModifyCoupon: (c: StripeCoupon, action: CouponAction) => void;
  }
) {
  return (
    <>
      <section className="mb-3">
        <h4>Stripe Price Details</h4>

        <StripePriceDetail
          price={props.price}
        />
      </section>

      <section className="mb-3">
        <Flex
          className="mb-2"
          start={<h4>Price Coupons</h4>}
          end={
            <Button
              variant="primary"
              onClick={props.onNewCoupon}
            >
              New
            </Button>
          }
        />

        {
          props.coupons.map((c) => (
            <CouponItem
              key={c.id}
              coupon={c}
              loading={props.handlingCoupon}
              onAction={props.onModifyCoupon}
            />
          ))
        }
      </section>
    </>
  );
}
