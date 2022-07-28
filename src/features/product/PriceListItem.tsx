import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { PaywallPrice } from '../../data/paywall';
import { ActiveBadge } from '../../components/text/Badge';
import { DiscountList } from './DiscountList';
import { useState } from 'react';
import { PriceFormDialog } from './PriceFormDialog';
import { CMSPassport } from '../../data/cms-account';
import { PriceTable } from './PriceTable';
import {
  OnPaywallPriceUpserted,
  OnPriceUpserted,
  OnProductUpserted,
} from './callbacks';
import {
  activatePrice,
  archivePrice,
  attachIntroPrice,
} from '../../repository/paywall';
import { ResponseError } from '../../http/response-error';
import { toast } from 'react-toastify';
import { newFtcPriceParts, Price } from '../../data/ftc-price';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { concatPriceParts } from '../../data/localization';

export function PriceListItem(props: {
  passport: CMSPassport;
  paywallPrice: PaywallPrice;
  // The result of editing price,
  // or discount list add/removal.
  onUpdated: OnPaywallPriceUpserted;
  // The result of activating a recurringprice
  onActivated: OnPriceUpserted;
  // The result of deleting a price.
  onArchived: OnPriceUpserted;
  // The result of activating a one time price
  // and attaching it to a product.
  onIntroAttached: OnProductUpserted;
}) {
  // Show discount list only for recurring.
  const isRecurring = props.paywallPrice.kind === 'recurring';
  const isActive = props.paywallPrice.active;

  const { live } = useLiveMode();
  const [show, setShow] = useState(false);
  const [activating, setActivating] = useState(false);
  const [archiving, setArchiving] = useState(false);

  // Activate recurring price.
  const activateRecurring = () => {
    setActivating(true);

    activatePrice(props.paywallPrice.id, { live, token: props.passport.token })
      .then((price) => {
        setActivating(false);
        toast.success('Price activated');
        props.onActivated(price);
      })
      .catch((err: ResponseError) => {
        setActivating(false);
        toast.error(err.message);
      });
  };

  const activateOneTime = () => {
    setActivating(true);

    attachIntroPrice(
      props.paywallPrice.productId,
      { priceId: props.paywallPrice.id },
      { live, token: props.passport.token }
    )
      .then((prod) => {
        setActivating(false);

        toast.success('Price set as introductory!');

        props.onIntroAttached(prod);
      })
      .catch((err: ResponseError) => {
        setActivating(false);
        toast.error(err.message);
      });
  };

  // When a price is updated, tell parent to sync
  // the whole list of prices.
  // For one_time prices used as introdcutory,
  // the change won't be reflected in the IntroductoryDetails component since
  // the data used there is saved in the product table
  // while the price is updated in the price table.
  // To since the two tables, you have to click the
  // `Refresh` button in that component.
  const pricedUpdated: OnPriceUpserted = (price: Price) => {
    setShow(false);
    props.onUpdated({
      ...price,
      offers: props.paywallPrice.offers,
    });
  };

  const handleArchive = () => {
    setArchiving(true);

    archivePrice(props.paywallPrice.id, { live, token: props.passport.token })
      .then((price) => {
        setArchiving(false);
        props.onArchived(price);
      })
      .catch((err: ResponseError) => {
        setArchiving(false);
        toast.error(err.message);
      });
  };

  const activateBtn = isRecurring ? (
    <Button
      variant="outline-primary"
      size="sm"
      disabled={activating}
      onClick={activateRecurring}
    >
      {activating ? 'Activating...' : 'Activate'}
    </Button>
  ) : (
    <Button
      variant="outline-primary"
      size="sm"
      disabled={activating}
      onClick={activateOneTime}
    >
      {activating ? 'Activating...' : 'Use as Intro'}
    </Button>
  );

  const archiveBtn = (
    <Button
      variant="danger"
      size="sm"
      disabled={archiving}
      onClick={handleArchive}
    >
      {archiving ? 'Dropping ' : 'Archive'}
    </Button>
  );

  return (
    <div className="mb-3">
      <Card>
        <Card.Header className="d-flex justify-content-between">
          <div>
            <span className="me-2">
              {concatPriceParts(newFtcPriceParts(props.paywallPrice))}
            </span>
            {props.paywallPrice.active && <ActiveBadge active={true} />}
          </div>

          <ButtonGroup size="sm">
            {!isActive && archiveBtn}
            {!isActive && activateBtn}
            <Button variant="primary" size="sm" onClick={() => setShow(true)}>
              Edit
            </Button>
          </ButtonGroup>
        </Card.Header>
        <Card.Body>
          <PriceTable price={props.paywallPrice} />
        </Card.Body>
      </Card>

      {isRecurring && (
        <DiscountList
          passport={props.passport}
          price={props.paywallPrice}
          onPaywallPrice={props.onUpdated}
        />
      )}

      <PriceFormDialog
        passport={props.passport}
        show={show}
        onHide={() => setShow(false)}
        onUpserted={pricedUpdated}
        price={props.paywallPrice}
      />
    </div>
  );
}
