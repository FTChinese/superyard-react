import { Link } from 'react-router-dom';
import { formatYMD } from '../../data/period';
import { Price } from '../../data/ftc-price';
import { sitemap } from '../../data/sitemap';
import { ModeBadge } from '../../components/text/Badge';
import { EffectiveRow } from '../paywall/EffectivePeriod';

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
          <td>{formatYMD(props.price.periodCount)}</td>
        </tr>
        <tr>
          <th>Nickname</th>
          <td>{props.price.nickname}</td>
        </tr>
        <tr>
          <th>Title</th>
          <td>{props.price.title}</td>
        </tr>
        <tr>
          <th>Stripe Price ID</th>
          <td>
            <Link to={sitemap.stripePriceOf(props.price.stripePriceId)}>{props.price.stripePriceId}</Link>
          </td>
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
