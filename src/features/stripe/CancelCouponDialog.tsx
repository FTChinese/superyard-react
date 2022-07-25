import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { OButton, SpinnerOrText } from '../../components/buttons/Button';
import { ModeBadge } from '../../components/text/Badge';
import { CMSPassport } from '../../data/cms-account';
import { formatCouponAmount, StripeCoupon } from '../../data/stripe-price';
import { ResponseError } from '../../http/response-error';
import { deleteStripeCoupon } from '../../repository/stripe';

export function CancelCouponDialog(
  props: {
    passport: CMSPassport;
    live: boolean;
    coupon: StripeCoupon;
    show: boolean;
    onHide: () => void;
    onCancelled: (c: StripeCoupon) => void;
  }
) {

  const [progress, setProgress] = useState(false);

  const onCancel = () => {
    setProgress(true);

    deleteStripeCoupon(
      props.coupon.id,
      {

        live: props.live,
        token: props.passport.token
      }
    )
      .then(c => {
        setProgress(false);
        props.onCancelled(c);
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        toast.error(err.message);
      });
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className="me-3">Drop Coupon {formatCouponAmount(props.coupon)}</Modal.Title>
        <ModeBadge live={props.live} />
      </Modal.Header>

      <Modal.Body>
        Are you sure you want to drop this coupon ?
      </Modal.Body>
      <Modal.Footer>
        <OButton
          onClick={onCancel}
        >
          <SpinnerOrText
            text='Yes'
            progress={progress}
          />
        </OButton>
      </Modal.Footer>
    </Modal>
  );
}
