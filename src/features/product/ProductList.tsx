import { Link } from 'react-router-dom';
import { Product } from '../../data/paywall';
import { ActiveBadge } from '../../components/text/Badge';

export function ProductList(props: {
  products: Product[];
}) {
  return (
    <table className="table">
      <thead>
        <HeadRow />
      </thead>
      <tbody>
        {props.products.map((prod) => (
          <ProductRow
            product={prod}
            key={prod.id}
          />
        ))}
      </tbody>
    </table>
  );
}

function ProductRow(props: {
  product: Product;
}) {

  return (
    <tr>
      <td>
        <Link to={props.product.id}>{props.product.id}</Link>
      </td>
      <td>{props.product.heading}</td>
      <td>{props.product.tier}</td>
      <td>{props.product.liveMode ? 'Live' : 'Sandbox'}</td>
      <td>
        By {props.product.createdBy} <br />
        at {props.product.createdUtc}
      </td>
      <td>
        <ActiveBadge active={props.product.active} />
      </td>
    </tr>
  );
}

function HeadRow() {
  const items = ['ID', 'Name', 'Tier', 'Mode', 'Created', 'Active'];

  return (
    <tr>
      {items.map((item, i) => (
        <th key={i}>{item}</th>
      ))}
    </tr>
  );
}
