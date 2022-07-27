import { PagedList } from '../http/paged-list';

export type ReleaseParams = {
  versionName: string;
  versionCode: number;
  body?: string;
  apkUrl: string;
};

export type Release = ReleaseParams & {
  createdAt?: string;
  updatedAt?: string;
}

export type ReleaseList = PagedList<Release>;
