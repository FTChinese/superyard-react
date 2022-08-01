import { UpsertMemberParams, Membership, MemberFormVal } from '../data/membership';
import { ReaderAccount, ReaderFtcProfile, SandboxPwParams, SearchResult, SignUpParams, TestAccount, TestUserList } from '../data/reader-account';
import { Fetch, UrlBuilder } from '../http/fetch';
import { PagingQuery } from '../http/paged-list';
import { pathFtcReader, pathMemberBase, pathSandboxBase, pathSearchReader } from './endpoint';

export function searchReader(
  token: string,
  keyword: string,
): Promise<SearchResult> {
  const url = new UrlBuilder(pathSearchReader)
    .appendQuery('q', keyword)
    .toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(token)
    .endJson();
}

export function createSandboxUser(
  token: string,
  params: SignUpParams
): Promise<TestAccount> {
  return new Fetch()
    .post(pathSandboxBase)
    .setBearerAuth(token)
    .sendJson(params)
    .endJson<TestAccount>();
}

export function listSandboxUsers(
  token: string,
  paging: PagingQuery
): Promise<TestUserList> {
  const url = new UrlBuilder(pathSandboxBase)
    .setPage(paging)
    .toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(token)
    .endJson<TestUserList>();
}

export function loadSandboxUser(
  token: string,
  id: string,
): Promise<TestAccount> {
  const url = new UrlBuilder(pathSandboxBase)
    .appendPath(id)
    .toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(token)
    .endJson<TestAccount>();
}

export function deleteSandboxUser(
  token: string,
  id: string,
): Promise<boolean> {
  const url = new UrlBuilder(pathSandboxBase)
    .appendPath(id)
    .toString();

  return new Fetch()
    .delete(url)
    .setBearerAuth(token)
    .end()
    .then(resp => {
      return resp.status === 204;
    })
}

export function changeSandboxPassword(
  token: string,
  id: string,
  params: SandboxPwParams,
): Promise<TestAccount> {
  const url = new UrlBuilder(pathSandboxBase)
    .appendPath(id)
    .appendPath('password')
    .toString();

  return new Fetch()
    .patch(url)
    .setBearerAuth(token)
    .sendJson(params)
    .endJson<TestAccount>();
}

export function loadFtcAccount(
  token: string, // CMS user's jwt token, not this ftc user.
  ftcId: string,
): Promise<ReaderAccount> {
  const url = new UrlBuilder(pathFtcReader)
    .appendPath(ftcId)
    .toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(token)
    .endJson<ReaderAccount>();
}

export function loadFtcProfile(
  token: string,
  ftcId: string,
): Promise<ReaderFtcProfile> {
  const url = new UrlBuilder(pathFtcReader)
    .appendPath(ftcId)
    .appendPath('profile')
    .toString();

  return new Fetch()
    .get(url)
    .setBearerAuth(token)
    .endJson<ReaderFtcProfile>();
}

export function upsertOneOffMember(
  token: string,
  params: UpsertMemberParams,
): Promise<Membership> {
  return new Fetch()
    .post(pathMemberBase)
    .setBearerAuth(token)
    .sendJson(params)
    .endJson<Membership>();
}

export function deleteMember(
  token: string,
  compoundId: string,
): Promise<boolean> {
  const url = new UrlBuilder(pathMemberBase)
    .appendPath(compoundId)
    .toString();

  return new Fetch()
    .delete(url)
    .setBearerAuth(token)
    .end()
    .then(resp => {
      return resp.status === 204;
    });
}
