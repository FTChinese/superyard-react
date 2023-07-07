import { useState } from 'react';
import { ReqConfig } from '../../http/ReqConfig';
import { activateStripeCoupon, deleteStripeCoupon, loadStripeCoupon, updateStripeCoupon } from '../../repository/stripe';
import { StripeCoupon, StripePrice } from '../../data/stripe-price';
import { ResponseError } from '../../http/response-error';
import { CouponFormVal, buildCouponParams } from './CouponForm';
import { FormikHelpers } from 'formik';
import { isActiveDiscount } from '../../data/enum';
import { useProgress } from '../../components/hooks/useProgress';
import { toast } from 'react-toastify';

export function useCoupon() {
  // When loading a coupon
  const [loading, setLoading] = useState(false);
  const [couponFound, setCouponFound] = useState<StripeCoupon>();

  // Activating/Cancelling coupon
  const [changing, setChanging] = useState(false);
  // Refresh progress.
  const { startProgress, stopProgress } = useProgress();

  const getCoupon = (id: string, config: ReqConfig) => {
    setLoading(true);

    loadStripeCoupon(id, config)
      .then(c => {
        setLoading(false);
        setCouponFound(c);
      })
      .catch((err: ResponseError) => {
        setLoading(false);
        toast.error(err.message);
      });
  };

  const refreshCoupon = (id: string, config: ReqConfig): Promise<StripeCoupon | undefined> => {
    config.refresh = true;

    startProgress();

    return loadStripeCoupon(id, config)
      .then(c => {
        stopProgress();
        toast.info('Refreshed!');
        return c;
      })
      .catch((err: ResponseError) => {
        stopProgress();
        toast.error(err.message);
        return undefined;
      });
  }

  /**
   * Attach a coupon to current price.
   */
  const attachCoupon = (
    price: StripePrice,
    config: ReqConfig,
    onSaved: (c: StripeCoupon) => void,
  ) => {
    return (
      values: CouponFormVal,
      helpers: FormikHelpers<CouponFormVal>
    ) => {
      helpers.setSubmitting(true);

      updateStripeCoupon(
        values.couponId,
        buildCouponParams(price.id, values),
        config,
      )
        .then((c) => {
          helpers.setSubmitting(false);
          setCouponFound(c);
          onSaved(c);
          toast.info('Saved!');
        })
        .catch((e: ResponseError) => {
          helpers.setSubmitting(false);
          if (e.invalid) {
            helpers.setErrors(e.toFormFields)
          } else {
            toast.info(e.message);
          }
        });
    }
  };

  /**
   * Change a coupons' effective start and end time.
   */
  const updateCoupon = (
    coupon: StripeCoupon, // Coupon before update.
    config: ReqConfig,
    onSaved: (c: StripeCoupon) => void,
  ) => {
    return (
      values: CouponFormVal,
      helpers: FormikHelpers<CouponFormVal>
    ) => {
      if (!coupon.priceId) {
        toast.error('Coupon to be edited must be already attached to a price!');
        return;
      }

      helpers.setSubmitting(true);

      updateStripeCoupon(
        values.couponId,
        buildCouponParams(coupon.priceId, values),
        config,
      )
        .then((c) => {
          helpers.setSubmitting(false);
          onSaved(c);
          toast.info('Saved!');
        })
        .catch((e: ResponseError) => {
          helpers.setSubmitting(false);
          if (e.invalid) {
            helpers.setErrors(e.toFormFields)
          } else {
            toast.error(e.message);
          }
        });
    }
  };

  // Activate or deactivate a coupon
  const changeStatus = (
    coupon: StripeCoupon,
    config: ReqConfig,
    onSaved: (c: StripeCoupon) => void,
  ) => {
    const isActive = isActiveDiscount(coupon.status);

    setChanging(true);

    if (isActive) {
      deleteStripeCoupon(coupon.id, config)
        .then(c => {
          toast.info('Coupon deactivated!');
          setChanging(false);
          onSaved(c)
        })
        .catch((err: ResponseError) => {
          setChanging(false);
          toast.error(err.message);
        });
    } else {
      activateStripeCoupon(coupon.id, config)
        .then(c => {
          toast.info('Coupon activated!');
          setChanging(false);
          onSaved(c);
        })
        .catch((err: ResponseError) => {
          toast.error(err.message);
          setChanging(false);
        });
    }
  };

  const clear = () => {
    setCouponFound(undefined);
  }

  return {
    loading,
    getCoupon,
    couponFound,

    attachCoupon,
    updateCoupon,

    changing,
    changeStatus,

    refreshCoupon,

    clear,
  }
}
