import { Modal } from 'react-bootstrap';
import { CMSPassport } from '../../data/cms-account';
import { ModeBadge } from '../../components/text/Badge';
import { StripePriceCard } from './StripePriceCard';
import { StripePriceForm } from './StripePriceForm';
import { FullscreenTwoCols } from '../../components/layout/FullscreenTwoCols';
import { StripePrice } from '../../data/stripe-price';
import { useStripePrice } from './useStripePrice';

export function StripePriceEdit(
  props: {
    price: StripePrice;
    passport: CMSPassport;
    live: boolean;
    show: boolean;
    onHide: () => void;
  }
) {

  const {
    updatePriceMeta
  } = useStripePrice();

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
        <ModeBadge live={props.live} />
      </Modal.Header>

      <Modal.Body>
        <FullscreenTwoCols
          right={
            <StripePriceForm
              onSubmit={updatePriceMeta(props.price, {
                live: props.live,
                token: props.passport.token,
              })}
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
