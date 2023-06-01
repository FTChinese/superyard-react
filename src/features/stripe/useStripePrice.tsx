import { useState } from 'react';
import { toast } from 'react-toastify';
import { useProgress } from '../../components/hooks/useProgress';
import { isOneTime } from '../../data/enum';
import { StripeCoupon, StripePrice } from '../../data/stripe-price';
import { ReqConfig } from '../../http/ReqConfig';
import { ResponseError } from '../../http/response-error';
import { listStripeCoupons, loadStripePrice } from '../../repository/stripe';

export function useStripePrice() {
  const { startProgress, stopProgress } = useProgress();

  const [price, setPrice] = useState<StripePrice>();

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

  const onPriceUpdated = (p: StripePrice) => {
    setPrice(p);
  }

  const listCoupns = (priceId: string, config: ReqConfig) => {
    startProgress()
    listStripeCoupons(priceId, config)
      .then((c) => {
        stopProgress();
        setCoupons(c);
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
    setCoupons([
      coupon,
      ...coupons.filter((v) => v.id !== coupon.id)
    ]);
  }

  return {
    loadPrice,
    price,

    coupons,

    onCouponCreated,
    onCouponUpdated,
    onPriceUpdated,
  };
}
