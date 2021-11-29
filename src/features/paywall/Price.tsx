import Card from 'react-bootstrap/Card';
import { PaywallPrice } from '../../data/paywall';
import { Price } from '../../data/price';
import { formatPrice } from '../../utils/format-price';
import { ActiveBadge, ModeBadge } from './Badge';
import { DiscountList } from './Discount';

export function PriceButton(
  props: {
    price: Price;
  }
) {
  return (
    <div className="d-grid mb-3">
      <button className="btn btn-primary">
        {formatPrice(props.price)}
      </button>
    </div>
  );
}

export function PriceDetails(
  props: {
    price: PaywallPrice;
  }
) {
  return (
    <div className="mb-3">
      <Card>
        <Card.Header className="d-flex justify-content-between">
          <span>{formatPrice(props.price)}</span>
          {
            props.price.active ?
            <ActiveBadge active={true}/> :
            <button className="btn btn-link btn-sm">Activate</button>
          }
        </Card.Header>
        <Card.Body>
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
                <th>Mode</th>
                <td><ModeBadge live={props.price.liveMode}/></td>
              </tr>
              <tr>
                <th>Created</th>
                <td>at {props.price.createdUtc} by {props.price.createdBy}</td>
              </tr>
            </tbody>
          </table>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header className="d-flex justify-content-between">
          <span>Discount list</span>
          <div className="btn-group">
            <button className="btn btn-outline-primary btn-sm">Refresh</button>
            <button className="btn btn-primary btn-sm">New</button>
          </div>
        </Card.Header>
        <DiscountList offers={props.price.offers} />
      </Card>
    </div>
  );
}

export function PriceList(
  props: {
    prices: PaywallPrice[];
  }
) {
  return (
    <>
      {
        props.prices.map(price => <PriceDetails key={price.id} price={price}/>)
      }
    </>
  )
}
