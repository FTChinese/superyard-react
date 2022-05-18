import { AxiosRequestConfig } from 'axios';
import { authHeader } from '../data/cms-account';

export type ReqConfig  = {
  live: boolean; // Live mode or sandbox mode
  token: string; // Json web token set in header.
  refresh?: boolean
}

export function buildReqConfig(c: ReqConfig, params: URLSearchParams = new URLSearchParams()): AxiosRequestConfig {
  params.set('live', `${c.live}`);

  if (c.refresh) {
    params.set('refresh', `${c.refresh}`);
  }

  return {
    headers: authHeader(c.token),
    params: params,
  };
}
