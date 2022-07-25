import { useState } from 'react';
import { toast } from 'react-toastify';
import { useProgress } from '../../components/hooks/useProgress';
import { isOneTime } from '../../data/enum';
import { StripeCoupon, StripePrice } from '../../data/stripe-price';
import { ReqConfig } from '../../http/ReqConfig';
import { ResponseError } from '../../http/response-error';
import { activateStripeCoupon, loadStripeCoupons, loadStripePrice } from '../../repository/stripe';

export function useStripe() {
  const { startProgress, stopProgress } = useProgress();

  const [price, setPrice] = useState<StripePrice>();
  const [coupons, setCoupons] = useState<StripeCoupon[]>([]);

  const loadPrice = (priceId: string, config: ReqConfig) => {
    startProgress();
    setPrice(undefined);

    loadStripePrice(priceId, config)
      .then((sp) => {

        setPrice(sp);
        if (isOneTime(sp.kind)) {
          stopProgress();
          return;
        }

        listCoupns(priceId, config);
      })
      .catch((err: ResponseError) => {
        stopProgress();
        toast.error(err.message);
      });
  }

  const listCoupns = (priceId: string, config: ReqConfig) => {
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
    coupons,
    onCouponCreated,
    onCouponUpdated,
    activateCoupon,
  };
}
