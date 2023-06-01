export type ReqConfig  = {
  live: boolean; // Live mode or sandbox mode
  token: string; // Json web token set in header.
  refresh?: boolean // Deprecated
}

export type ReqRefresh = ReqConfig & {
  refresh: boolean;
}
