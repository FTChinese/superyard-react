import { useState } from 'react';
import { StripePrice, StripePriceList } from '../../data/stripe-price';
import { ReqConfig } from '../../http/ReqConfig';
import { listStripePrices, loadStripePrice, updateStripePriceMeta } from '../../repository/stripe';
import { ResponseError } from '../../http/response-error';
import { toast } from 'react-toastify';
import { StripePriceFormVal, buildStripePriceParams } from './StripePriceForm';
import { FormikHelpers } from 'formik';
import { PagingQuery } from '../../http/paged-list';

export function useStripeList() {
  const [loadingList, setLoadingList] = useState(false);
  const [pagedPrices, setPagedPrices] = useState<StripePriceList>();

  const [loadingPrice, setLoadingPrice] = useState(false);
  const [price, setPrice] = useState<StripePrice>();

  const listPrices = (config: ReqConfig, page: PagingQuery) => {
    setLoadingList(true);

    listStripePrices(config, page)
      .then((list) => {
        setLoadingList(false);
        setPagedPrices(list);
      })
      .catch((err: ResponseError) => {
        console.log(err);
        setLoadingList(false);
        toast.error(err.message);
      });
  }

  // Load a price before setting updating its metadata.
  const loadPrice = (priceId: string, config: ReqConfig) => {
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
  }

  // updatePriceMeta returns s closure to meet
  // Formik's submit signature.
  const updatePriceMeta = (p: StripePrice, config: ReqConfig) => {
    return (
      values: StripePriceFormVal,
      helpers: FormikHelpers<StripePriceFormVal>
    ) => {
      console.log(values);

      const body = buildStripePriceParams(values, p);

      helpers.setSubmitting(true);

      updateStripePriceMeta(p.id, body, config)
        .then((newPrice) => {
          helpers.setSubmitting(false);
          toast.success('Saved!');
          setPrice(newPrice);
        })
        .catch((err: ResponseError) => {
          helpers.setSubmitting(false);
          if (err.statusCode === 422) {
            helpers.setErrors(err.toFormFields);
            return;
          }
          toast.error(err.message);
        });
    };
  };

  return {
    loadingList,
    pagedPrices,
    listPrices,

    loadingPrice,
    loadPrice,
    price,
    updatePriceMeta,
  }
}

