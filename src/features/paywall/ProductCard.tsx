import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { TextList } from '../../components/list/TextList';
import { PaywallProduct } from '../../data/paywall';
import { PriceCard } from './PriceCard';

export function ProductCard(
  props: {
    product: PaywallProduct;
  }
) {
  return (
    <Card className="h-100">
      <Card.Header className="text-end">
        <Link to={`products/${props.product.id}`}>
          Details
        </Link>
      </Card.Header>
      <Card.Body>

        <Card.Title as="h5" className="text-center border-bottom">
          {props.product.heading}
        </Card.Title>

        <TextList text={props.product.description}/>

        {
          props.product.introductory &&
          <PriceCard
            price={props.product.introductory}
          />
        }

        {
          props.product.prices.map((p, i) => (
            <PriceCard
              key={i}
              price={p}
              offers={p.offers}
            />
          ))
        }
      </Card.Body>
    </Card>
  );
}
