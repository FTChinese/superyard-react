import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router';
import { ErrorBoudary } from '../../components/ErrorBoundary';
import { LoadingSpinner } from '../../components/progress/LoadingSpinner';
import { Unauthorized } from '../../components/routes/Unauthorized';
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
import { IntroductoryDetails } from '../../features/paywall/IntroductoryDetails';

export function ProductDetailPage() {
  const { productId } = useParams<'productId'>();
  const { passport } = useAuthContext();


  if (!productId) {
    return <div>Product id missing in url!</div>;
  }

  if (!passport) {
    return <Unauthorized />;
  }

  const live = useRecoilValue(liveModeState);

  const [ product, setProduct ] = useState<Product>();
  const [ errLoadProduct, setErrLoadProduct ] = useState('');
  const [ loadingProduct, setLoadingProduct ] = useState(true);

  const [ prices, setPrices ] = useState<PaywallPrice[]>([]);
  const [ errLoadPrice, setErrLoadPrice ] = useState('');
  const [ loadingPrice, setLoadingPrice ] = useState(true);

  const [ showNewPrice, setShowNewPrice ] = useState(false);

  useEffect(() => {
    setErrLoadProduct('');
    setLoadingProduct(true);
    setProduct(undefined);

    loadProduct(
        productId,
        { live, token: passport.token }
      )
      .then(product => {
        setLoadingProduct(false);
        setProduct(product);
      })
      .catch((err: ResponseError) => {
        setLoadingProduct(false);
        setErrLoadProduct(err.message)
      });
  }, [live]);

  useEffect(() => {
    setErrLoadPrice('');
    setLoadingPrice(false);
    setPrices([]);

    listPriceOfProduct(
        productId,
        { live, token: passport.token}
      )
      .then(prices => {
        setLoadingPrice(false);
        setPrices(prices);
      })
      .catch((err: ResponseError) => {
        setLoadingPrice(false);
        setErrLoadPrice(err.message)
      });
  }, [live]);


  const handlePriceCreated: OnPriceUpserted = (price: PaywallPrice) => {
    setShowNewPrice(false);
    setPrices([
      price,
      ...prices
    ]);
  }

  const handlePriceUpdated: OnPriceUpserted = (price: PaywallPrice) => {
    setPrices(prices.map(p => {
      if (p.id === price.id) {
        return price;
      }

      return p;
    }));
  }

  const handlePriceActivated: OnPriceUpserted = (price: PaywallPrice) => {
    setPrices(prices.map(p => {
      if (p.id === price.id) {
        return price;
      }
      if (p.cycle === price.cycle && p.kind === price.kind && p.active) {
        return {
          ...p,
          active: false,
        }
      }

      return p;
    }));
  };

  const handlePriceArchived: OnPriceUpserted = (target: PaywallPrice) => {
    setPrices(prices.filter(p => p.id !== target.id));
  };

  return (
    <>
      <section className="mb-3">
        <h4>Product Details</h4>
        <ErrorBoudary errMsg={errLoadProduct}>
          <LoadingSpinner loading={loadingProduct}>
            <>
              {
                product &&
                <ProductDetails
                  passport={passport}
                  product={product}
                  onUpdated={setProduct}
                />
              }
            </>
          </LoadingSpinner>
        </ErrorBoudary>
      </section>

      <section className="mb-3">
        <h4>Introductory Price</h4>
        <LoadingSpinner loading={loadingProduct}>
          {
            (product && product.introductory) ?
            <IntroductoryDetails
              passport={passport}
              price={product.introductory}
              onRefreshed={setProduct}
            /> :
            <p>Not set</p>
          }
        </LoadingSpinner>
      </section>

      <section>
        <h4 className="d-flex justify-content-between">
          <span>Price List</span>
          {
            product &&
            <Button
              onClick={() => setShowNewPrice(true)}
            >
              New Price
            </Button>
          }
        </h4>
        <ErrorBoudary errMsg={errLoadPrice}>
          <LoadingSpinner loading={loadingPrice}>
            <>
              {
                prices.map(price => (
                  <PriceListItem
                    passport={passport}
                    price={price}
                    onUpdated={handlePriceUpdated}
                    onActivated={handlePriceActivated}
                    onArchived={handlePriceArchived}
                    onIntroAttached={setProduct}
                    key={price.id}
                  />
                ))
              }
            </>
          </LoadingSpinner>
        </ErrorBoudary>
      </section>
      {
        product &&
        <PriceFormDialog
          passport={passport}
          show={showNewPrice}
          onHide={() => setShowNewPrice(false)}
          onUpserted={handlePriceCreated}
          product={product}
        />
      }
    </>
  );
}


