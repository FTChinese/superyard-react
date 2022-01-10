import { TableBody, TRow } from '../../components/list/Table';
import { localizeBool } from '../../data/localization';
import { StripeRawPrice } from '../../data/paywall';

export function StripeRawPriceContent(
  props: {
    price: StripeRawPrice;
  }
) {

  const rows: TRow[] = [
    {
      head: 'ID',
      data: [props.price.id],
    },
    {
      head: 'Active',
      data: [localizeBool(props.price.active)],
    },
    {
      head: 'Price',
      data: [`${props.price.currency}/${props.price.unit_amount/100}`],
    },
    {
      head: 'Introductory',
      data: [props.price.metadata.introductory]
    },
    {
      head: 'Nickname',
      data: [props.price.nickname],
    },
    {
      head: 'Type',
      data: [props.price.type],
    },
    {
      head: 'Live',
      data: [localizeBool(props.price.livemode)],
    },
    {
      head: 'Recurring Interval',
      data: [props.price.recurring?.interval || '']
    }
  ];

  const metaRows: TRow[] = [
    {
      head: 'Tier',
      data: [props.price.metadata.tier]
    },
    {
      head: 'Period Days',
      data: [`${props.price.metadata.years} years, ${props.price.metadata.months} months, ${props.price.metadata.days} days`]
    },
    {
      head: 'Is introductory',
      data: [props.price.metadata.introductory]
    },
    {
      head: 'Start Time',
      data: [props.price.metadata.start_utc || 'NULL']
    },
    {
      head: 'End Time',
      data: [props.price.metadata.end_utc || 'NULL']
    }
  ]

  return (
    <>
      <table className="table table-borderless caption-top">
        <caption>Stripe Price Details</caption>
        <TableBody
          rows={rows}
        />
      </table>
      <table className="table caption-top">
        <caption>Metadata</caption>
        <TableBody
          rows={metaRows}
        />
      </table>
    </>
  );
}

