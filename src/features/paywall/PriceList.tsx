import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { PaywallPrice } from '../../data/paywall';
import { formatPrice } from '../../utils/format-price';
import { ActiveBadge } from './Badge';
import { DiscountList } from './DiscountList';
import { useState } from 'react';
import { PriceFormDialog } from './PriceFormDialog';
import { CMSPassport } from '../../data/cms-account';
import { PriceContent } from './PriceContent';
import { OnPriceUpserted } from './callbacks';

/**
 * @description Used by the ProductDetailPage to show a list of prices.
 */
export function PriceList(
  props: {
    passport: CMSPassport;
    prices: PaywallPrice[];
    onUpdated: OnPriceUpserted;
  }
) {
  return (
    <>
      {
        props.prices.map(price =>
          <PriceListItem
            key={price.id}
            passport={props.passport}
            price={price}
            onUpdated={props.onUpdated}
          />
        )
      }
    </>
  )
}

function PriceListItem(
  props: {
    passport: CMSPassport;
    price: PaywallPrice;
    onUpdated: OnPriceUpserted;
  }
) {

  const [ show, setShow ] = useState(false);

  return (
    <div className="mb-3">
      <Card>
        <Card.Header className="d-flex justify-content-between">
          <div>
            <span className="me-2">
              {formatPrice(props.price)}
            </span>
            {
              props.price.active &&
              <ActiveBadge active={true}/>
            }
          </div>

          <ButtonGroup
            size="sm"
          >
            {
              !props.price.active &&
              <Button
                variant="outline-primary"
                size="sm"
              >
                Activate
              </Button>
            }
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShow(true)}
            >
              Edit
            </Button>
          </ButtonGroup>
        </Card.Header>
        <Card.Body>
          <PriceContent
            price={props.price}
          />
        </Card.Body>
      </Card>

      <DiscountList
        passport={props.passport}
        price={props.price}
        onUpdatePrice={props.onUpdated}
      />
      <PriceFormDialog
        passport={props.passport}
        show={show}
        onHide={() => setShow(false)}
        onUpserted={props.onUpdated}
        price={props.price}
      />
    </div>
  );
}
