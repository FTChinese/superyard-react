import { formatISO } from 'date-fns';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
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
      <Card.Header>
        <Stack>
          <span>{props.coupon.name}</span>
          {props.menu}
        </Stack>
      </Card.Header>

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
    onEdit: (c: StripeCoupon) => void; // Show a form
    onActivateOrDrop: (c: StripeCoupon) => void; // Show a dialog to activate/deactivate
  }
) {

  // Button to drop or actiate a coupon.
  // Note here we didn't handle `paused` state.
  // Only `active` and `cancelled` are handled.
  const isActive = isActiveDiscount(props.coupon.status);

  return (
    <ButtonGroup
      size='sm'
      className="ms-auto"
    >
      <Button
        variant='danger'
        size="sm"
        disabled={props.progress}
        onClick={() => props.onActivateOrDrop(props.coupon)}
      >
        { isActive ? 'Drop' : 'Activate'}
      </Button>

      <Button
        variant='primary'
        size='sm'
        onClick={() => props.onEdit(props.coupon)}
      >
        Edit
      </Button>
    </ButtonGroup>
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
