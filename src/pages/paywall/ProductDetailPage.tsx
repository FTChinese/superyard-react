import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router';
import { ErrorBoudary } from '../../components/ErrorBoundary';
import { LoadingSpinner } from '../../components/progress/LoadingSpinner';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { CMSPassport } from '../../data/cms-account';
import { PaywallPrice, Product } from '../../data/paywall';
import { PriceFormDialog } from '../../features/paywall/PriceFormDialog';
import { PriceListItem } from '../../features/paywall/PriceListItem';
import { OnPriceUpserted } from "../../features/paywall/callbacks";
import { ProductDetails } from '../../features/paywall/ProductDetails';
import { listPriceOfProduct, loadProduct } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { useAuthContext } from '../../store/AuthContext';
import { useRecoilValue } from 'recoil';
import { liveModeState } from '../../store/recoil-state';

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
  const live = useRecoilValue(liveModeState);

  const [ err, setErr ] = useState('');
  const [ loading, setLoading ] = useState(true);
  const [ product, setProduct ] = useState<Product>();

  useEffect(() => {
    setErr('');
    setLoading(true);
    setProduct(undefined);

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
          {
            product &&
            <ProductDetails
              passport={props.passport}
              product={product}
              onUpdated={setProduct}
            />
          }
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
  const live = useRecoilValue(liveModeState);
  const [ err, setErr ] = useState('');
  const [ loading, setLoading ] = useState(true);
  const [ prices, setPrices ] = useState<PaywallPrice[]>([]);

  const [ show, setShow ] = useState(false);

  useEffect(() => {
    setErr('');
    setLoading(false);
    setPrices([]);

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

  const handleCreate: OnPriceUpserted = (price: PaywallPrice) => {
    setShow(false);
    setPrices([
      price,
      ...prices
    ]);
  }

  const handleUpdate: OnPriceUpserted = (price: PaywallPrice) => {
    setPrices(prices.map(p => {
      if (p.id === price.id) {
        return price;
      }

      return p;
    }));
  }

  const handleActivate: OnPriceUpserted = (price: PaywallPrice) => {
    setPrices(prices.map(p => {
      if (p.id === price.id) {
        return price;
      }
      if (p.cycle === price.cycle && p.active) {
        return {
          ...p,
          active: false,
        }
      }

      return p;
    }));
  };

  const handleArchiv: OnPriceUpserted = (target: PaywallPrice) => {
    setPrices(prices.filter(p => p.id !== target.id));
  };

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
          {
            prices.map(price => (
              <PriceListItem
                passport={props.passport}
                price={price}
                onUpdated={handleUpdate}
                onActivated={handleActivate}
                onArchived={handleArchiv}
                key={price.id}
              />
            ))
          }
          { props.product &&
            <PriceFormDialog
              passport={props.passport}
              show={show}
              onHide={() => setShow(false)}
              onUpserted={handleCreate}
              product={props.product}
            />
          }
        </>
      </LoadingSpinner>
    </ErrorBoudary>
  );
}
