import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ErrorBoudary } from '../../components/ErrorBoundary';
import { LoadingSpinner } from '../../components/progress/LoadingSpinner';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { CMSPassport } from '../../data/cms-account';
import { PaywallPrice, Product } from '../../data/paywall';
import { PriceList } from '../../features/paywall/PriceList';
import { ProductDetails } from '../../features/paywall/ProductDetails';
import { listPriceOfProduct, loadProduct } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { useAuthContext } from '../../store/AuthContext';
import { useLiveState } from '../../store/useLiveState';

export function ProductDetailPage() {
  const { productId } = useParams<'productId'>();
  const { passport } = useAuthContext();

  if (!productId) {
    return <div>Product id missing in url!</div>;
  }

  if (!passport) {
    return <Unauthorized />;
  }

  return (
    <>
      <section className="mb-3">
        <LoadProduct
          passport={passport}
          productId={productId}
        />
      </section>
      <section>
        <LoadPrices
          passport={passport}
          productId={productId}
        />
      </section>
    </>
  );
}

function LoadProduct(
  props: {
    passport: CMSPassport;
    productId: string;
  }
) {
  const [ err, setErr ] = useState('');
  const [ loading, setLoading ] = useState(true);

  const { live } = useLiveState();

  const [ product, setProduct ] = useState<Product>();

  useEffect(() => {
    loadProduct(
        props.productId,
        { live, token: props.passport.token}
      )
      .then(product => {
        setLoading(false);
        setProduct(product);
      })
      .catch((err: ResponseError) => {
        setLoading(false);
        setErr(err.message)
      });
  }, [live]);

  return (
    <ErrorBoudary errMsg={err}>
      <LoadingSpinner loading={loading}>
        <>
          <h4>Product Details</h4>
          {product &&
            <ProductDetails
              passport={props.passport}
              product={product}
              onUpdated={setProduct}
          />}
        </>
      </LoadingSpinner>
    </ErrorBoudary>
  );
}

function LoadPrices(
  props: {
    passport: CMSPassport,
    productId: string;
  }
) {
  const [ err, setErr ] = useState('');
  const [ loading, setLoading ] = useState(true);

  const { live } = useLiveState();

  const [ prices, setPrices ] = useState<PaywallPrice[]>();

  useEffect(() => {
    listPriceOfProduct(
        props.productId,
        { live, token: props.passport.token}
      )
      .then(prices => {
        setLoading(false);
        setPrices(prices);
      })
      .catch((err: ResponseError) => {
        setLoading(false);
        setErr(err.message)
      });
    }, [live]);

  return (
    <ErrorBoudary errMsg={err}>
      <LoadingSpinner loading={loading}>
        <>
          <h4 className="d-flex justify-content-between">
            <span>Price List</span>
            <button className="btn btn-primary">New Price</button>
          </h4>
          {prices && <PriceList prices={prices} />}
        </>
      </LoadingSpinner>
    </ErrorBoudary>
  );
}
