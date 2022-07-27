import axios from 'axios';
import { authHeader } from '../data/cms-account';
import {
  LegalDoc,
  LegalDocParams,
  LegalList,
  LegalPublishParams,
} from '../data/legal';
import { endpoint } from './endpoint';
import { ResponseError } from '../http/response-error';
import { URLBuilder } from '../http/url_builder';
import { PagingQuery, serializePagingQuery } from '../http/paged-list';
import { UpsertArgs } from './args';

export function listLegalDoc(
  page: PagingQuery,
  token: string
): Promise<LegalList> {
  const url = new URLBuilder(endpoint.legalBase)
    .setSearch(serializePagingQuery(page))
    .toString();

  return axios
    .get<LegalList>(url, {
      headers: authHeader(token),
    })
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function createLegalDoc(
  args: UpsertArgs<LegalDocParams>
): Promise<LegalDoc> {
  return axios
    .post<LegalDoc>(endpoint.legalBase, args.body, {
      headers: authHeader(args.token),
    })
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function loadLegalDoc(id: string, token: string): Promise<LegalDoc> {
  const url = new URLBuilder(endpoint.legalBase).addPath(id).toString();

  return axios
    .get<LegalDoc>(url, {
      headers: authHeader(token),
    })
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function updateLegalDoc(
  id: string,
  args: UpsertArgs<LegalDocParams>
): Promise<LegalDoc> {
  const url = new URLBuilder(endpoint.legalBase).addPath(id).toString();

  return axios
    .patch<LegalDoc>(url, args.body, {
      headers: authHeader(args.token),
    })
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function refreshLegalPage(id: string, token: string): Promise<boolean> {
  const url = new URLBuilder(endpoint.legalBase)
    .addPath(id)
    .addPath('refresh')
    .toString();

  return axios
    .get<boolean>(url, {
      headers: authHeader(token),
    })
    .then((resp) => resp.status === 204)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}

export function publishLegalDoc(
  id: string,
  args: UpsertArgs<LegalPublishParams>
): Promise<LegalDoc> {
  const url = new URLBuilder(endpoint.legalBase)
    .addPath(id)
    .addPath('publish')
    .toString();

  return axios
    .post<LegalDoc>(url, args.body, {
      headers: authHeader(args.token),
    })
    .then((resp) => resp.data)
    .catch((error) => Promise.reject(ResponseError.newInstance(error)));
}
