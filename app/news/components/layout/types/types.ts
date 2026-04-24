export type SubLink = {
    label: string;
    href: string;
  };
  
  export type NavItem = {
    label: string;
    href: string;
    subLinks?: SubLink[];
  };