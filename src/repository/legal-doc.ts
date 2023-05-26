import {
  LegalDoc,
  LegalDocParams,
  LegalList,
  LegalPublishParams,
} from '../data/legal';
import { endpoint } from './endpoint';
import { PagingQuery, serializePagingQuery } from '../http/paged-list';
import { UpsertArgs } from './args';
import { Fetch, UrlBuilder } from '../http/fetch';

export function listLegalDoc(
  page: PagingQuery,
  token: string
): Promise<LegalList> {
  const url = new UrlBuilder(endpoint.legalBase)
    .setSearchParams(serializePagingQuery(page))
    .toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(token)
    .endJson();
}

export function createLegalDoc(
  args: UpsertArgs<LegalDocParams>
): Promise<LegalDoc> {
  return new Fetch()
    .post(endpoint.legalBase)
    .setBearerAuth(args.token)
    .sendJson(args.body)
    .endJson();
}

export function loadLegalDoc(id: string, token: string): Promise<LegalDoc> {
  const url = new UrlBuilder(endpoint.legalBase).appendPath(id).toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(token)
    .endJson();
}

export function updateLegalDoc(
  id: string,
  args: UpsertArgs<LegalDocParams>
): Promise<LegalDoc> {
  const url = new UrlBuilder(endpoint.legalBase).appendPath(id).toString();

  return new Fetch()
    .patch(url)
    .setBearerAuth(args.token)
    .sendJson(args.body)
    .endJson();
}

export function refreshLegalPage(id: string, token: string): Promise<boolean> {
  const url = new UrlBuilder(endpoint.legalBase)
    .appendPath(id)
    .appendPath('refresh')
    .toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(token)
    .endNoContent();
}

export function publishLegalDoc(
  id: string,
  args: UpsertArgs<LegalPublishParams>
): Promise<LegalDoc> {
  const url = new UrlBuilder(endpoint.legalBase)
    .appendPath(id)
    .appendPath('publish')
    .toString();

  return new Fetch()
    .post(url)
    .setBearerAuth(args.token)
    .sendJson(args.body)
    .endJson();
}
