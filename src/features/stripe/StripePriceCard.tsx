import Card from 'react-bootstrap/Card';
import { Table, TableBody, TRow } from '../../components/list/Table';
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
    progress: boolean;
    onActivate: () => void;
    onEdit: () => void;
    onRefresh: () => void;
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

        <Table>
          <TableBody
            rows={buildRows(props.price)}
          />
        </Table>

      </Card.Body>
    </Card>
  );
}

function buildRows(price: StripePrice): TRow[] {
  return [
    {
      head: 'ID',
      data: [price.id],
    },
    {
      head: 'Active on Paywall',
      data: [<ActiveBadge active={price.onPaywall} />]
    },
    {
      head: 'Live',
      data: [<ModeBadge live={price.liveMode}/>],
    },
    {
      head: 'Kind',
      data: [price.kind],
    },
    {
      head: 'Nickname',
      data: [price.nickname],
    },
  ];
}

