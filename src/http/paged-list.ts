export type PageCount = {
  total: number;
  page: number;
  limit: number;
}
export type PagedList<T> = PageCount & {
  data: T[];
}

export type PagingQuery = {
  page: number;
  itemsCount: number;
}

export function getPagingQuery(query: URLSearchParams): PagingQuery {
  const page = query.get('page');
  const perPage = query.get('per_page');

  return {
    page: page ? Number.parseInt(page) : 1,
    itemsCount: perPage ? Number.parseInt(perPage) : 20,
  }
}

/**
 * @deprecated
 */
export function serializePagingQuery(params: PagingQuery): URLSearchParams {
  const search = new URLSearchParams();
  search.set('page', params.page.toFixed())
  search.set('per_page', params.itemsCount.toFixed());

  return search;
}


