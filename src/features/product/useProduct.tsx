import { useState } from 'react';
import { PaywallPrice, Product } from '../../data/paywall';
import { ReqConfig } from '../../http/ReqConfig';
import { listPriceOfProduct, loadFtcProduct } from '../../repository/paywall';
import { ResponseError } from '../../http/response-error';
import { toast } from 'react-toastify';
import { Price } from '../../data/ftc-price';
import { useProgress } from '../../components/hooks/useProgress';

export function useProduct() {
  const { startProgress, stopProgress } = useProgress();
  const [product, setProduct] = useState<Product>();
  const [priceList, setPriceList] = useState<PaywallPrice[]>([]);

  // Loads a product.
  const loadProduct = (id: string, config: ReqConfig): Promise<boolean> => {
    setProduct(undefined);

    return loadFtcProduct(id, config)
      .then((product) => {
        setProduct(product);
        return true;
      })
      .catch((err: ResponseError) => {
        toast.error(err.message);
        return false;
      });
  }

  // List prices for the specified product.
  const loadPrices = (productId: string, config: ReqConfig): Promise<boolean> => {
    setPriceList([]);

    return listPriceOfProduct(productId, config)
      .then((prices) => {
        setPriceList(prices);
        return true;
      })
      .catch((err: ResponseError) => {
        toast.info(err.message);
        return false;
      });
  };

  // Loading product and prices concurrently.
  // Whichever data is fetched first will be present on UI,
  // and there's only a single progress indicator
  // during the whole progress.
  const initLoading = (productId: string, config: ReqConfig) => {
    startProgress();

    Promise.all([
      loadProduct(productId, config),
      loadPrices(productId, config)
    ])
      .then(() => {
        // Indicator stops only after both finished.
        stopProgress();
      });
  }

  const onProductUpdated = (p: Product) => {
    setProduct(p);
  };

  const onPriceCreated = (p: Price) => {
    setPriceList([
      {
        ...p,
        offers: [],
      },
      ...priceList,
    ]);
  };

  return {
    product,
    priceList,
    initLoading,

    onProductUpdated,
    onPriceCreated,
  };
}
