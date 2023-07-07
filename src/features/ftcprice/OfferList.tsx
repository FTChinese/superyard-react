import Button from 'react-bootstrap/Button';
import { Discount } from '../../data/ftc-price';
import { ButtonGroup, Card, Stack } from 'react-bootstrap';
import { formatDiscountAmount } from '../../data/ftc-price';
import { TRow, Table, TableBody } from '../../components/list/Table';
import { DiscountStatusBadge, ModeBadge } from '../../components/text/Badge';

/**
 * OfferList shows a list of ftc discounts.
 * Introductory price does not have any.
 */
export function OfferListSection(
  props: {
    progress: boolean;
    onNewOffer: () => void;
    onRefresh: () => void;
    items: JSX.Element[]; // List of offers
  }
) {

  return (
    <section className="mb-3">
      <Stack direction='horizontal'>
        <h4>Discount List</h4>

        <ButtonGroup className='ms-auto'>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={props.onRefresh}
            disabled={props.progress}
          >
            Refresh
          </Button>
          <Button
            onClick={props.onNewOffer}
            disabled={props.progress}
          >
            New Discount
          </Button>
        </ButtonGroup>
      </Stack>
      <ul>
        <li>Click New button to create a new offer</li>
        <li>Click Refresh button to re-sync active offers under this price</li>
      </ul>
      {props.items}
    </section>
  );
}

export function OfferItem(
  props: {
    offer: Discount;
    onDelete: (o: Discount) => void;
  }
) {
  return (
    <Card className="mb-3">
      <Card.Header>
        <Stack direction='horizontal'>
          <span>{props.offer.description}</span>
          <Button
            className='ms-auto'
            variant="danger"
            size="sm"
            onClick={() => {
              props.onDelete(props.offer);
            }}
          >
            Drop
          </Button>
        </Stack>
      </Card.Header>
      <Card.Body>
        <Card.Title className="text-center">
          {formatDiscountAmount(props.offer)}
        </Card.Title>

        <Table borderless={true}>
          <TableBody
            rows={ buildOfferRow(props.offer) }
          />
        </Table>
      </Card.Body>
    </Card>
  );
}

function buildOfferRow(offer: Discount): TRow[] {
  return [
    {
      head: 'ID',
      data: [offer.id],
    },
    {
      head: 'Live',
      data: [
        <ModeBadge live={ offer.liveMode } />
      ]
    },
    {
      head: 'Status',
      data: [
        <DiscountStatusBadge status={offer.status } />
      ]
    },
    {
      head: 'Kind',
      data: [offer.kind],
    },
    {
      head: 'Recurring',
      data: [offer.recurring ? 'Yes' : 'No']
    },
    {
      head: 'Start',
      data: [offer.startUtc || 'NULL']
    },
    {
      head: 'End',
      data: [offer.endUtc || 'NULL']
    },

  ]
}
