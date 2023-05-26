import { endpoint } from './endpoint';
import { CMSCredentials, CMSPassport } from '../data/cms-account';
import {
  PwResetLetterReq,
  PasswordResetVerified,
  PasswordResetReqParams,
} from '../data/password-reset';
import { Fetch, UrlBuilder } from '../http/fetch';

export function login(c: CMSCredentials): Promise<CMSPassport> {
  return new Fetch()
    .post(endpoint.login)
    .sendJson(c)
    .endJson<CMSPassport>()
}

export function requestPasswordReset(req: PwResetLetterReq): Promise<boolean> {
  return new Fetch()
    .post(endpoint.passResetLetter)
    .sendJson(req)
    .endNoContent();
}

export function verifyPwToken(token: string): Promise<PasswordResetVerified> {
  const url = new UrlBuilder(endpoint.passResetToken)
    .appendPath(token)
    .toString();

  return new Fetch()
    .get(url)
    .endJson();
}

export function resetPassword(v: PasswordResetReqParams): Promise<boolean> {
  return new Fetch()
    .post(endpoint.resetPassword)
    .endNoContent();
}
