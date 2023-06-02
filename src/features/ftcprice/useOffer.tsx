import { FormikHelpers } from 'formik';
import { DiscountFormVal, buildDiscountParams } from './OfferForm';
import { CMSPassport } from '../../data/cms-account';
import { ReqConfig } from '../../http/ReqConfig';
import { Discount, Price } from '../../data/ftc-price';
import { createFtcOffer, dropFtcOffer, refreshFtcPriceOffers } from '../../repository/paywall';
import { toast } from 'react-toastify';
import { ResponseError } from '../../http/response-error';
import { useState } from 'react';
import { PaywallPrice } from '../../data/paywall';

export function useOffer() {

  const [refreshing, setRefreshing] = useState(false);
  const [dropping, setDropping] = useState(false);

  const createOffer = (
    props: {
      passport: CMSPassport,
      live: boolean,
      price: Price,
      onSaved: (d: Discount) => void;
    }
  ) => {

    const config: ReqConfig = {
      live: props.live,
      token: props.passport.token,
    };

    return (
      values: DiscountFormVal,
      helpers: FormikHelpers<DiscountFormVal>
    ) => {
      helpers.setSubmitting(true);

      const body = buildDiscountParams(values, {
        createdBy: props.passport.userName,
        priceId: props.price.id,
      });

      console.log(body);

      createFtcOffer(body, config)
        .then((discount) => {
          toast.info('Success');
          helpers.setSubmitting(false);
          props.onSaved(discount);
        })
        .catch((err: ResponseError) => {
          toast.error(err.message);
          helpers.setSubmitting(false);

          if (err.invalid) {
            helpers.setErrors(err.toFormFields);
          }
        });
    };
  };

  const refreshOffers = (
    priceId: string,
    config: ReqConfig,
    onSaved: (pw: PaywallPrice) => void,
  ) => {
    setRefreshing(true);

    refreshFtcPriceOffers(priceId, config)
      .then((pwp) => {
        setRefreshing(false);
        toast.success('Discounts refreshed!');
        onSaved(pwp)
      })
      .catch((err: ResponseError) => {
        setRefreshing(false);
        toast.error(err.message);
      });
  }

  const dropOffer = (
    id: string,
    config: ReqConfig,
    onSaved: (pwp: PaywallPrice) => void,
  ) => {
    setDropping(true);

    dropFtcOffer(id, config)
      .then((pwp) => {
        setDropping(false);
        toast.success('Dropped!');
        onSaved(pwp);
      })
      .catch((err: ResponseError) => {
        setDropping(false);
        toast.error(err.message);
      });
  };

  return {
    createOffer,
    refreshOffers,
    refreshing,
    dropOffer,
    dropping,
  };
}
