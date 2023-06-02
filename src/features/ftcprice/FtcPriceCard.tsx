import Card from 'react-bootstrap/Card';
import { PaywallPrice } from '../../data/paywall';
import { localizedTier } from '../../data/localization';
import { PriceHighlight } from '../../components/text/PriceHighlight';
import { Price, newFtcPriceParts } from '../../data/ftc-price';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import { readableYMD } from '../../data/ymd';
import { Table } from 'react-bootstrap';
import { TRow, TableBody } from '../../components/list/Table';
import { ActiveBadge, ModeBadge } from '../../components/text/Badge';

/**
 * Layout for a price details
 */
export function FtcPriceSection(
  props: {
    price: PaywallPrice;
    menu: JSX.Element;
  }
) {
  return (
    <section className="mb-3">
      <Stack direction='horizontal'>
        <h4>Ftc price Details</h4>
        {props.menu}
      </Stack>
      <ul>
        <li>Click edit to update this price.</li>
        <li>If a price is in inactive state, it is not visible to end-user. Click Activate to put it on paywall.</li>
        <li>An Archived price is in its final state, with no further modification allowed. It cannot be used any longer, hidden from end-user forever.</li>
        <li>Sibling prices: if multiple prices, attached to the same product, have the same tier and billing cycle, we call them sibling prices. Only one price could be active among its siblings.</li>
      </ul>
      <FtcPriceCard
        price={props.price}
      />
    </section>
  );
}

/**
 * A price's menu: Edit, Activate, Archive.
 */
export function FtcPriceMenu(
  props: {
    active: boolean;
    archived: boolean;
    progress: boolean;
    onEdit: () => void;
    onActivate: () => void;
    onArchive: () => void;
  }
) {
  // If archived, no operation permitted.
  if (props.archived) {
    return <></>;
  }

  return (
    <ButtonGroup size="sm" className='ms-auto'>
      <Button
        variant="danger"
        size="sm"
        disabled={props.progress}
        onClick={props.onArchive}
      >
        Archive
      </Button>
      <Button
        variant="outline-primary"
        size="sm"
        disabled={props.progress}
        onClick={props.onActivate}
      >
        {props.active ? 'Deactivate' : 'Activate'}
      </Button>
      <Button
        variant="primary"
        size="sm"
        onClick={props.onEdit}
      >
        Edit
      </Button>
    </ButtonGroup>
  );
}

/**
 * FtcPriceDetail presents ftc price's fields in
 * a bootstrap card.
 */
export function FtcPriceCard(
  props: {
    price: PaywallPrice;
  }
) {
  return (
    <Card>
      <Card.Header className="d-flex justify-content-between">
        <span>{localizedTier(props.price.tier)}</span>
      </Card.Header>
      <Card.Body>
        <Card.Title className="text-center">
          <PriceHighlight
            parts={newFtcPriceParts(props.price)}
          />
        </Card.Title>

        <PriceTable
          price={props.price}
        />
      </Card.Body>
    </Card>
  )
}

function PriceTable(
  props: {
    price: Price;
  }
) {

  const rows: TRow[] = [
    {
      head: 'ID',
      data: [
        props.price.id,
      ],
    },
    {
      head: 'Active',
      data: [
        <ActiveBadge active={props.price.active} />
      ]
    },
    {
      head: 'Live',
      data: [
        <ModeBadge live={props.price.liveMode}/>
      ],
    },
    {
      head: 'Kind',
      data: [
        props.price.kind,
      ],
    },
    {
      head: 'Nickname',
      data: [
        props.price.nickname || 'NULL'
      ]
    },
    {
      head: 'Title',
      data: [
        props.price.title || 'NULL',
      ]
    },
    {
      head: 'Duration',
      data: [
        readableYMD(props.price.periodCount),
      ]
    },
    {
      head: 'Start Time',
      data: [
        `${props.price.startUtc}`
      ]
    },
    {
      head: 'End Time',
      data: [
        `${props.price.endUtc}`
      ]
    }
  ];

  return (
    <Table borderless={true}>
      <TableBody
        rows={rows}
      />
    </Table>
  );
}
