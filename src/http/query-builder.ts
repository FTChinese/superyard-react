import { AxiosRequestConfig } from 'axios';
import { authHeader } from '../data/cms-account';

export class QueryBuilder {

  private query = new URLSearchParams();

  constructor() {}

  setLive(live: boolean = true): QueryBuilder {
    if (live) {
      this.query.set('live', 'true')
    } else {
      this.query.delete('live');
    }

    return this;
  }

  setRefresh(refresh: boolean = true): QueryBuilder {
    if (refresh) {
      this.query.set('refresh', 'true');
    } else {
      this.query.delete('refresh');
    }

    return this;
  }

  build(): URLSearchParams {
    return this.query;
  }

  toRequestConfig(authToken: string): AxiosRequestConfig {
    return {
      headers: authHeader(authToken),
      params: this.query,
    };
  }
}
