import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { PaywallPrice } from '../../data/paywall';
import { formatPrice } from '../../utils/format-price';
import { ActiveBadge, ModeBadge } from './Badge';
import { DiscountList } from './DiscountList';
import { useState } from 'react';
import { PriceFormDialog } from './PriceFormDialog';
import { CMSPassport } from '../../data/cms-account';

export type OnPriceUpdated = (price: PaywallPrice) => void;

export function PriceList(
  props: {
    passport: CMSPassport;
    prices: PaywallPrice[];
    onUpdated: OnPriceUpdated;
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
    onUpdated: OnPriceUpdated;
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
        offers={props.price.offers}
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

function PriceContent(
  props: {
    price: PaywallPrice;
  }
) {
  return (
    <table className="table table-borderless">
      <tbody>
        <tr>
          <th>ID</th>
          <td>{props.price.id}</td>
        </tr>
        <tr>
          <th>Tier</th>
          <td>{props.price.tier}</td>
        </tr>
        <tr>
          <th>Nickname</th>
          <td>{props.price.nickname}</td>
        </tr>
        <tr>
          <th>Description</th>
          <td>{props.price.description}</td>
        </tr>
        <tr>
          <th>Stripe Price ID</th>
          <td>{props.price.stripePriceId}</td>
        </tr>
        <tr>
          <th>Mode</th>
          <td><ModeBadge live={props.price.liveMode}/></td>
        </tr>
        <tr>
          <th>Created</th>
          <td>at {props.price.createdUtc} by {props.price.createdBy}</td>
        </tr>
      </tbody>
    </table>
  );
}
