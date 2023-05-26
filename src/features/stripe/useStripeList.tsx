import { useState } from 'react';
import { StripePrice } from '../../data/stripe-price';
import { ReqConfig } from '../../http/ReqConfig';
import { loadStripePrice, updateStripePriceMeta } from '../../repository/stripe';
import { ResponseError } from '../../http/response-error';
import { toast } from 'react-toastify';
import { StripePriceFormVal, buildStripePriceParams } from './StripePriceForm';
import { FormikHelpers } from 'formik';

export function useStripeList() {
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<StripePrice>();

  // Load a price before setting updating its metadata.
  const loadPrice = (priceId: string, config: ReqConfig) => {
    setLoading(true);
    setPrice(undefined);

    loadStripePrice(priceId, config)
      .then((sp) => {
        setLoading(false)
        setPrice(sp);
      })
      .catch((err: ResponseError) => {
        console.log(err);
        setLoading(false);
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
    loading,
    loadPrice,
    price,
    updatePriceMeta,
  }
}

