import Card from 'react-bootstrap/Card';
import { TableBody, TRow } from '../../components/list/Table';
import { localizedTier } from '../../data/localization';
import { newStripePriceParts, StripePrice } from '../../data/stripe-price';
import { ActiveBadge, ModeBadge } from '../../components/text/Badge';
import { PriceHighlight } from '../../components/text/PriceHighlight';
import Stack from 'react-bootstrap/Stack';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

/**
 * Wraps StripePriceCard with extra heading and footing.
 */
export function StripePriceSection(
  props: {
    price: StripePrice;
    onRefresh: () => void;
    progress: boolean;
    onActivate: () => void;
    onEdit: () => void;
  }
) {
  return (
    <section className="mb-3">
      <Stack direction="horizontal">
        <h4>Stripe Price Details</h4>
        <ButtonGroup
          className="ms-auto"
        >
          <Button
            variant="outline-primary"
            disabled={props.progress}
            onClick={props.onRefresh}
          >
            Refresh
          </Button>
          <Button
            variant='danger'
            disabled={props.progress}
            onClick={props.onActivate}
          >
            {props.price.onPaywall ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            disabled={props.progress}
            onClick={props.onEdit}
          >
            Edit
          </Button>
        </ButtonGroup>
      </Stack>

      <ul>
        <li>Use Edit to modify metadata</li>
        <li>Use Activate to put this price on paywall and it will be availabl to client</li>
        <li>Use Deactivate to remove this price from paywall</li>
      </ul>

      <StripePriceCard
        price={props.price}
      />
    </section>
  );
}

/**
 * Present stripe price fields
 */
export function StripePriceCard(
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
      head: 'Active on Paywall',
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


