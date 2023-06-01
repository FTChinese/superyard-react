import { Modal } from 'react-bootstrap';
import { ModeBadge } from '../../components/text/Badge';
import { StripePriceCard } from './StripePriceCard';
import { StripePriceForm } from './StripePriceForm';
import { FullscreenTwoCols } from '../../components/layout/FullscreenTwoCols';
import { StripePrice } from '../../data/stripe-price';
import { usePriceUpsert } from './usePriceUpsert';
import { ReqConfig } from '../../http/ReqConfig';

export function StripePriceEdit(
  props: {
    config: ReqConfig,
    price: StripePrice;
    show: boolean;
    onHide: () => void;
    onSaved: (p: StripePrice) => void;
  }
) {

  const {
    updatePrice,
  } = usePriceUpsert();

  return (
    <Modal
      show={props.show}
      fullscreen={true}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className="me-3">
          Update Stripe Price Metadata
        </Modal.Title>
        <ModeBadge live={props.config.live} />
      </Modal.Header>

      <Modal.Body>
        <FullscreenTwoCols
          right={
            <StripePriceForm
              onSubmit={
                updatePrice(
                  props.price,
                  props.config,
                  props.onSaved
                )
              }
              price={props.price}
            />
          }
        >
          <StripePriceCard
            price={props.price}
          />
        </FullscreenTwoCols>
      </Modal.Body>
    </Modal>
  );
}
