import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { CMSPassport } from '../../data/cms-account';
import { Product } from '../../data/paywall';
import { ActiveBadge } from './Badge';

export function ProductList(
  props: {
    passport: CMSPassport;
    products: Product[];
    onActivated: (p: Product) => void;
  }
) {

  return (
    <table className="table">
      <thead>
        <HeadRow />
      </thead>
      <tbody>
        {
         props.products.map((prod) =>(
            <ProductRow
              product={prod}
              key={prod.id}
              onActivated={props.onActivated}
            />
          ))
        }
      </tbody>
    </table>
  );
}

function ProductRow(
  props: {
    product: Product;
    onActivated: (p: Product) => void;
  }
) {

  const [ submitting, setSubmitting ] = useState(false);

  const handleActivate = () => {
    console.log(`Activate product ${props.product}`);
    setSubmitting(true);

    setSubmitting(false);

    props.onActivated({
      ...props.product,
      active: true,
    });
  }

  return (
    <tr>
      <td>
        <Link to={props.product.id}>
          {props.product.id}
        </Link>
      </td>
      <td>{props.product.heading}</td>
      <td>{props.product.tier}</td>
      <td>{props.product.liveMode ? 'Live' : 'Sandbox'}</td>
      <td>By {props.product.createdBy} <br/>at {props.product.createdUtc}</td>
      <td>
        {
          props.product.active ?
          <ActiveBadge active={true} /> :
          <Button variant="link"
            disabled={submitting}
            onClick={handleActivate}
          >
            { submitting ? 'Activating...' : 'Activate'}
          </Button>
        }
      </td>
    </tr>
  )
}

function HeadRow() {
  const items = ['ID', 'Name', 'Tier', 'Mode', 'Created', 'Active'];

  return (
    <tr>
      {
        items.map((item, i) => <th key={i}>{item}</th>)
      }
    </tr>
  )
}
