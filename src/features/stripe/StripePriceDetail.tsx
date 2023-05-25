import Card from 'react-bootstrap/Card';
import { TableBody, TRow } from '../../components/list/Table';
import { localizedTier } from '../../data/localization';
import { newStripePriceParts, StripePrice } from '../../data/stripe-price';
import { ActiveBadge, ModeBadge } from '../../components/text/Badge';
import { PriceHighlight } from '../../components/text/PriceHighlight';

export function StripePriceDetail(
  props: {
    price: StripePrice
  }
) {
  return (
    <Card>
      <Card.Header>
        {localizedTier(props.price.tier)}
      </Card.Header>
      <Card.Body>
        <Card.Title className="text-center">
          <PriceHighlight
            parts={newStripePriceParts(props.price)}
          />
        </Card.Title>

        <PriceTable
          price={props.price}
        />

      </Card.Body>
    </Card>
  );
}

function PriceTable(
  props: {
    price: StripePrice,
  }
) {

  const rows: TRow[] = [
    {
      head: 'ID',
      data: [props.price.id],
    },
    {
      head: 'Active',
      data: [<ActiveBadge active={props.price.active} />]
    },
    {
      head: 'Live',
      data: [<ModeBadge live={props.price.liveMode}/>],
    },
    {
      head: 'Kind',
      data: [props.price.kind],
    },
    {
      head: 'Nickname',
      data: [props.price.nickname],
    },
  ];

  return (
    <table className="table table-borderless">
      <TableBody
        rows={rows}
      />
    </table>
  )
}


