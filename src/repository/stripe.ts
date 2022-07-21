import axios from 'axios';
import { StripePrice, StripeCoupon, CouponParams } from '../data/stripe-price';
import { ReqConfig, buildReqConfig } from '../http/ReqConfig';
import { ResponseError } from '../http/response-error';
import { endpoint } from './endpoint';

export function loadStripePrice(
  id: string,
  config: ReqConfig
): Promise<StripePrice> {
  return axios
    .get(endpoint.stripePriceOf(id), buildReqConfig(config))
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function loadStripeCoupons(
  priceId: string,
  config: ReqConfig
): Promise<StripeCoupon[]> {
  return axios
    .get(`${endpoint.stripePriceOf(priceId)}/coupons`, buildReqConfig(config))
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function updateCoupon(
  id: string,
  body: CouponParams,
  config: ReqConfig
): Promise<StripeCoupon> {
  return axios
    .post<StripeCoupon>(
      endpoint.stripeCouponOf(id),
      body,
      buildReqConfig(config)
    )
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function deleteCoupon(
  id: string,
  config: ReqConfig
): Promise<StripeCoupon> {
  return axios
    .delete<StripeCoupon>(endpoint.stripeCouponOf(id), buildReqConfig(config))
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}
