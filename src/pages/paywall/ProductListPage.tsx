import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorBoudary } from '../../components/ErrorBoundary';
import { LoadingSpinner } from '../../components/progress/LoadingSpinner';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { Product } from '../../data/paywall';
import { ActiveBadge } from '../../features/paywall/Badge';
import { listProduct } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { useAuthContext } from '../../store/AuthContext';
import { useLiveState } from '../../store/useLiveState';

function PageHead() {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <h2 className="mb-3">Products</h2>
      <button className="btn btn-primary">New</button>
    </div>
  );
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

function ProductRow(
  props: {
    product: Product;
  }
) {
  return (
    <tr>
      <td><Link to={props.product.id}>{props.product.id}</Link></td>
      <td>{props.product.heading}</td>
      <td>{props.product.tier}</td>
      <td>{props.product.liveMode ? 'Live' : 'Sandbox'}</td>
      <td>By {props.product.createdBy} <br/>at {props.product.createdUtc}</td>
      <td>
        {
          props.product.active ?
          <ActiveBadge active={true} /> :
          <button className="btn btn-link btn-sm">Acivate</button>
        }
      </td>
    </tr>
  )
}

function ProductList(
  props: {
    products: Product[]
  }
) {
  return (
    <table className="table">
      <thead>
        <HeadRow />
      </thead>
      <tbody>
        {
          props.products.map(prod =>(
            <ProductRow product={prod} key={prod.id} />
          ))
        }
      </tbody>
    </table>
  );
}

export function ProductListPage() {
  const [ err, setErr ] = useState('');
  const [ loading, setLoading ] = useState(true);

  const { live } = useLiveState();
  const { passport } = useAuthContext();

  const [ products, setProducts ] = useState<Product[]>([]);

  if (!passport) {
    return <Unauthorized/>;
  }

  useEffect(() => {
    listProduct({ live, token: passport.token})
      .then(products => {
        setLoading(false);
        setProducts(products);
      })
      .catch((err: ResponseError) => {
        setLoading(false);
        setErr(err.message)
      });
  }, [live]);

  return (
    <ErrorBoudary errMsg={err}>
      <LoadingSpinner loading={loading}>
        <div>
          <PageHead />
          <ProductList products={products} />
        </div>
      </LoadingSpinner>
    </ErrorBoudary>
  );
}
