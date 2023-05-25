import { useState } from 'react';
import { PaywallPrice, Product } from '../../data/paywall';
import { ReqConfig } from '../../http/ReqConfig';
import { activateFtcProduct, listPriceOfProduct, loadFtcProduct } from '../../repository/paywall';
import { ResponseError } from '../../http/response-error';
import { toast } from 'react-toastify';
import { Price } from '../../data/ftc-price';

export function useProduct() {
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [activating, setActivating] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(false);

  const [product, setProduct] = useState<Product>();
  const [priceList, setPriceList] = useState<PaywallPrice[]>([]);

  // Loads a product.
  const loadProduct = (id: string, config: ReqConfig) => {
    setLoadingProduct(true);
    setProduct(undefined);

    loadFtcProduct(id, config)
      .then((product) => {
        setLoadingProduct(false);
        setProduct(product);
      })
      .catch((err: ResponseError) => {
        setLoadingProduct(false);
        toast.error(err.message);
      });
  }

  const activateProduct = (id: string, config: ReqConfig) => {
    setActivating(true);

    activateFtcProduct(id, config)
      .then((prod) => {
        setActivating(false);
        toast.success('Activation succeeded. The product is put on paywall.');
        setProduct(prod);
      })
      .catch((err: ResponseError) => {
        setActivating(false);
        toast.error(err.message);
      });
  };

  // List prices for the specified product.
  const loadPrices = (productId: string, config: ReqConfig) => {
    setLoadingPrice(true);
    setPriceList([]);

    // TODO: pagination.
    listPriceOfProduct(productId, config)
      .then((prices) => {
        setLoadingPrice(false)
        setPriceList(prices);
      })
      .catch((err: ResponseError) => {
        setLoadingPrice(false);
        toast.info(err.message);
      });
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
    loadingProduct,
    loadProduct,
    setProduct,

    activating,
    activateProduct,

    loadingPrice,
    priceList,
    loadPrices,

    onPriceCreated,
  };
}
