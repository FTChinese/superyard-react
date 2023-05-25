import Button from 'react-bootstrap/Button';
import { Flex } from '../../components/layout/Flex';
import { isOneTime } from '../../data/enum';
import { PaywallPrice } from '../../data/paywall';
import { FtcPriceDetail } from './FtcPriceDetail';
import { Discount } from '../../data/ftc-price';
import { ButtonGroup, Card } from 'react-bootstrap';
import { formatDiscountAmount } from '../../data/ftc-price';
import { TRow, Table, TableBody } from '../../components/list/Table';
import { DiscountStatusBadge, ModeBadge } from '../../components/text/Badge';

export function FtcPriceScreen(
  props: {
    price: PaywallPrice;
    progress: boolean;
    onEdit: () => void;
    onActivate: () => void;
    onArchive: () => void;
    onNewOffer: () => void;
    onRefreshOffers: () => void;
    onDeleteOffer: (offer: Discount) => void;
  }
) {
  return (
    <>
      <section className="mb-3">
        <h4>Ftc price Details</h4>
        <FtcPriceDetail
          price={props.price}
          progress={props.progress}
          onEdit={props.onEdit}
          onActivate={props.onActivate}
          onArchive={props.onArchive}
        />
      </section>

      <OfferList
        isIntro={isOneTime(props.price.kind)}
        offers={props.price.offers}
        onNewOffer={props.onNewOffer}
        progress={props.progress}
        onRefresh={props.onRefreshOffers}
        onDelete={props.onDeleteOffer}
      />
    </>
  );
}

/**
 * OfferList shows a list of ftc discounts.
 * Introductory price does not have any.
 */
function OfferList(
  props: {
    isIntro: boolean;
    offers: Discount[];
    progress: boolean;
    onNewOffer: () => void;
    onRefresh: () => void;
    onDelete: (offer: Discount) => void;
  }
) {
  if (props.isIntro) {
    return (
      <div className='text-danger'>
      Introductory price has no discount.
      </div>
    );
  }

  return (
    <section className="mb-3">
      <Flex
        className="mb-2"
        start={<h4>Discount List</h4>}
        end={
          <ButtonGroup>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={props.onRefresh}
              disabled={props.progress}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              onClick={props.onNewOffer}
            >
              New Discount
            </Button>
          </ButtonGroup>
        }
      />

      {
        props.offers.map((o) => (
          <OfferItem
            offer={o}
            onDelete={() => props.onDelete(o)}
            isDeleting={false}
          />
        ))
      }
    </section>
  );
}

function OfferItem(
  props: {
    offer: Discount;
    onDelete: () => void;
    isDeleting: boolean;
  }
) {
  return (
    <>
      <Card className="mb-3">
        <Card.Header>
          <Flex
            start={
              <span>{ props.offer.description }</span>
            }
            end={
              <Button
                variant="danger"
                size="sm"
                onClick={props.onDelete}
              >
              { props.isDeleting ? 'Dropping...' : 'Drop'}
            </Button>
            }
          />
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
    </>
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
