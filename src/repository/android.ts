import { Release, ReleaseList, ReleaseParams } from '../data/android';
import { PagingQuery, serializePagingQuery } from '../http/paged-list';
import { UpsertArgs } from './args';
import { endpoint } from './endpoint';
import { Fetch, UrlBuilder } from '../http/fetch';

export function listReleases(
  page: PagingQuery,
  token: string
): Promise<ReleaseList> {
  const url = new UrlBuilder(endpoint.androidBase)
    .setSearchParams(serializePagingQuery(page))
    .toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(token)
    .endJson();
}

export function createRelease(
  args: UpsertArgs<ReleaseParams>
): Promise<Release> {

  return new Fetch()
    .post(endpoint.androidBase)
    .setBearerAuth(args.token)
    .sendJson(args.body)
    .endJson();
}

export function loadRelease(
  versionName: string,
  token: string
): Promise<Release> {
  const url = new UrlBuilder(endpoint.androidBase)
    .appendPath(versionName)
    .toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(token)
    .endJson();
}

export function updateRelease(
  versionName: string,
  args: UpsertArgs<ReleaseParams>
): Promise<Release> {
  const url = new UrlBuilder(endpoint.androidBase)
    .appendPath(versionName)
    .toString();

  return new Fetch()
    .patch(url)
    .setBearerAuth(args.token)
    .sendJson(args.body)
    .endJson();
}

export function deleteRelease(
  versionName: string,
  token: string
): Promise<boolean> {
  const url = new UrlBuilder(endpoint.androidBase)
    .appendPath(versionName)
    .toString();

  return new Fetch()
    .delete(url)
    .setBearerAuth(token)
    .endNoContent();
}
