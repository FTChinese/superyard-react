import { PagedList } from './paged-list';

export type LegalDocParams = {
  title: string;
  summary?: string;
  author: string;
  body: string;
  keyword?: string;
};

export type LegalDoc = LegalDocParams & {
  id: string;
  createdUtc?: string;
  updatedUtc?: string;
};

export type LegalTeaser = {
  id: string;
  title: string;
  summary?: string;
};

export type LegalList = PagedList<LegalTeaser>;
