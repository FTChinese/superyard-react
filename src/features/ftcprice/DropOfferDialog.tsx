import { useState } from 'react';
import { CMSPassport } from '../../data/cms-account';
import { Discount } from '../../data/ftc-price';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import { dropFtcOffer } from '../../repository/paywall';
import { toast } from 'react-toastify';
import { ResponseError } from '../../http/response-error';
import { PaywallPrice } from '../../data/paywall';

export function DropOfferDialog(
  props: {
    passport: CMSPassport;
    live: boolean;
    offer: Discount;
    show: boolean;
    onHide: () => void;
    onDropped: (price: PaywallPrice) => void;
  }
) {
  const [progress, setProgress] = useState(false);

  const handleDrop = () => {
    setProgress(true);

    dropFtcOffer(
      props.offer.id,
      {
        live: props.live,
        token: props.passport.token
      }
    )
      .then((pwp) => {
        setProgress(false);
        toast.success('Dropped!');
        props.onDropped(pwp);
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
      <Modal.Header closeButton>Drop discount</Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to drop discount ({props.offer.id}) with price
          off ¥{props.offer.priceOff}, used for {props.offer.kind} during{' '}
          {props.offer.startUtc} to {props.offer.endUtc}?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" disabled={progress} onClick={handleDrop}>
          {progress ? 'Processing...' : 'Drop'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
