import { Card } from 'react-bootstrap';
import { StripeBrand } from '../../components/graphics/icons';
import { Table, TableBody, TableHead, TRow } from '../../components/list/Table';
import { DateColumn, ISOTimeColumn } from '../../components/text/DateTimeBlock';
import { PriceHighlight } from '../../components/text/PriceHighlight';
import { formatCouponAmount, StripePaywallItem, stripePriceFormat } from '../../data/stripe-price';
import { formatYMD } from '../../data/ymd';

export function StripePriceCard(
  props: {
    item: StripePaywallItem;
  }
) {

  const priceRows: TRow[] = [
    {
      head: 'Kind',
      data: [
        props.item.price.kind,
      ],
    },
    {
      head: 'Duration',
      data: [
        formatYMD(props.item.price.periodCount),
      ]
    },
  ];

  const couponHead = (
    <TableHead
      cols={[
        'ID',
        'Amount off',
        'Start',
        'End',
        'Redeem By'
      ]}
    />
  );

  const offerRows: TRow[] = props.item.coupons.map(c => {
    return {
      data: [
        c.id,
        formatCouponAmount(c),
        <ISOTimeColumn
          date={c.startUtc}
        />,
        <ISOTimeColumn
          date={c.endUtc}
        />,
        c.redeemBy > 0 ?
        <DateColumn
          date={new Date(c.redeemBy)}
        /> :
        ''
      ],
    }
  });

  return (
    <Card className="mb-3">
      <Card.Header>
        <StripeBrand/>
      </Card.Header>

      <Card.Body>
        <Card.Title className="text-center">
          <PriceHighlight
            parts={stripePriceFormat(props.item.price).formatToParts()}
          />
        </Card.Title>

        <Table
          caption="Stripe Price Details"
        >
          <TableBody
            rows={priceRows}
          />
        </Table>

        {
          offerRows.length > 0 &&
          <Table
            caption="Stripe Coupons"
            head={couponHead}
          >
            <TableBody
              rows={offerRows}
            />
          </Table>
        }
      </Card.Body>
    </Card>
  );
}

