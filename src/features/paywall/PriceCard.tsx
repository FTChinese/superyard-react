import { PriceHighlight } from '../../components/text/PriceHighlight';
import { Discount, ftcPriceFormat, Price } from '../../data/ftc-price';
import { YearMonthDayFormat } from '../../data/ymd';
import { EffectivePeriod } from './EffectivePeriod';

export function PriceCard(
  props: {
    price: Price;
    offers?: Discount[];
  }
) {
  return (
    <section className="mb-5">
      <h6 className="text-center border-bottom">
        <PriceHighlight
          parts={ftcPriceFormat(props.price).formatToParts()}
        />
      </h6>
      <dl>
        <dt>Kind</dt>
        <dd>{props.price.kind}</dd>

        <dt>Period Count</dt>
        <dd>{new YearMonthDayFormat(props.price.periodCount).format()}</dd>

        <dt>Stripe Price ID</dt>
        <dd>{props.price.stripePriceId || 'NULL'}</dd>
      </dl>
      {
        props.offers &&
        <PriceOfferList offers={props.offers} />
      }
    </section>
  );
}

function PriceOfferList(
  props: {
    offers: Discount[];
  }
) {

  if (props.offers.length == 0) {
    return <></>;
  }

  return (
    <table className="table table-sm table-borderless align-middle table-striped caption-top">
      <caption>Offers</caption>
      <thead>
        <tr>
          <th>Kind</th>
          <th>Override Period</th>
          <th>Price Off</th>
          <th>Effective</th>
        </tr>
      </thead>
      <tbody>
        {
          props.offers.map((o, i) => (
            <PriceOfferRow offer={o} key={i} />
          ))
        }
      </tbody>
    </table>
  );
}

function PriceOfferRow(
  props: {
    offer: Discount;
  }
) {
  return (
    <tr>
      <td>{props.offer.kind}</td>
      <td>{new YearMonthDayFormat(props.offer.overridePeriod).format()}</td>
      <td>{props.offer.priceOff}</td>
      <td>
        <EffectivePeriod period={props.offer} direction="column" />
      </td>
    </tr>
  );
}
