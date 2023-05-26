import { Modal } from 'react-bootstrap';
import { CMSPassport } from '../../data/cms-account';
import { ModeBadge } from '../../components/text/Badge';
import { FullscreenSingleCol } from '../../components/layout/FullscreenSingleCol';
import { SearchBox } from '../../components/forms/SearchBox';
import { useStripeList } from './useStripeList';
import { StripePriceDetail } from './StripePriceDetail';
import { StripePriceForm, StripePriceFormVal, buildStripePriceParams } from './StripePriceForm';
import { FormikHelpers } from 'formik';
import { FullscreenTwoCols } from '../../components/layout/FullscreenTwoCols';

export function StripePriceDialog(
  props: {
    passport: CMSPassport;
    live: boolean;
    show: boolean;
    onHide: () => void;
  }
) {

  const {
    loading,
    loadPrice,
    price,
    updatePriceMeta
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
        <FullscreenTwoCols
          right={
            price &&
            <StripePriceForm
              onSubmit={updatePriceMeta(price, {
                live: props.live,
                token: props.passport.token,
              })}
              price={price}
            />
          }
        >
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
              progress={loading}
              disabled={loading}
              placeholder='Enter Stripe Price ID'
              desc="You need to load a price first by copying price id from Stripe dashboard"
            />
            {
              price &&
              <StripePriceDetail
                price={price}
              />
            }
          </>
        </FullscreenTwoCols>
      </Modal.Body>
    </Modal>
  );
}
