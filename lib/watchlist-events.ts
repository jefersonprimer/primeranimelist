export const WATCHLIST_UPDATED_EVENT = "watchlist:updated";

export interface WatchlistUpdatedDetail {
  malId: number;
  inWatchlist: boolean;
}

export function dispatchWatchlistUpdated(detail: WatchlistUpdatedDetail) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<WatchlistUpdatedDetail>(WATCHLIST_UPDATED_EVENT, {
      detail,
    }),
  );
}
