import { formatISO } from 'date-fns';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import { TableBody, TRow } from '../../components/list/Table';
import { DiscountStatusBadge, ModeBadge } from '../../components/text/Badge';
import { StripeCoupon, formatCouponAmount } from '../../data/stripe-price';
import { isActiveDiscount } from '../../data/enum';

export function CouponCard(
  props: {
    coupon: StripeCoupon;
    menu: JSX.Element | null;
  }
) {
  const rows: TRow[] = buildCouponRow(props.coupon);
  // Button to drop or actiate a coupon.
  // Note here we didn't handle `paused` state.
  // Only `active` and `cancelled` are handled.
  const isActive = isActiveDiscount(props.coupon.status);

  return (
    <Card className='mb-3'>
      {props.menu}

      <CouponBody
        coupon={props.coupon}
      />
    </Card>
  );
}

export function CouponMenu(
  props: {
    coupon: StripeCoupon;
    progress: boolean;
    onEdit: (c: StripeCoupon) => void; // Show a form to edit an existing coupon.
    onActivateOrDrop: (c: StripeCoupon) => void; // Show a dialog to activate/deactivate
    onRefresh: (c: StripeCoupon) => void;
  }
) {

  // Button to drop or actiate a coupon.
  // Note here we didn't handle `paused` state.
  // Only `active` and `cancelled` are handled.
  const isActive = isActiveDiscount(props.coupon.status);

  return (
    <Card.Header className='text-end'>
      <ButtonGroup
        size='sm'
      >
        <Button
          variant='outline-primary'
          size='sm'
          disabled={props.progress}
          onClick={() => props.onRefresh(props.coupon)}
        >
          Refresh
        </Button>
        <Button
          variant='danger'
          size="sm"
          disabled={props.progress}
          onClick={() => props.onActivateOrDrop(props.coupon)}
        >
          { isActive ? 'Cancel' : 'Activate'}
        </Button>

        <Button
          variant='primary'
          size='sm'
          disabled={props.progress}
          onClick={() => props.onEdit(props.coupon)}
        >
          Edit
        </Button>
      </ButtonGroup>
    </Card.Header>
  );
}

export function CouponBody(
  props: {
    coupon: StripeCoupon;
  }
) {

  const rows: TRow[] = buildCouponRow(props.coupon);

  return (
    <Card.Body>
      <Card.Title className="text-center">
        {
          formatCouponAmount(props.coupon)
        }
      </Card.Title>

      <table className="table table-borderless">
        <TableBody
          rows={rows}
        />
      </table>
    </Card.Body>
  );
}

function buildCouponRow(coupon: StripeCoupon): TRow[] {
  return [
    {
      head: 'Name',
      data: [coupon.name]
    },
    {
      head: 'Coupon ID',
      data: [coupon.id],
    },
    {
      head: 'Status',
      data: [
        <DiscountStatusBadge
          status={coupon.status}
        />
      ],
    },
    {
      head: 'Promotion Start',
      data: [
        coupon.startUtc || 'NULL'
      ]
    },
    {
      head: 'Promotion End',
      data: [
        coupon.endUtc || 'NULL'
      ]
    },
    {
      head: 'Redeem before',
      data: [
        coupon.redeemBy > 0
          ? formatISO(new Date(coupon.redeemBy))
          : 'NULL'
      ]
    },
    {
      head: 'Live',
      data: [
        <ModeBadge live={coupon.liveMode} />
      ]
    }
  ];
}
