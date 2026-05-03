interface BadgeWatchlistIconProps {
  size: number;
}

export function BadgeWatchlistIcon({ size }: BadgeWatchlistIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      data-t="watchlist-filled-small-svg"
      aria-hidden="true"
      role="img"
      width={size}
      height={size}
      fill="currentColor"
    >
      <path d="M4 2h8a1 1 0 0 1 1 1v9.92a1 1 0 0 1-1.625.78L8 11l-3.375 2.7A1 1 0 0 1 3 12.92V3a1 1 0 0 1 1-1z"></path>
    </svg>
  );
}
