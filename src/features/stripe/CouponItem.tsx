import { formatISO } from 'date-fns';
import { Button, ButtonGroup, Card } from 'react-bootstrap';
import { Flex } from '../../components/layout/Flex';
import { TableBody, TRow } from '../../components/list/Table';
import { CouponStatusBadge, ModeBadge } from '../../components/text/Badge';
import { StripeCoupon, formatCouponAmount } from '../../data/stripe-price';

export enum CouponAction {
  Edit,
  Drop,
  Activate,
}

export function CouponItem(
  props: {
    coupon: StripeCoupon;
    loading: boolean;
    onAction: (c: StripeCoupon, action: CouponAction) => void;
  }
) {
  const rows: TRow[] = buildCouponRow(props.coupon);

  let btn: JSX.Element | null = null;
  switch (props.coupon.status) {
    case 'active':
      btn = (
        <Button
          variant='danger'
          size="sm"
          disabled={props.loading}
          onClick={() => props.onAction(props.coupon, CouponAction.Drop)}
        >
          Drop
        </Button>
      );
      break;

    case 'paused':
    case 'cancelled':
      btn = (
        <Button
          variant='outline-primary'
          size="sm"
          disabled={props.loading}
          onClick={() => props.onAction(props.coupon, CouponAction.Activate)}
        >
          Activiate
        </Button>
      )
  }

  return (
    <>
      <Card className='mb-3'>
        <Card.Header>
          <Flex
            start={<span>{props.coupon.name}</span>}
            end={
              <ButtonGroup
                size='sm'
              >
                {btn}

                <Button
                  variant='primary'
                  size='sm'
                  onClick={() => props.onAction(props.coupon, CouponAction.Edit)}
                >
                  Edit
                </Button>
              </ButtonGroup>

            }
          />

        </Card.Header>
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
      </Card>
    </>

  );
}

function buildCouponRow(coupon: StripeCoupon): TRow[] {
  return [
    {
      head: 'ID',
      data: [coupon.id],
    },
    {
      head: 'Status',
      data: [
        <CouponStatusBadge
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
