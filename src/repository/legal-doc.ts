import axios from 'axios';
import { authHeader } from '../data/cms-account';
import { LegalDoc, LegalDocParams, LegalList } from '../data/legal';
import { endpoint } from './endpoint';
import { ResponseError } from './response-error';
import { URLBuilder } from '../http/url_builder';
import { PagedNavParams, serializePagingQuery } from '../data/paged-list';

export function listLegalDoc(page: PagedNavParams, token: string): Promise<LegalList> {
  const url = new URLBuilder(endpoint.legalBase)
    .setSearch(
      serializePagingQuery(page)
    )
    .toString();

  return axios.get<LegalList>(
      url,
      {
        headers: authHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function createLegalDoc(body: LegalDocParams, token: string): Promise<LegalDoc> {
  return axios.post<LegalDoc>(
      endpoint.legalBase,
      body,
      {
        headers: authHeader(token),
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function loadLegalDoc(id: string, token: string): Promise<LegalDoc> {
  const url = new URLBuilder(endpoint.legalBase)
    .addPath(id)
    .toString();

  return axios.get<LegalDoc>(
      url,
      {
        headers: authHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function updateLegalDoc(
  id: string,
  body: LegalDocParams,
  token: string
): Promise<LegalDoc> {
  const url = new URLBuilder(endpoint.legalBase)
    .addPath(id)
    .toString();

  return axios.patch<LegalDoc>(
      endpoint.legalBase,
      body,
      {
        headers: authHeader(token),
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}
