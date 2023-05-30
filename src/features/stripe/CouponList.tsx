import Button from 'react-bootstrap/Button';
import { StripeCoupon } from '../../data/stripe-price';
import { CouponAction, CouponItem } from './CouponItem';
import Stack from 'react-bootstrap/Stack';

export function CouponList(
  props: {
    coupons: StripeCoupon[];
    handlingCoupon: boolean;
    onNewCoupon: () => void;
    onModifyCoupon: (c: StripeCoupon, action: CouponAction) => void;
  }
) {
  return (
    <section className="mb-3">
      <Stack direction="horizontal">
        <h4>Price Coupons</h4>
        <Button
          className="ms-auto"
          variant="primary"
          onClick={props.onNewCoupon}
        >
          New
        </Button>
      </Stack>
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
  );
}
