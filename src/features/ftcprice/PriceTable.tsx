import { Price } from '../../data/ftc-price';
import { ActiveBadge, ModeBadge } from '../../components/text/Badge';
import { Table, TableBody, TRow } from '../../components/list/Table';
import { readableYMD } from '../../data/ymd';

export function PriceTable(
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
