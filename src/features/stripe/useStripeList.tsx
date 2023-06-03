import { useState } from 'react';
import { StripePrice, StripePriceList } from '../../data/stripe-price';
import { ReqConfig } from '../../http/ReqConfig';
import { listStripePrices, loadStripePrice } from '../../repository/stripe';
import { ResponseError } from '../../http/response-error';
import { toast } from 'react-toastify';
import { PagingQuery } from '../../http/paged-list';
import { useProgress } from '../../components/hooks/useProgress';

export function useStripeList() {

  const { startProgress, stopProgress } = useProgress();
  const [pagedPrices, setPagedPrices] = useState<StripePriceList>();

  const [loadingPrice, setLoadingPrice] = useState(false);
  const [price, setPrice] = useState<StripePrice>();

  const listPrices = (config: ReqConfig, page: PagingQuery) => {
    startProgress();

    listStripePrices(config, page)
      .then((list) => {
        stopProgress();
        setPagedPrices(list);
      })
      .catch((err: ResponseError) => {
        console.log(err);
        stopProgress()
        toast.error(err.message);
      });
  };

  // Load a price before setting updating its metadata.
  const loadPrice = (
    priceId: string,
    config: ReqConfig
  ) => {
    setLoadingPrice(true);
    setPrice(undefined);

    loadStripePrice(priceId, config)
      .then((sp) => {
        setLoadingPrice(false)
        setPrice(sp);
      })
      .catch((err: ResponseError) => {
        console.log(err);
        setLoadingPrice(false);
        toast.error(err.message);
      });
  };

  const onPriceFound = (sp: StripePrice) => {
    if (!pagedPrices) {
      return;
    }
    const newList = pagedPrices.data.filter(p => p.id !== sp.id);

    setPagedPrices({
      ...pagedPrices,
      data: [
        sp,
        ...newList,
      ],
    });
  }

  return {
    pagedPrices,
    listPrices,

    loadingPrice,
    loadPrice,
    price,
    onPriceFound,
  }
}

