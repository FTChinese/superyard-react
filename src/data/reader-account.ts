import { PagedList } from '../http/paged-list';
import { LoginMethod } from './enum';
import { Membership } from './membership';

export const testAccountSuffix = '.test@ftchinese.com';

export type SignUpParams = {
  email: string;
  password: string;
};

export type TestAccount = {
  id: string;
  email: string;
  password: string;
  createdBy: string;
};

export type TestUserList = PagedList<TestAccount>;

export type SandboxPwReq = {
  password: string;
};

export type Wechat = {
  nickname: string | null;
  avatarUrl: string | null;
}
export type ReaderBaseAccount = {
  id: string;
  unionId: string | null;
  stripeId: string | null;
  email: string;
  mobile: string | null;
  userName: string | null;
  avatarUrl: string | null;
  isVerified: boolean;
  campaignCode: string | null;
}

export function isMobileDerivedEmail(email: string): boolean {
  return email.endsWith('@ftchinese.user')
}

export function normalizeEmail(email: string): string {
  if (isMobileDerivedEmail(email)) {
    return '';
  }

  return email;
}

export function isTestAccount(a: ReaderBaseAccount): boolean {
  return a.email.endsWith('.test@ftchinese.com');
}

export type ReaderAccount = ReaderBaseAccount & {
  loginMethod: LoginMethod;
  wechat: Wechat;
  membership: Membership;
}

export function isAccountWxOnly(a: ReaderAccount): boolean {
  return (!a.id) && (!!a.unionId);
}

export function isAccountFtcOnly(a: ReaderAccount): boolean {
  return (!!a.id) && (!a.unionId);
}

export function isAccountLinked(a: ReaderAccount): boolean {
  return !!(a.id && a.unionId);
}

export interface ReaderPassport extends ReaderAccount {
  expiresAt: number;
  token: string;
}

export function authHeader(p: ReaderPassport): { [key: string]: string } {
  return {
    'Authorization': `Bearer ${p.token}`,
  };
}



export type SearchResult = {
  id: string | null;
}

