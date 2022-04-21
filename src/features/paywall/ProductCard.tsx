import { Link } from 'react-router-dom';
import { TextList } from '../../components/list/TextList';
import { PaywallPrice, Product } from '../../data/paywall';
import { StripePaywallItem } from '../../data/stripe-price';
import { FtcPriceCard } from './FtcPriceCard';
import { StripePriceCard } from './StripePriceCard';

export function ProductCard(
  props: {
    product: Product;
    ftc: PaywallPrice[];
    stripe: StripePaywallItem[];
  }
) {
  return (
    <div className="h-100 p-3">
      <h5 className="text-center mb-2 pb-1 border-bottom">
        <Link to={`products/${props.product.id}`}>
          {props.product.heading}
        </Link>
      </h5>

      {
        props.ftc.map((p, i) => (
          <FtcPriceCard
            key={i}
            price={p}
          />
        ))
      }

      {
        props.stripe.map((p, i) => (
          <StripePriceCard
            key={i}
            item={p}
          />
        ))
      }

      <TextList text={props.product.description}/>

      <small className="text-muted">
        {props.product.smallPrint}
      </small>
    </div>
  );
}
