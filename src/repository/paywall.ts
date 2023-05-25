import axios, { AxiosResponse } from 'axios';
import {
  BannerParams,
  Paywall,
  PaywallDoc,
  PaywallPrice,
  Product,
  UpdateProductParams,
  PromoParams,
  NewProductParams,
  AttachIntroParams,
} from '../data/paywall';
import {
  Discount,
  DiscountParams,
  Price,
  NewPriceParams,
  UpdatePriceParams,
} from '../data/ftc-price';
import { endpoint } from './endpoint';
import { buildReqConfig, ReqConfig } from '../http/ReqConfig';
import { ResponseError } from '../http/response-error';
import { Fetch, UrlBuilder } from '../http/fetch';

export function loadPaywall(config: ReqConfig): Promise<Paywall> {
  return axios
    .get<Paywall>(endpoint.paywall, buildReqConfig(config))
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function saveBanner(
  body: BannerParams,
  config: ReqConfig
): Promise<PaywallDoc> {
  return axios
    .post<PaywallDoc, AxiosResponse<PaywallDoc>, BannerParams>(
      endpoint.banner,
      body,
      buildReqConfig(config)
    )
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function savePromo(
  body: PromoParams,
  config: ReqConfig
): Promise<PaywallDoc> {
  return axios
    .post<PaywallDoc, AxiosResponse<PaywallDoc>, BannerParams>(
      endpoint.promo,
      body,
      buildReqConfig(config)
    )
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function dropPromo(config: ReqConfig): Promise<PaywallDoc> {
  return axios
    .delete<PaywallDoc, AxiosResponse<PaywallDoc>, BannerParams>(
      endpoint.promo,
      buildReqConfig(config)
    )
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function createFtcProduct(
  body: NewProductParams,
  config: ReqConfig
): Promise<Product> {
  return axios
    .post<Product, AxiosResponse<Product>, UpdateProductParams>(
      endpoint.product,
      body,
      buildReqConfig(config)
    )
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function listFtcProducts(config: ReqConfig): Promise<Product[]> {
  return axios
    .get<Product[]>(endpoint.product, buildReqConfig(config))
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function loadFtcProduct(id: string, config: ReqConfig): Promise<Product> {
  return axios
    .get<Product>(endpoint.productOf(id), buildReqConfig(config))
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function activateFtcProduct(
  id: string,
  config: ReqConfig
): Promise<Product> {
  return axios
    .post<Product>(endpoint.productOf(id), undefined, buildReqConfig(config))
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function updateFtcProduct(
  id: string,
  body: UpdateProductParams,
  config: ReqConfig
): Promise<Product> {
  return axios
    .patch<Product>(endpoint.productOf(id), body, buildReqConfig(config))
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function attachIntroPrice(
  prodId: string,
  body: AttachIntroParams,
  config: ReqConfig
): Promise<Product> {
  return axios
    .patch<Product>(
      endpoint.introForProductOf(prodId),
      body,
      buildReqConfig(config)
    )
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function dropIntroPrice(
  prodId: string,
  config: ReqConfig
): Promise<Product> {
  return axios
    .delete<Product>(endpoint.introForProductOf(prodId), buildReqConfig(config))
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function listPriceOfProduct(
  prodId: string,
  config: ReqConfig
): Promise<PaywallPrice[]> {
  return axios
    .get<PaywallPrice[]>(
      endpoint.price,
      buildReqConfig(config, new URLSearchParams({ product_id: prodId }))
    )
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
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
  return axios
    .post<Product, AxiosResponse<PaywallPrice>, NewPriceParams>(
      endpoint.price,
      body,
      buildReqConfig(config)
    )
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function updateFtcPrice(
  id: string,
  body: UpdatePriceParams,
  config: ReqConfig
): Promise<PaywallPrice> {
  return axios
    .patch<PaywallPrice>(endpoint.priceOf(id), body, buildReqConfig(config))
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function activateFtcPrice(id: string, config: ReqConfig): Promise<PaywallPrice> {
  return axios
    .post<PaywallPrice>(endpoint.priceOf(id), undefined, buildReqConfig(config))
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function archiveFtcPrice(id: string, config: ReqConfig): Promise<PaywallPrice> {
  return axios
    .delete<PaywallPrice>(endpoint.priceOf(id), buildReqConfig(config))
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function refreshFtcPriceOffers(
  id: string,
  config: ReqConfig
): Promise<PaywallPrice> {
  return axios
    .patch<PaywallPrice>(
      endpoint.offerOfPrice(id),
      undefined,
      buildReqConfig(config)
    )
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function createFtcOffer(
  body: DiscountParams,
  config: ReqConfig
): Promise<Discount> {
  return axios
    .post<Discount>(endpoint.discount, body, buildReqConfig(config))
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function dropFtcOffer(
  id: string,
  config: ReqConfig
): Promise<PaywallPrice> {
  return axios
    .delete<PaywallPrice>(endpoint.discountOf(id), buildReqConfig(config))
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}
