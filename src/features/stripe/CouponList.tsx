import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';

export function CouponListSection(
  props: {
    onNewCoupon: () => void;
    children: JSX.Element | null;
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
      {props.children}
    </section>
  );
}
