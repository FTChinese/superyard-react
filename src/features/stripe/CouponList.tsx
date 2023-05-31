import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';

export function CouponListSection(
  props: {
    onNewCoupon: () => void;
    onPull: () => void;
    children: JSX.Element | null; // Render a list of coupons.
  }
) {
  return (
    <section className="mb-3">
      <Stack direction="horizontal">
        <h4>Price Coupons</h4>
        <ButtonGroup
          className="ms-auto"
        >
          <Button
            variant="outline-primary"
            onClick={props.onPull}
          >
            Pull
          </Button>
          <Button
            onClick={props.onNewCoupon}
          >
            New
          </Button>
        </ButtonGroup>
      </Stack>
      <ul>
        <li>Click New button to create a new coupon without visiting Stripe dashboard</li>
        <li>Click Pull button to sync an existing coupon to FTC's database.</li>
      </ul>
      {props.children}
    </section>
  );
}
