interface BookmarkIconProps {
  size: number;
}

export function BookmarkIcon({ size }: BookmarkIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      data-t="watchlist-svg"
      aria-hidden="true"
      role="img"
      width={size}
      height={size}
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.0001 20.5858C19.0001 21.4767 17.9229 21.9229 17.293 21.2929L12.0001 16L6.7071 21.2929C6.07714 21.9229 5 21.4767 5 20.5858L5.00006 3H19.0001V20.5858ZM7.00001 18.1716L7.00006 5H17.0001V18.1716L12.0001 13.1716L7.00001 18.1716Z"
      ></path>
    </svg>
  );
}
