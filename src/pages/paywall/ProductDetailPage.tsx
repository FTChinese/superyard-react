import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router';
import { ErrorBoudary } from '../../components/ErrorBoundary';
import { LoadingSpinner } from '../../components/progress/LoadingSpinner';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { CMSPassport } from '../../data/cms-account';
import { PaywallPrice, Product } from '../../data/paywall';
import { Price } from '../../data/price';
import { PriceFormDialog } from '../../features/paywall/PriceFormDialog';
import { PriceList } from '../../features/paywall/PriceList';
import { OnPriceUpserted } from "../../features/paywall/callbacks";
import { ProductDetails } from '../../features/paywall/ProductDetails';
import { listPriceOfProduct, loadProduct } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { useAuthContext } from '../../store/AuthContext';
import { useLiveState } from '../../store/useLiveState';

export function ProductDetailPage() {
  const { productId } = useParams<'productId'>();
  const { passport } = useAuthContext();
  const [ product, setProduct ] = useState<Product>();

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
          onLoaded={setProduct}
        />
      </section>
      <section>
        <LoadPrices
          passport={passport}
          productId={productId}
          product={product}
        />
      </section>
    </>
  );
}

function LoadProduct(
  props: {
    passport: CMSPassport;
    productId: string;
    onLoaded: (product: Product) => void;
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
        props.onLoaded(product);
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
    product?: Product; // Passed from sibling component after product loaded.
  }
) {
  const [ err, setErr ] = useState('');
  const [ loading, setLoading ] = useState(true);
  const { live } = useLiveState();
  const [ show, setShow ] = useState(false);

  const [ prices, setPrices ] = useState<PaywallPrice[]>([]);

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

  const handleCreate = (price: Price) => {
    setPrices([
      {
        ...price,
        offers: [],
      },
      ...prices
    ])
  }

  const handleUpdate: OnPriceUpserted = (price: PaywallPrice) => {
    setPrices(prices.map(p => {
      if (p.id === price.id) {
        return price;
      }

      return p;
    }));
  }

  return (
    <ErrorBoudary errMsg={err}>
      <LoadingSpinner loading={loading}>
        <>
          <h4 className="d-flex justify-content-between">
            <span>Price List</span>
            { props.product &&
              <Button
                onClick={() => setShow(true)}
              >
                New Price
              </Button>
            }
          </h4>
          <PriceList
            passport={props.passport}
            prices={prices}
            onUpdated={handleUpdate}
          />
          <PriceFormDialog
            passport={props.passport}
            show={show}
            onHide={() => setShow(false)}
            onUpserted={handleCreate}
            product={props.product}
          />
        </>
      </LoadingSpinner>
    </ErrorBoudary>
  );
}
