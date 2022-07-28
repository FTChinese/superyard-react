import { Link } from 'react-router-dom';
import { Price } from '../../data/ftc-price';
import { sitemap } from '../../data/sitemap';
import { ModeBadge } from '../../components/text/Badge';
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
      head: 'Kind',
      data: [
        props.price.kind,
      ],
    },
    {
      head: 'Tier',
      data: [
        props.price.tier,
      ]
    },
    {
      head: 'Duration',
      data: [
        readableYMD(props.price.periodCount),
      ]
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
      head: 'Stripe Price ID',
      data: [
        <Link to={sitemap.stripePriceOf(props.price.stripePriceId)}>
          {props.price.stripePriceId}
        </Link>
      ],
    },
    {
      head: 'Mode',
      data: [
        <ModeBadge live={props.price.liveMode}/>
      ],
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
    <Table
      caption="Price Details"
    >
      <TableBody
        rows={rows}
      />
    </Table>
  );
}
