import Modal from 'react-bootstrap/Modal';
import { CMSPassport } from '../../data/cms-account';
import { useStripeList } from './useStripeList';
import { ModeBadge } from '../../components/text/Badge';
import { StripePriceForm } from './StripePriceForm';
import { SearchBox } from '../../components/forms/SearchBox';
import { StripePriceCard } from './StripePriceCard';
import { FullscreenTwoCols } from '../../components/layout/FullscreenTwoCols';
import { FullscreenSingleCol } from '../../components/layout/FullscreenSingleCol';

export function StripePricePull(
  props: {
    passport: CMSPassport;
    live: boolean;
    show: boolean;
    onHide: () => void;
  }
) {
  const {
    loadingPrice,
    loadPrice,
    price,
  } = useStripeList();

  return (
    <Modal
      show={props.show}
      fullscreen={true}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className="me-3">
          Set Stripe Price Metadata
        </Modal.Title>
        <ModeBadge live={props.live} />
      </Modal.Header>

      <Modal.Body>
        <FullscreenSingleCol>
          <>
            <SearchBox
              controlId='s'
              onSubmit={(priceId) => {
                loadPrice(priceId, {
                  live: props.live,
                  token: props.passport.token,
                });
              }}
              label="Search Stripe Price"
              progress={loadingPrice}
              disabled={loadingPrice}
              placeholder='Enter Stripe Price ID'
              desc="You need to load a price first by copying price id from Stripe dashboard"
            />
            {
              price &&
              <StripePriceCard
                price={price}
              />
            }
          </>
        </FullscreenSingleCol>
      </Modal.Body>
    </Modal>
  );
}
