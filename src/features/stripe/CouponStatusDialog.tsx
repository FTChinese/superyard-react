import Modal from 'react-bootstrap/Modal';
import { ModeBadge } from '../../components/text/Badge';
import { formatCouponAmount, StripeCoupon } from '../../data/stripe-price';
import { isActiveDiscount } from '../../data/enum';
import Button from 'react-bootstrap/Button';

/**
 * Activate or drop a stripe coupon.
 */
export function CouponStatusDialog(
  props: {
    live: boolean;
    coupon: StripeCoupon;
    show: boolean;
    onHide: () => void;
    onConfirm: (c: StripeCoupon) => void;
    progress: boolean;
  }
) {

  const isActive = isActiveDiscount(props.coupon.status);

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className="me-3">{ isActive ? 'Drop' : 'Activate' } Coupon {formatCouponAmount(props.coupon)}</Modal.Title>
        <ModeBadge live={props.live} />
      </Modal.Header>

      <Modal.Body>
        Are you sure you want to drop this coupon ?
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => props.onConfirm(props.coupon)}
          disabled={props.progress}
        >
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
