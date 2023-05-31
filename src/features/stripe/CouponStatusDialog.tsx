import Modal from 'react-bootstrap/Modal';
import { ModeBadge } from '../../components/text/Badge';
import { formatCouponAmount, StripeCoupon } from '../../data/stripe-price';
import { isActiveDiscount } from '../../data/enum';
import { useCoupon } from './useCoupon';
import { CMSPassport } from '../../data/cms-account';
import { LoadButton } from '../../components/buttons/Button';

/**
 * Activate or drop a stripe coupon.
 */
export function CouponStatusDialog(
  props: {
    passport: CMSPassport
    live: boolean;
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

  return (
    <Modal
      show={props.show}
      onHide={() => {
        clear();
        props.onHide();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title className="me-3">{ isActive ? 'Cancel' : 'Activate' } Coupon {formatCouponAmount(props.coupon)}</Modal.Title>
        <ModeBadge live={props.live} />
      </Modal.Header>

      <Modal.Body>
        Are you sure you want to { isActive ? 'cancel' : 'activate' } this coupon ?
      </Modal.Body>
      <Modal.Footer>
        <LoadButton
          text='Yes'
          disabled={changing}
          progress={changing}
          onClick={() => {
            changeStatus(props.coupon, {
              live: props.live,
              token: props.passport.token,
            }, props.onSaved);
          }}
        />
      </Modal.Footer>
    </Modal>
  );
}
