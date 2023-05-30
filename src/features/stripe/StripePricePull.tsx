import Modal from 'react-bootstrap/Modal';
import { CMSPassport } from '../../data/cms-account';
import { useStripeList } from './useStripeList';
import { ModeBadge } from '../../components/text/Badge';
import { SearchBox } from '../../components/forms/SearchBox';
import { StripePriceCard } from './StripePriceCard';
import { FullscreenSingleCol } from '../../components/layout/FullscreenSingleCol';
import { Link } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';

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
          Sync a Stripe Price
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
              desc="Copying price id from Stripe dashboard and it will be synced to FTC's database"
            />
            {
              price &&
              <>
                <p>You can now edit this price <Link to={sitemap.stripePriceOf(price.id)}>here</Link></p>

                <StripePriceCard
                  price={price}
                />

              </>
            }
          </>
        </FullscreenSingleCol>
      </Modal.Body>
    </Modal>
  );
}
