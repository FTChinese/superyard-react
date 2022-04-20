import { Card } from 'react-bootstrap';
import { TableBody, TRow } from '../../components/list/Table';
import { ModeBadge } from '../../components/text/Badge';
import { formatMoney } from '../../data/money-parts';
import { StripeCoupon } from '../../data/stripe-price';

export function CouponItem(
  props: {
    coupon: StripeCoupon;
  }
) {
  const rows: TRow[] = [
    {
      head: 'ID',
      data: [props.coupon.id],
    },
    {
      head: 'Status',
      data: [props.coupon.status],
    },
    {
      head: 'Promotion Period',
      data: [`${props.coupon.startUtc} - ${props.coupon.endUtc}`]
    },
    {
      head: 'Redeem before',
      data: [(new Date(props.coupon.redeemBy)).toISOString()]
    },
    {
      head: 'Live',
      data: [
        <ModeBadge live={props.coupon.liveMode} />
      ]
    }
  ];

  return (
    <Card>
      <Card.Header>{props.coupon.name}</Card.Header>
      <Card.Body>
        <Card.Title className="text-center">
          - {formatMoney(props.coupon.currency, props.coupon.amountOff)}
        </Card.Title>

        <table className="table table-borderless">
          <TableBody
            rows={rows}
          />
        </table>
      </Card.Body>
    </Card>
  );
}
