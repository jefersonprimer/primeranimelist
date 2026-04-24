type DropdownIconProps = {
  className?: string;
};

export function DropdownIcon({ className = "" }: DropdownIconProps) {
  return (
    <svg
      className={`w-5 h-5 shrink-0 ${className}`.trim()}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      data-t="dropdown-svg"
      aria-hidden="true"
      role="img"
      fill="currentColor"
    >
      <path d="M7 10h10l-5 5z"></path>
    </svg>
  );
}