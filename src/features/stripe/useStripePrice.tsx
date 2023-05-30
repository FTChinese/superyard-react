import { useState } from 'react';
import { toast } from 'react-toastify';
import { useProgress } from '../../components/hooks/useProgress';
import { isOneTime } from '../../data/enum';
import { StripeCoupon, StripePrice } from '../../data/stripe-price';
import { ReqConfig } from '../../http/ReqConfig';
import { ResponseError } from '../../http/response-error';
import { activateStripeCoupon, activateStripePrice, loadStripeCoupons, loadStripePrice, updateStripePriceMeta } from '../../repository/stripe';
import { FormikHelpers } from 'formik';
import { StripePriceFormVal, buildStripePriceParams } from './StripePriceForm';

export function useStripePrice() {
  const { startProgress, stopProgress } = useProgress();

  const [price, setPrice] = useState<StripePrice>();
  const [showPriceActivate, setShowPriceActivate] = useState(false);

  const [coupons, setCoupons] = useState<StripeCoupon[]>([]);

  // Load a stripe price, or force refreshing by passing `refresh: true`.
  const loadPrice = (priceId: string, config: ReqConfig) => {
    startProgress();
    if (!config.refresh) {
      setPrice(undefined);
    }

    loadStripePrice(priceId, config)
      .then((sp) => {

        setPrice(sp);
        stopProgress();

        if (isOneTime(sp.kind)) {
          return;
        }

        // Continue to load coupons.
        if (!config.refresh) {
          listCoupns(priceId, config);
        } else {
          toast.info('Refresh succeeded!')
        }
      })
      .catch((err: ResponseError) => {
        stopProgress();
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

  const activatePrice = (p: StripePrice, cofig: ReqConfig) => {
    startProgress();

    activateStripePrice(p, cofig)
      .then((newPrice) => {
        stopProgress();
        setPrice(newPrice);
        toast.info(`${p.onPaywall ? 'Deactivate' : 'Activate'} price succeeded!`);
        setShowPriceActivate(false);
      })
      .catch((err: ResponseError) => {
        stopProgress();
        toast.error(err.message);
      });
  }

  const listCoupns = (priceId: string, config: ReqConfig) => {
    startProgress()
    loadStripeCoupons(priceId, config)
      .then((c) => {
        stopProgress();
        setCoupons(c);
      })
      .catch((err: ResponseError) => {
        stopProgress();
        toast.error(err.message);
      });
  }

  const activateCoupon = (couponId: string, config: ReqConfig) => {
    startProgress();

    activateStripeCoupon(couponId, config)
      .then(c => {
        stopProgress();
        onCouponUpdated(c);
      })
      .catch((err: ResponseError) => {
        stopProgress();
        toast.error(err.message);
      });
  }

  const onCouponCreated = (coupon: StripeCoupon) => {
    setCoupons([
      coupon,
      ...coupons,
    ]);
  }

  const onCouponUpdated = (coupon: StripeCoupon) => {
    setCoupons(coupons.map(c => {
      if (coupon.id === c.id) {
        return coupon;
      } else {
        return c;
      }
    }));
  }

  return {
    price,
    loadPrice,

    activatePrice,
    showPriceActivate,
    setShowPriceActivate,

    updatePriceMeta,

    coupons,
    onCouponCreated,
    onCouponUpdated,
    activateCoupon,
  };
}
