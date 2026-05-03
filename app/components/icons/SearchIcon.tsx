interface SearchIconProps {
  size: number;
}

export function SearchIcon({ size }: SearchIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      data-t="search-svg"
      aria-hidden="true"
      role="img"
      width={size}
      height={size}
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 19C12.4879 19 14.3164 18.3176 15.7641 17.1742L21.2927 22.7069L22.7074 21.2931L17.1778 15.7595C18.319 14.3126 19 12.4858 19 10.5C19 5.80558 15.1944 2 10.5 2C5.80558 2 2 5.80558 2 10.5C2 15.1944 5.80558 19 10.5 19ZM10.5 17C14.0899 17 17 14.0899 17 10.5C17 6.91015 14.0899 4 10.5 4C6.91015 4 4 6.91015 4 10.5C4 14.0899 6.91015 17 10.5 17Z"
      ></path>
    </svg>
  );
}
