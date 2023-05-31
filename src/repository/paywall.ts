import {
  BannerParams,
  Paywall,
  PaywallDoc,
  PaywallPrice,
  Product,
  UpdateProductParams,
  PromoParams,
  NewProductParams,
} from '../data/paywall';
import {
  Discount,
  DiscountParams,
  NewPriceParams,
  UpdatePriceParams,
} from '../data/ftc-price';
import { endpoint } from './endpoint';
import { ReqConfig } from '../http/ReqConfig';
import { Fetch, UrlBuilder } from '../http/fetch';

export function loadPaywall(config: ReqConfig): Promise<Paywall> {
  const url = new UrlBuilder(endpoint.paywall)
    .setReqConfig(config)
    .toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(config.token)
    .endJson();
}

export function saveBanner(
  body: BannerParams,
  config: ReqConfig
): Promise<PaywallDoc> {

  const url = new UrlBuilder(endpoint.banner)
    .setReqConfig(config)
    .toString();

  return new Fetch()
    .post(url)
    .sendJson(body)
    .setBearerAuth(config.token)
    .endJson();
}

export function savePromo(
  body: PromoParams,
  config: ReqConfig
): Promise<PaywallDoc> {
  const url = new UrlBuilder(endpoint.promo).setReqConfig(config).toString();

  return new Fetch()
    .post(url)
    .sendJson(body)
    .setBearerAuth(config.token)
    .endJson();
}

export function dropPromo(config: ReqConfig): Promise<PaywallDoc> {
  const url = new UrlBuilder(endpoint.promo).setReqConfig(config).toString();

  return new Fetch()
    .delete(url)
    .setBearerAuth(config.token)
    .endJson();
}

export function createFtcProduct(
  body: NewProductParams,
  config: ReqConfig
): Promise<Product> {
  const url = new UrlBuilder(endpoint.product).setReqConfig(config).toString();

  return new Fetch()
    .post(url)
    .setBearerAuth(config.token)
    .sendJson(body)
    .endJson();
}

export function listFtcProducts(config: ReqConfig): Promise<Product[]> {
  const url = new UrlBuilder(endpoint.product).setReqConfig(config).toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(config.token)
    .endJson();
}

export function loadFtcProduct(id: string, config: ReqConfig): Promise<Product> {
  const url = new UrlBuilder(endpoint.product)
    .appendPath(id)
    .setReqConfig(config)
    .toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(config.token)
    .endJson();
}

export function activateFtcProduct(
  id: string,
  config: ReqConfig
): Promise<Product> {
  const url = new UrlBuilder(endpoint.product).appendPath(id).setReqConfig(config).toString();

  return new Fetch()
    .post(url)
    .setBearerAuth(config.token)
    .endJson();
}

export function updateFtcProduct(
  id: string,
  body: UpdateProductParams,
  config: ReqConfig
): Promise<Product> {
  const url = new UrlBuilder(endpoint.product).appendPath(id).setReqConfig(config).toString();

  return new Fetch()
    .post(url)
    .setBearerAuth(config.token)
    .sendJson(body)
    .endJson();
}

export function listPriceOfProduct(
  prodId: string,
  config: ReqConfig
): Promise<PaywallPrice[]> {
  const url = new UrlBuilder(endpoint.price)
    .appendQuery('product_id', prodId)
    .setReqConfig(config)
    .toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(config.token)
    .endJson();
}

export function loadFtcPrice(id: string, config: ReqConfig): Promise<PaywallPrice> {
  const url = new UrlBuilder(endpoint.price)
    .appendPath(id)
    .setLive(config.live)
    .toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(config.token)
    .endJson<PaywallPrice>();
}

export function createFtcPrice(
  body: NewPriceParams,
  config: ReqConfig
): Promise<PaywallPrice> {

  const url = new UrlBuilder(endpoint.price).setReqConfig(config).toString();

  return new Fetch()
    .post(url)
    .setBearerAuth(config.token)
    .sendJson(body)
    .endJson();
}

export function updateFtcPrice(
  id: string,
  body: UpdatePriceParams,
  config: ReqConfig
): Promise<PaywallPrice> {

  const url = new UrlBuilder(endpoint.price)
    .appendPath(id)
    .setReqConfig(config)
    .toString();

  return new Fetch()
    .patch(url)
    .setBearerAuth(config.token)
    .sendJson(body)
    .endJson();
}

export function activateFtcPrice(id: string, config: ReqConfig): Promise<PaywallPrice> {
  const url = new UrlBuilder(endpoint.price)
    .appendPath(id)
    .setReqConfig(config)
    .toString();

  return new Fetch()
    .post(url)
    .setBearerAuth(config.token)
    .endJson();
}

export function archiveFtcPrice(id: string, config: ReqConfig): Promise<PaywallPrice> {

  const url = new UrlBuilder(endpoint.price)
    .appendPath(id)
    .setReqConfig(config)
    .toString();

  return new Fetch()
    .delete(url)
    .setBearerAuth(config.token)
    .endJson();
}

export function refreshFtcPriceOffers(
  id: string,
  config: ReqConfig
): Promise<PaywallPrice> {
  const url = new UrlBuilder(endpoint.price)
    .appendPath(id)
    .appendPath('discounts')
    .setReqConfig(config)
    .toString();

  return new Fetch()
    .patch(url)
    .setBearerAuth(config.token)
    .endJson();
}

export function createFtcOffer(
  body: DiscountParams,
  config: ReqConfig
): Promise<Discount> {
  const url = new UrlBuilder(endpoint.discount)
    .setReqConfig(config)
    .toString();

  return new Fetch()
    .post(url)
    .setBearerAuth(config.token)
    .sendJson(body)
    .endJson();
}

export function dropFtcOffer(
  id: string,
  config: ReqConfig
): Promise<PaywallPrice> {

  const url = new UrlBuilder(endpoint.discount)
    .appendPath(id)
    .setReqConfig(config)
    .toString();

  return new Fetch()
    .delete(url)
    .setBearerAuth(config.token)
    .endJson();
}
