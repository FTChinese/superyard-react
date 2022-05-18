export type PageCount = {
  total: number;
  page: number;
  limit: number;
}
export type PagedList<T> = PageCount & {
  data: T[];
}

export type PagedNavParams = {
  prevNext: number;
  itemsPerPage: number;
}

export function serializePagingQuery(params: PagedNavParams): URLSearchParams {
  const search = new URLSearchParams();
  search.set('page', params.prevNext.toFixed())
  search.set('per_page', params.itemsPerPage.toFixed());

  return search;
}

export function parsePagingQuery(query: URLSearchParams): PagedNavParams {
  const page = query.get('page');
  const perPage = query.get('per_page');

  return {
    prevNext: page ? Number.parseInt(page) : 1,
    itemsPerPage: perPage ? Number.parseInt(perPage) : 20,
  }
}
