import axios from 'axios';
import { Release, ReleaseList, ReleaseParams } from '../data/android';
import { authHeader } from '../data/cms-account';
import { PagedNavParams, serializePagingQuery } from '../data/paged-list';
import { URLBuilder } from '../http/url_builder';
import { UpsertArgs } from './args';
import { endpoint } from './endpoint';
import { ResponseError } from './response-error';

export function listReleases(page: PagedNavParams, token: string): Promise<ReleaseList> {
  const url = new URLBuilder(endpoint.androidBase)
    .setSearch(serializePagingQuery(page))
    .toString();

  return axios.get<ReleaseList>(
    url,
    {
      headers: authHeader(token)
    }
  )
  .then(resp => resp.data)
  .catch(error => Promise.reject(ResponseError.newInstance(error)));
}


export function createRelease(args: UpsertArgs<ReleaseParams>): Promise<Release> {
  return axios.post<Release>(
      endpoint.androidBase,
      args.body,
      {
        headers: authHeader(args.token),
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function loadRelease(versionName: string, token: string): Promise<Release> {
  const url = new URLBuilder(endpoint.androidBase)
    .addPath(versionName)
    .toString();

  return axios.get<Release>(
      url,
      {
        headers: authHeader(token)
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function updateRelease(
  versionName: string,
  args: UpsertArgs<ReleaseParams>,
): Promise<Release> {
  const url = new URLBuilder(endpoint.androidBase)
    .addPath(versionName)
    .toString();

  return axios.patch<Release>(
      url,
      args.body,
      {
        headers: authHeader(args.token),
      }
    )
    .then(resp => resp.data)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}

export function deleteRelease(versionName: string, token: string): Promise<boolean> {
  const url = new URLBuilder(endpoint.androidBase)
    .addPath(versionName)
    .toString();

  return axios.delete<boolean>(
      url,
      {
        headers: authHeader(token)
      }
    )
    .then(resp => resp.status === 204)
    .catch(error => Promise.reject(ResponseError.newInstance(error)));
}
