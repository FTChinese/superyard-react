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

export type SandboxPwParams = {
  password: string;
};

export type ReaderBaseAccount = {
  id: string;
  unionId?: string;
  stripeId?: string;
  email: string;
  mobile?: string;
  userName?: string;
  isVerified: boolean;
};

export type Wechat = {
  nickname?: string;
  avatarUrl?: string;
};

export type ReaderAccount = ReaderBaseAccount & {
  loginMethod: LoginMethod;
  wechat: Wechat;
  membership: Membership;
};

export function getCompoundId(a: ReaderAccount): string {
  if (a.id) {
    return a.id;
  }

  if (a.unionId) {
    return a.unionId
  }

  return ''
}

export type ReaderFtcProfile = {
  id: string;
  gender: 'M' | 'F';
  familyName?: string;
  givenName?: string;
  birthday?: string;
  address: ReaderAddress;
};

export type ReaderAddress = {
  id: string;
  country?: string;
  province?: string;
  city?: string;
  district?: string;
  street?: string;
  postcode?: string;
}

export function isTestAccount(a: ReaderBaseAccount): boolean {
  return a.email.endsWith('.test@ftchinese.com');
}

export type SearchResult = {
  id: string | null;
}

