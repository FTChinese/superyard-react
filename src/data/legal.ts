import { PagedList } from '../http/paged-list';

export type LegalPublishParams = {
  publish: boolean;
};

export type LegalDocParams = {
  title: string;
  summary?: string;
  author: string;
  body: string;
  keyword?: string;
};

export type LegalDoc = LegalDocParams & {
  id: string;
  active: boolean;
  createdUtc?: string;
  updatedUtc?: string;
};

export type LegalTeaser = {
  id: string;
  active: boolean;
  title: string;
  summary?: string;
};

export type LegalList = PagedList<LegalTeaser>;
