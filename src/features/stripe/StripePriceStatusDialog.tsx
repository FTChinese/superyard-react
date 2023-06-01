import Modal from 'react-bootstrap/esm/Modal';
import { StripePrice, newStripePriceParts } from '../../data/stripe-price';
import { ModeBadge } from '../../components/text/Badge';
import { concatPriceParts } from '../../data/localization';
import { LoadButton } from '../../components/buttons/Button';
import { ReqConfig } from '../../http/ReqConfig';
import { usePriceUpsert } from './usePriceUpsert';

/**
 * Activate or deactivate a stripe price.
 */
export function StripePriceStatusDialog(
  props: {
    config: ReqConfig,
    price: StripePrice;
    show: boolean;
    onHide: () => void;
    onSaved: (p: StripePrice) => void;
  }
) {

  const {
    changingStatus,
    changeStatus,
  } = usePriceUpsert();

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className="me-3">
          {props.price.onPaywall ? 'Deactivate' : 'Activate'} { concatPriceParts(newStripePriceParts(props.price))}
        </Modal.Title>
        <ModeBadge live={props.config.live} />
      </Modal.Header>

      <Modal.Body>
        Are you sure you want to {props.price.onPaywall ? 'deactivate' : 'activate'} price {props.price.id}
      </Modal.Body>

      <Modal.Footer>
        <LoadButton
          text='Yes'
          disabled={changingStatus}
          onClick={() => {
            changeStatus(
              props.price,
              props.config,
              props.onSaved
            )
          }}
          progress={changingStatus}
        />
      </Modal.Footer>
    </Modal>
  )
}
