import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router';
import { ErrorBoudary } from '../../components/ErrorBoundary';
import { LoadingSpinner } from '../../components/progress/LoadingSpinner';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { PaywallPrice, Product } from '../../data/paywall';
import { PriceFormDialog } from '../../features/paywall/PriceFormDialog';
import { PriceListItem } from '../../features/paywall/PriceListItem';
import { OnPaywallPriceUpserted, OnPriceUpserted, OnProductUpserted } from "../../features/paywall/callbacks";
import { ProductDetails } from '../../features/paywall/ProductDetails';
import { listPriceOfProduct, loadProduct } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { useAuthContext } from '../../store/AuthContext';
import { useRecoilValue } from 'recoil';
import { liveModeState } from '../../store/recoil-state';
import { IntroductoryDetails } from '../../features/paywall/IntroductoryDetails';
import { isRecurring } from '../../data/enum';
import { Price } from '../../data/price';

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

  const [ paywallPrices, setPaywallPrices ] = useState<PaywallPrice[]>([]);
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
    setPaywallPrices([]);

    listPriceOfProduct(
        productId,
        { live, token: passport.token}
      )
      .then(prices => {
        setLoadingPrice(false);
        setPaywallPrices(prices);
      })
      .catch((err: ResponseError) => {
        setLoadingPrice(false);
        setErrLoadPrice(err.message)
      });
  }, [live]);


  const handlePriceCreated: OnPriceUpserted = (price: Price) => {
    setShowNewPrice(false);
    setPaywallPrices([
      {
        ...price,
        offers: [],
      },
      ...paywallPrices
    ]);
  }

  // When a price is edited, or discount list added/removed.
  const priceUpdated: OnPaywallPriceUpserted = (price: PaywallPrice) => {
    setPaywallPrices(paywallPrices.map(p => {
      if (p.id === price.id) {
        return price;
      }

      return p;
    }));
  };

  const priceActivated: OnPriceUpserted = (price: Price) => {
    setPaywallPrices(paywallPrices.map(item => {
      // The modified price.
      if (item.id === price.id) {
        return {
          ...price,
          offers: item.offers,
        };
      }
      // Flag all others' active to false.
      if (item.cycle === price.cycle && item.kind === price.kind && item.active) {
        return {
          ...item,
          active: false,
        }
      }

      // Fallback.
      return item;
    }));
  };

  const priceArchived: OnPriceUpserted = (price: Price) => {
    setPaywallPrices(paywallPrices.filter(item => item.id !== price.id));
  };

  const handleIntro: OnProductUpserted = (prod: Product) => {
    setProduct(prod);

    // Price attached.
    if (prod.introductory) {
      return;
    }

    // Deactivate all one time prices.
    setPaywallPrices(paywallPrices.map(p => {
      if (isRecurring(p.kind)) {
        return p;
      }

      return {
        ...p,
        active: false,
      }
    }));
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
              onRefreshOrDrop={handleIntro}
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
                paywallPrices.map(price => (
                  <PriceListItem
                    passport={passport}
                    paywallPrice={price}
                    onUpdated={priceUpdated}
                    onActivated={priceActivated}
                    onArchived={priceArchived}
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


