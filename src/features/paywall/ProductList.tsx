import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CMSPassport } from '../../data/cms-account';
import { Product } from '../../data/paywall';
import { activateProduct } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
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
              passport={props.passport}
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
    passport: CMSPassport;
    product: Product;
    onActivated: (p: Product) => void;
  }
) {

  const [ submitting, setSubmitting ] = useState(false);

  const handleActivate = () => {
    console.log(`Activate product ${props.product}`);
    setSubmitting(true);

    activateProduct(
        props.product.id,
        {
          live: props.product.liveMode,
          token: props.passport.token
        }
      )
      .then(prod => {
        setSubmitting(false);

        props.onActivated(prod);
      })
      .catch((err: ResponseError) => {
        setSubmitting(false);
        toast.error(err.message);
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
          <Button variant="outline-primary"
            size="sm"
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
