import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router';
import { Unauthorized } from '../../components/routes/Unauthorized';
import { PaywallPrice, Product } from '../../data/paywall';
import { PriceFormDialog } from '../../features/product/PriceFormDialog';
import { PriceListItem } from '../../features/product/PriceListItem';
import { OnPaywallPriceUpserted, OnPriceUpserted, OnProductUpserted } from "../../features/product/callbacks";
import { ProductDetails } from '../../features/product/ProductDetails';
import { listPriceOfProduct, loadProduct } from '../../repository/paywall';
import { ResponseError } from '../../repository/response-error';
import { IntroductoryDetails } from '../../features/product/IntroductoryDetails';
import { isRecurring } from '../../data/enum';
import { Price } from '../../data/price';
import { useAuth } from '../../components/hooks/useAuth';
import { useLiveMode } from '../../components/hooks/useLiveMode';
import { loadingErrored, ProgressOrError, loadingStarted, loadingStopped } from '../../components/progress/ProgressOrError';
import { Loading } from '../../components/progress/Loading';

export function ProductDetailPage() {
  const { productId } = useParams<'productId'>();
  const { passport } = useAuth();


  if (!productId) {
    return <div>Product id missing in url!</div>;
  }

  if (!passport) {
    return <Unauthorized />;
  }

  const { live } = useLiveMode();

  const [ product, setProduct ] = useState<Product>();
  const [ loadingProduct, setLoadingProduct ] = useState(loadingStarted());

  const [ paywallPrices, setPaywallPrices ] = useState<PaywallPrice[]>([]);
  const [ loadingPrice, setLoadingPrice ] = useState(loadingStarted());

  // Show create new price dialog.
  const [ showNewPrice, setShowNewPrice ] = useState(false);

  const [ refreshIntro, setRefreshIntro ] = useState(false);

  useEffect(() => {
    setLoadingProduct(loadingStarted());
    setProduct(undefined);

    loadProduct(
        productId,
        { live, token: passport.token }
      )
      .then(product => {
        setLoadingProduct(loadingStopped);
        setProduct(product);
      })
      .catch((err: ResponseError) => {
        setLoadingProduct(loadingErrored(err.message));
      });
  }, [live]);

  useEffect(() => {
    setLoadingPrice(loadingStarted());
    setPaywallPrices([]);

    listPriceOfProduct(
        productId,
        { live, token: passport.token}
      )
      .then(prices => {
        setLoadingPrice(loadingStopped());
        setPaywallPrices(prices);
      })
      .catch((err: ResponseError) => {
        setLoadingPrice(loadingErrored(err.message));
      });
  }, [live]);


  // When a price is created, update the price list.
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

    // If the updated price is used as an introductory,
    // tell the IntroductoryDetails
    // componnet to auto-refresh.
    setRefreshIntro(price.id === product?.introductory?.id)
  };

  // When a price is activated, update the item in
  // the list to reflect the changes.
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

  // When a price is archived, removed it from the current list.
  const priceArchived: OnPriceUpserted = (price: Price) => {
    setPaywallPrices(paywallPrices.filter(item => item.id !== price.id));
  };

  // When introdudctory price under this product
  // is refreshed or dropped.
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
        <ProgressOrError state={loadingProduct}>
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
        </ProgressOrError>
      </section>

      <section className="mb-3">
        <h4>Introductory Price</h4>
        <Loading loading={loadingProduct.progress}>
          {
            (product && product.introductory) ?
            <IntroductoryDetails
              passport={passport}
              price={product.introductory}
              updated={refreshIntro}
              onRefreshOrDrop={handleIntro}
            /> :
            <p>Not set</p>
          }
        </Loading>
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

        <ProgressOrError state={loadingPrice}>
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
        </ProgressOrError>
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


