import Card from 'react-bootstrap/Card';
import { Table, TableBody, TRow } from '../../components/list/Table';
import { ReaderAccount } from '../../data/reader-account';

export function AccountDetails(
  props: {
    reader: ReaderAccount;
  }
) {
  const rows = buildAccountRows(props.reader);

  return (
    <Card className='mb-3'>
      <Card.Header>
        Account Details
      </Card.Header>
      <Table>
        <TableBody
          rows={rows}
        />
      </Table>
    </Card>
  )
}

function buildAccountRows(a: ReaderAccount): TRow[] {
  return [
    {
      head: 'FTC id',
      data: [a.id],
    },
    {
      head: 'Email',
      data: [a.email || 'N/A']
    },
    {
      head: 'Email verified',
      data: [`${a.isVerified}`]
    },
    {
      head: 'Wechat union id',
      data: [a.unionId || 'N/A']
    },
    {
      head: 'Wechat nickname',
      data: [a.wechat?.nickname || 'N/A']
    },
    {
      head: 'Stripe customer id',
      data: [a.stripeId || 'N/A']
    },
    {
      head: 'Mobile',
      data: [a.mobile || 'N/A']
    },
    {
      head: 'User name',
      data: [a.userName || 'N/A']
    },
  ];
}
