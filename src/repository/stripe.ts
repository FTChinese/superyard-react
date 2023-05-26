import { StripePrice, StripeCoupon, CouponParams, StripePriceParams } from '../data/stripe-price';
import { Fetch, UrlBuilder } from '../http/fetch';
import { ReqConfig } from '../http/ReqConfig';
import { endpoint, pathStripeCoupons } from './endpoint';

export function loadStripePrice(
  id: string,
  config: ReqConfig
): Promise<StripePrice> {
  const url = new UrlBuilder(endpoint.stripePrice)
    .appendPath(id)
    .setLive(config.live)
    .setRefresh(config.refresh)
    .toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(config.token)
    .endJson();
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
  const url = new UrlBuilder(endpoint.stripePrice)
    .appendPath(priceId)
    .appendPath('coupons')
    .setLive(config.live)
    .setRefresh(config.refresh)
    .toString();

  return new Fetch()
    .get(url)
    .endJson();
}

export function upsertStripeCoupon(
  id: string,
  body: CouponParams,
  config: ReqConfig
): Promise<StripeCoupon> {
  const url = new UrlBuilder(endpoint.stripePrice)
    .appendPath(id)
    .setLive(config.live)
    .toString();

  return new Fetch()
    .post(url)
    .setBearerAuth(config.token)
    .sendJson(body)
    .endJson();
}

export function activateStripeCoupon(
  id: string,
  config: ReqConfig
): Promise<StripeCoupon> {
  const url = new UrlBuilder(pathStripeCoupons)
    .appendPath(id)
    .appendPath('activate')
    .setLive(config.live)
    .toString();

  return new Fetch()
    .patch(url)
    .setBearerAuth(config.token)
    .endJson();
}

export function deleteStripeCoupon(
  id: string,
  config: ReqConfig
): Promise<StripeCoupon> {
  const url = new UrlBuilder(pathStripeCoupons)
    .appendPath(id)
    .setLive(config.live)
    .toString();

  return new Fetch()
    .setBearerAuth(config.token)
    .delete(url)
    .endJson();
}
