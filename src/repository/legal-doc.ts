import axios from 'axios';
import { authHeader } from '../data/cms-account';
import { LegalDoc, LegalDocParams, LegalList } from '../data/legal';
import { endpoint } from './endpoint';
import { ResponseError } from './response-error';
import { urlBuilder } from './url_builder';

export function listLegalDoc(token: string): Promise<LegalList> {
  return axios.get<LegalList>(
      endpoint.legalBase,
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
  const url = urlBuilder(endpoint.legalBase)
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

export function updateLegalDoc(id: string, body: LegalDocParams, token: string): Promise<LegalDoc> {
  const url = urlBuilder(endpoint.legalBase)
    .addPath(id)
    .toString();

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
