interface DropdownIconProps {
  size: number;
}

export function DropdownIcon({ size }: DropdownIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      data-t="dropdown-svg"
      aria-hidden="true"
      role="img"
      width={size}
      height={size}
      fill="currentColor"
    >
      <path d="M7 10h10l-5 5z"></path>
    </svg>
  );
}
