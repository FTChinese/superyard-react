import { useState } from 'react';
import { ReqConfig } from '../../http/ReqConfig';
import { loadStripeCoupon } from '../../repository/stripe';
import { StripeCoupon } from '../../data/stripe-price';
import { ResponseError } from '../../http/response-error';
import { Result } from '../../http/result';

export function useCouon() {
  // When loading a coupon
  const [searching, setSearching] = useState(false);
  const [coupon, setCoupon] = useState<StripeCoupon>();

  const getCoupon = (id: string, config: ReqConfig): Promise<Result> => {
    setSearching(true);

    return loadStripeCoupon(id, config)
      .then(c => {
        setSearching(false);
        setCoupon(c);
        return Result.ok();
      })
      .catch((err: ResponseError) => {
        setSearching(false);
        return Result.error(err.message);
      });
  };

  const createCoupon = () => {

  };

  const updateCoupon = () => {

  };

  return {
    searching,
    getCoupon,
    coupon,
  }
}
