import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import { Table, TableBody, TRow } from '../../components/list/Table';
import { isZeroMember, Membership } from '../../data/membership';
import { SmallButton } from '../../components/buttons/Button';
import { ReaderAccount } from '../../data/reader-account';

export function MemberDetails(
  props: {
    jwtToken: string;
    reader: ReaderAccount;
    onClickDrop: () => void;
  }
) {
  const rows = buildMemberRows(props.reader.membership);

  return (
    <Card>
      <Card.Header>
        <Stack direction='horizontal'>
          <span>Membership Details</span>
          {
            !isZeroMember(props.reader.membership) &&
            <SmallButton
              onClick={props.onClickDrop}
              className="ms-auto"
              variant="danger"
            >
              Drop
            </SmallButton>
          }
        </Stack>
      </Card.Header>

      <Table>
        <TableBody
          rows={rows}
        />
      </Table>
    </Card>
  );
}

function buildMemberRows(m: Membership): TRow[] {
  return [
    {
      head: 'Tier',
      data: [m.tier || 'N/A']
    },
    {
      head: 'Cycle',
      data: [m.cycle || 'N/A']
    },
    {
      head: 'Expiration Date',
      data: [m.expireDate || 'N/A']
    },
    {
      head: 'Payment Method',
      data: [m.payMethod || 'N/A']
    },
    {
      head: 'FTC Price ID',
      data: [m.ftcId || 'N/A']
    },
    {
      head: 'Stripe Subscripiton ID',
      data: [m.stripeSubsId || 'N/A']
    },
    {
      head: 'Stripe Auto Renewal',
      data: [`${m.autoRenew}`]
    },
    {
      head: 'Stripe Subscription Status',
      data: [m.status || 'N/A']
    },
    {
      head: 'Apple Original Transaction ID',
      data: [m.appleSubsId || 'N/A']
    },
    {
      head: 'B2B Licence ID',
      data: [m.b2bLicenceId || 'N/A']
    },
    {
      head: 'Standard Addon',
      data: [`${m.standardAddOn}`]
    },
    {
      head: 'Premium Addon',
      data: [`${m.premiumAddOn}`]
    },
    {
      head: 'Is VIP',
      data: [`${m.vip}`]
    }
  ];
}


