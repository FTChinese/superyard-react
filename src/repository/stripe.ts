import axios from 'axios';
import { StripePrice, StripeCoupon, CouponParams, StripePriceParams } from '../data/stripe-price';
import { Fetch, UrlBuilder } from '../http/fetch';
import { ReqConfig, buildReqConfig } from '../http/ReqConfig';
import { ResponseError } from '../http/response-error';
import { endpoint, pathStripeCoupons } from './endpoint';

export function loadStripePrice(
  id: string,
  config: ReqConfig
): Promise<StripePrice> {
  return axios
    .get(endpoint.stripePriceOf(id), buildReqConfig(config))
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

/**
 * Update a Stripe price's metadata.
 * @param id - price id
 * @param body - request body
 * @param config - query and auth parameters.
 * @returns
 */
export function updateStripePriceMeta(
  id: string,
  body: StripePriceParams,
  config: ReqConfig
): Promise<StripePrice> {
  const url = new UrlBuilder(endpoint.stripePrice)
    .appendPath(id)
    .setLive(config.live)
    .toString();

  return new Fetch()
    .post(url)
    .setBearerAuth(config.token)
    .sendJson(body)
    .endJson<StripePrice>();
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

export function upsertStripeCoupon(
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

export function activateStripeCoupon(
  id: string,
  config: ReqConfig
): Promise<StripeCoupon> {
  const url = new UrlBuilder(pathStripeCoupons)
    .appendPath(id)
    .appendPath('activate')
    .toString();

  return axios
    .patch<StripeCoupon>(
      url,
      undefined,
      buildReqConfig(config)
    )
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function deleteStripeCoupon(
  id: string,
  config: ReqConfig
): Promise<StripeCoupon> {
  return axios
    .delete<StripeCoupon>(endpoint.stripeCouponOf(id), buildReqConfig(config))
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}
