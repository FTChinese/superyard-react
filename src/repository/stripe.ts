import { StripePrice, StripeCoupon, CouponParams, StripePriceParams, StripePriceList } from '../data/stripe-price';
import { Fetch, UrlBuilder } from '../http/fetch';
import { PagingQuery } from '../http/paged-list';
import { ReqConfig } from '../http/ReqConfig';
import { endpoint, pathStripeCoupons } from './endpoint';


export function listStripePrices(config: ReqConfig, paging: PagingQuery): Promise<StripePriceList> {
  const url = new UrlBuilder(endpoint.stripePrice)
    .setReqConfig(config)
    .setPage(paging)
    .toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(config.token)
    .endJson();
}

/**
 * @param config - live, refresh, token fields are required. Pass `refresh: true` to force refreshing.
 */
export function loadStripePrice(
  id: string,
  config: ReqConfig
): Promise<StripePrice> {
  const url = new UrlBuilder(endpoint.stripePrice)
    .appendPath(id)
    .setReqConfig(config)
    .toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(config.token)
    .endJson();
}

/**
 * @todo - create stripe price directly.
 */
export function createStripePrice() {

}

/**
 * Update a Stripe price's metadata.
 * @param id - price id
 * @param body - request body
 * @param config - query and auth parameters.
 * @returns
 */
export function updateStripePrice(
  id: string,
  body: StripePriceParams,
  config: ReqConfig
): Promise<StripePrice> {
  const url = new UrlBuilder(endpoint.stripePrice)
    .appendPath(id)
    .setLive(config.live)
    .toString();

  return new Fetch()
    .patch(url)
    .setBearerAuth(config.token)
    .sendJson(body)
    .endJson<StripePrice>();
}

/**
 * @description - activate or deactivate a price
 * depending on its current onPaywall field.
 * @param p - the original price
 * @param config - {live: boolean}
 * @returns
 */
export function activateStripePrice(
  p: StripePrice,
  config: ReqConfig
): Promise<StripePrice> {
  const url = new UrlBuilder(endpoint.stripePrice)
    .appendPath(p.id)
    .appendPath(p.onPaywall ? 'deactivate' : 'activate')
    .setLive(config.live)
    .toString();

  return new Fetch()
    .patch(url)
    .setBearerAuth(config.token)
    .endJson();
}

/**
 * Fetch a list of coupons attached a price.
 */
export function listStripeCoupons(
  priceId: string,
  config: ReqConfig
): Promise<StripeCoupon[]> {
  const url = new UrlBuilder(endpoint.stripePrice)
    .appendPath(priceId)
    .appendPath('coupons')
    .setReqConfig(config)
    .toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(config.token)
    .endJson();
}

/**
 * Load of refresh a stripe coupon.
 */
export function loadStripeCoupon(
  id: string,
  config: ReqConfig, // Pass `refresh: true` to force refresh
): Promise<StripeCoupon> {
  const url = new UrlBuilder(endpoint.stripeCoupons)
    .appendPath(id)
    .setReqConfig(config)
    .toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(config.token)
    .endJson()
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

/**
 * Change a coupon to `active` state.
 */
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

/**
 * Change a coupon to `cancelled` state.
 */
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
