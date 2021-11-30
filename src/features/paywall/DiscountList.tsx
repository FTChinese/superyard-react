import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Discount } from '../../data/price'

export function DiscountList(
  props: {
    offers: Discount[];
  }
) {
  return (
    <Card>
      <Card.Header className="d-flex justify-content-between">
        <span>Discount list</span>
        <ButtonGroup
          size="sm"
        >
          <Button
            variant="outline-primary"
            size="sm"
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
          >
            New
          </Button>
        </ButtonGroup>
      </Card.Header>
      <table className="table">
        <OfferHead />
        <tbody>
          {
            props.offers.map(offer =>
              <OfferRow
                key={offer.id}
                offer={offer}
              />
            )
          }
        </tbody>
      </table>
    </Card>
  );
}

function OfferHead() {
  const names = ['Description', 'Kind', 'Price Off', 'Status', 'Recurring', 'Period', ''];

  return (
    <thead>
      <tr>
        {
          names.map((n, i) => <th key={i}>{n}</th>)
        }
      </tr>
    </thead>
  );
}

function OfferRow(
  props: {
    offer: Discount
  }
) {
  return (
    <tr>
      <td>{props.offer.description}</td>
      <td>{props.offer.kind}</td>
      <td>{props.offer.priceOff}</td>
      <td>{props.offer.status}</td>
      <td>{props.offer.recurring ? 'Yes' : 'No'}</td>
      <td>
        Start: {props.offer.startUtc}
        <br />
        End: {props.offer.endUtc}
      </td>
      <td className="text-end">
        <Button
          variant="danger"
          size="sm"
        >
          Delete
        </Button>
      </td>
    </tr>
  );
}

