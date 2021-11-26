import { Link } from 'react-router-dom';
import { PaywallProduct } from '../../data/paywall';
import { Price } from '../../data/price';
import { formatPrice } from '../../utils/format-price';

function TextList(
  props: {
    text: string;
  }
) {
  return (
    <ul>
      {
        props.text.split('\n').map((line, index) => (
          <li key={index}>{line}</li>
        ))
      }
    </ul>
  );
}

function PriceButton(
  props: {
    price: Price;
  }
) {
  return (
    <div className="d-grid mb-3">
      <button className="btn btn-primary">
        {formatPrice(props.price)}
      </button>
    </div>
  );
}

export function ProductCard(
  props: {
    product: PaywallProduct;
  }
) {
  return (
    <div className="card">
      <div className="card-header text-end">
        <Link to={`products/${props.product.id}`}>
          Edit
        </Link>
      </div>
      <div className="card-body">
        <h3 className="card-title text-center mb-3 pb-3">
          {props.product.heading}
        </h3>
        {
          props.product.prices.map((p, i) => (
            <PriceButton key={i} price={p} />
          ))
        }
        <TextList text={props.product.description}/>
      </div>
    </div>
  );
}
