import { FormikHelpers } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { StripePrice } from '../../data/stripe-price';
import { ReqConfig } from '../../http/ReqConfig';
import { ResponseError } from '../../http/response-error';
import { activateStripePrice, updateStripePrice } from '../../repository/stripe';
import { StripePriceFormVal, buildStripePriceParams } from './StripePriceForm';

export function usePriceUpsert() {
  // Status for activating/deactivating price.
  const [changingStatus, setChangingStatus] = useState(false);

  // updatePriceMeta returns s closure to meet
  // Formik's submit signature.
  const updatePrice = (
    p: StripePrice,
    config: ReqConfig,
    onSaved: (p: StripePrice) => void
  ) => {
    return (
      values: StripePriceFormVal,
      helpers: FormikHelpers<StripePriceFormVal>
    ) => {
      console.log(values);

      const body = buildStripePriceParams(values, p);
      console.log(body);

      helpers.setSubmitting(true);

      updateStripePrice(p.id, body, config)
        .then((newPrice) => {
          helpers.setSubmitting(false);
          toast.success('Saved!');
          onSaved(newPrice);
        })
        .catch((err: ResponseError) => {
          helpers.setSubmitting(false);
          if (err.invalid) {
            helpers.setErrors(err.toFormFields);
            return;
          }
          toast.error(err.message);
        });
    };
  };

  const changeStatus = (
    p: StripePrice,
    config: ReqConfig,
    onSaved: (p: StripePrice) => void,
  ) => {
    setChangingStatus(true);

    return activateStripePrice(p, config)
      .then((newPrice) => {
        console.log(newPrice);
        toast.info(`${p.onPaywall ? 'Deactivate' : 'Activate'} price succeeded!`);
        setChangingStatus(false);
        onSaved(newPrice);
      })
      .catch((err: ResponseError) => {
        toast.error(err.message);
        setChangingStatus(false);
      });
  }

  return {
    updatePrice,
    changeStatus,
    changingStatus
  }
}
