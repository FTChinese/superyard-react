import { useState } from 'react';
import { Product } from '../../data/paywall';
import { ReqConfig } from '../../http/ReqConfig';
import { listFtcProducts } from '../../repository/paywall';
import { ResponseError } from '../../http/response-error';
import { toast } from 'react-toastify';

export function useProductList() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const listProducts = (config: ReqConfig) => {
    setLoading(true);

    listFtcProducts(config)
      .then((products) => {
        setLoading(false);
        setProducts(products);
      })
      .catch((err: ResponseError) => {
        setLoading(false);
        toast.info(err.message);
      });
  };

  const onProductCreated = (p: Product) => {
    setProducts([
      p,
      ...products,
    ]);
  }

  return {
    loading,
    products,
    listProducts,
    onProductCreated,
  };
}
