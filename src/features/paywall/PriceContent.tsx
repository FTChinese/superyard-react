import { Price } from '../../data/price';
import { formatYearMonthDay } from '../../utils/format-datetime';
import { ModeBadge } from './Badge';
import { EffectiveRow } from './EffectivePeriod';

export function PriceContent(
  props: {
    price: Price;
  }
) {
  return (
    <table className="table table-borderless caption-top">
      <caption>Price Details</caption>
      <tbody>
        <tr>
          <th>ID</th>
          <td>{props.price.id}</td>
        </tr>
        <tr>
          <th>Kind</th>
          <td>{props.price.kind}</td>
        </tr>
        <tr>
          <th>Tier</th>
          <td>{props.price.tier}</td>
        </tr>
        <tr>
          <th>Period Count</th>
          <td>{formatYearMonthDay(props.price.periodCount)}</td>
        </tr>
        <tr>
          <th>Nickname</th>
          <td>{props.price.nickname}</td>
        </tr>
        <tr>
          <th>Description</th>
          <td>{props.price.description}</td>
        </tr>
        <tr>
          <th>Stripe Price ID</th>
          <td>{props.price.stripePriceId}</td>
        </tr>
        <tr>
          <th>Mode</th>
          <td><ModeBadge live={props.price.liveMode}/></td>
        </tr>
        <tr>
          <th>Valid Period</th>
          <td>
            <EffectiveRow start={props.price.startUtc} end={props.price.endUtc} />
          </td>
        </tr>
        <tr>
          <th>Created</th>
          <td>At {props.price.createdUtc}</td>
        </tr>
      </tbody>
    </table>
  );
}
