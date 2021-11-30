import { Discount } from '../../data/price'

export function DiscountList(
  props: {
    offers: Discount[];
  }
) {
  return (
    <table className="table">
      <OfferHead />
      <tbody>
        {
          props.offers.map(offer => <OfferRow key={offer.id} offer={offer} />)
        }
      </tbody>
    </table>
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
        <button className="btn btn-danger">Delete</button>
      </td>
    </tr>
  );
}
