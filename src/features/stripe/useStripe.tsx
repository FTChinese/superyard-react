import { useState } from 'react';
import { loadingStopped, loadingStarted, loadingErrored } from '../../components/progress/ProgressOrError';
import { isOneTime } from '../../data/enum';
import { StripeCoupon, StripePrice } from '../../data/stripe-price';
import { ReqConfig } from '../../http/ReqConfig';
import { ResponseError } from '../../http/response-error';
import { loadStripeCoupons, loadStripePrice } from '../../repository/stripe';

export function useStripe() {
  const [priceLoading, setPriceLoading] = useState(loadingStopped);
  const [price, setPrice] = useState<StripePrice>();

  const [couponsLoading, setCouponsLoading] = useState(loadingStopped);
  const [coupons, setCoupons] = useState<StripeCoupon[]>([]);

  const loadPrice = (priceId: string, config: ReqConfig) => {
    setPriceLoading(loadingStarted());
    setPrice(undefined);

    loadStripePrice(priceId, config)
      .then((sp) => {
        setPriceLoading(loadingStopped());
        setPrice(sp);
        if (isOneTime(sp.kind)) {
          setCouponsLoading(loadingErrored('Introductory price cannot have any coupons'));
          return;
        }

        listCoupns(priceId, config);
      })
      .catch((err: ResponseError) => {
        setPriceLoading(loadingErrored(err.message));
      });
  }

  const listCoupns = (priceId: string, config: ReqConfig) => {
    loadStripeCoupons(priceId, config)
      .then((c) => {
        setCouponsLoading(loadingStopped());
        setCoupons(c);
      })
      .catch((err: ResponseError) => {
        setCouponsLoading(loadingErrored(err.message));
      });
  }

  const upsertCoupon = (coupon: StripeCoupon) => {
    setCoupons([
      coupon,
      ...coupons.filter(c => c.id !== coupon.id)
    ]);
  }

  return {
    priceLoading,
    price,
    loadPrice,
    couponsLoading,
    coupons,
    upsertCoupon,
  };
}
