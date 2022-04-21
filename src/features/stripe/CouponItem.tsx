import { formatISO } from 'date-fns';
import { Card } from 'react-bootstrap';
import { TableBody, TRow } from '../../components/list/Table';
import { ModeBadge } from '../../components/text/Badge';
import { StripeCoupon, foramtCouponAmount } from '../../data/stripe-price';

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
      head: 'Promotion Start',
      data: [
        props.coupon.startUtc || 'NULL'
      ]
    },
    {
      head: 'Promotion End',
      data: [
        props.coupon.endUtc || 'NULL'
      ]
    },
    {
      head: 'Redeem before',
      data: [
        props.coupon.redeemBy > 0
          ? formatISO(new Date(props.coupon.redeemBy))
          : 'NULL'
      ]
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
      <Card.Header>
        {props.coupon.name}
      </Card.Header>
      <Card.Body>
        <Card.Title className="text-center">
          {
            foramtCouponAmount(props.coupon)
          }
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
