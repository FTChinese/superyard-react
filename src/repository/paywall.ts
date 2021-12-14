import axios, { AxiosResponse } from 'axios';
import { BannerParams, Paywall, PaywallDoc, PaywallPrice, Product, UpdateProductParams, PromoParams, NewProductParams, RebuiltResult, StripeRawPrice, AttachIntroParams } from '../data/paywall';
import { Discount, DiscountParams, Price, NewPriceParams, UpdatePriceParams } from '../data/price';
import { endpoint } from './endpoint';
import { buildReqConfig, ReqConfig } from './ReqConfig';
import { ResponseError } from './response-error';

export function loadPaywall(config: ReqConfig): Promise<Paywall> {
  return axios.get<Paywall>(endpoint.paywall, buildReqConfig(config))
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function rebuildPaywall(config: ReqConfig): Promise<RebuiltResult> {
  return axios.get<RebuiltResult>(endpoint.refreshPaywall, buildReqConfig(config))
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function saveBanner(body: BannerParams, config: ReqConfig): Promise<PaywallDoc> {
  return axios.post<PaywallDoc, AxiosResponse<PaywallDoc>, BannerParams>(
      endpoint.banner,
      body,
      buildReqConfig(config)
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function savePromo(body: PromoParams, config: ReqConfig): Promise<PaywallDoc> {
  return axios.post<PaywallDoc, AxiosResponse<PaywallDoc>, BannerParams>(
      endpoint.promo,
      body,
      buildReqConfig(config)
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function dropPromo(config: ReqConfig): Promise<PaywallDoc> {
  return axios.delete<PaywallDoc, AxiosResponse<PaywallDoc>, BannerParams>(
      endpoint.promo,
      buildReqConfig(config)
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function createProduct(body: NewProductParams, config: ReqConfig): Promise<Product> {
  return axios.post<Product, AxiosResponse<Product>, UpdateProductParams>(
      endpoint.product,
      body,
      buildReqConfig(config)
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function listProduct(config: ReqConfig): Promise<Product[]> {
  return axios.get<Product[]>(
      endpoint.product,
      buildReqConfig(config),
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function loadProduct(id: string, config: ReqConfig): Promise<Product> {
  return axios.get<Product>(
      endpoint.productOf(id),
      buildReqConfig(config),
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function activateProduct(id: string, config: ReqConfig): Promise<Product> {
  return axios.post<Product>(
      endpoint.productOf(id),
      undefined,
      buildReqConfig(config),
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function updateProduct(id: string, body: UpdateProductParams, config: ReqConfig): Promise<Product> {
  return axios.patch<Product>(
      endpoint.productOf(id),
      body,
      buildReqConfig(config),
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function attachIntroPrice(prodId: string, body: AttachIntroParams, config: ReqConfig): Promise<Product> {
  return axios.patch<Product>(
      endpoint.introForProductOf(prodId),
      body,
      buildReqConfig(config),
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function dropIntroPrice(prodId: string, config: ReqConfig): Promise<Product> {
  return axios.delete<Product>(
      endpoint.introForProductOf(prodId),
      buildReqConfig(config),
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function createPrice(body: NewPriceParams, config: ReqConfig): Promise<Price> {
  return axios.post<Product, AxiosResponse<Price>, NewPriceParams>(
      endpoint.price,
      body,
      buildReqConfig(config)
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function listPriceOfProduct(prodId: string, config: ReqConfig): Promise<PaywallPrice[]> {
  return axios.get<PaywallPrice[]>(
      endpoint.price,
      buildReqConfig(config, new URLSearchParams({'product_id': prodId})),
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function activatePrice(id: string, config: ReqConfig): Promise<PaywallPrice> {
  return axios.post<PaywallPrice>(
    endpoint.priceOf(id),
    undefined,
    buildReqConfig(config),
  )
  .then(resp => resp.data)
  .catch(error => Promise.reject(ResponseError.newInstance(error)));
}


export function updatePrice(id: string, body: UpdatePriceParams, config: ReqConfig): Promise<PaywallPrice> {
  return axios.patch<PaywallPrice>(
    endpoint.priceOf(id),
    body,
    buildReqConfig(config),
  )
  .then(resp => resp.data)
  .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function archivePrice(id: string, config: ReqConfig): Promise<PaywallPrice> {
  return axios.delete<PaywallPrice>(
      endpoint.priceOf(id),
      buildReqConfig(config)
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function refreshPriceOffers(id: string, config: ReqConfig): Promise<PaywallPrice> {
  return axios.patch<PaywallPrice>(
      endpoint.offerOfPrice(id),
      undefined,
      buildReqConfig(config),
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function createOffer(body: DiscountParams, config: ReqConfig): Promise<Discount> {
  return axios.post<Discount>(
      endpoint.discount,
      body,
      buildReqConfig(config),
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function dropOffer(id: string, config: ReqConfig): Promise<PaywallPrice> {
  return axios.delete<PaywallPrice>(
      endpoint.discountOf(id),
      buildReqConfig(config),
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}


export function loadStripePrice(id: string, config: ReqConfig): Promise<StripeRawPrice> {
  return axios.get(endpoint.stripePriceOf(id), buildReqConfig(config))
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}
