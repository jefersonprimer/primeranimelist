"use client";

import React from 'react';
import Link from 'next/link';
import { NavItem } from '../types/types';

interface NavItemProps {
  item: NavItem;
  isDark: boolean;
  openDropdown: string | null;
  handleMouseEnter: (label: string) => void;
  handleMouseLeave: () => void;
}

const NavItemComponent: React.FC<NavItemProps> = ({ 
  item, 
  isDark, 
  openDropdown, 
  handleMouseEnter, 
  handleMouseLeave 
}) => {
  return (
    <div
      className="relative group"
      onMouseEnter={() => item.subLinks && handleMouseEnter(item.label)}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        className={`${isDark ? "text-white" : "text-[#4A4E62]"} ${
          item.subLinks && openDropdown === item.label
            ? isDark
              ? "bg-[#2B2D32] text-[#E6E5E3]"
              : "bg-[#DFDFDD] text-[#008382]"
            : isDark
            ? "hover:bg-[#2B2D32] hover:text-[#008382]"
            : "hover:bg-[#EFEDE9] hover:text-[#008382]"
        } transition-colors px-4 py-[22px] flex items-center`}
      >
        {item.label}
        {item.subLinks && (
          <svg
            width="10"
            height="5"
            viewBox="0 0 10 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 0H10L5 5L0 0Z"
              fill="#2ABDBB"
            />
          </svg>
        )}
      </Link>

      {item.subLinks && openDropdown === item.label && (
        <div
          className={`absolute z-10 ${isDark ? "bg-[#2B2D32]" : "bg-[#E6E5E3]"} w-48 shadow-lg left-0`}
          onMouseEnter={() => handleMouseEnter(item.label)}
          onMouseLeave={handleMouseLeave}
        >
          {item.subLinks.map((subLink) => (
            <Link
              key={subLink.label}
              href={subLink.href}
              className={`block text-sm 
                ${isDark ? "text-white hover:bg-[#23252B]" : "text-[#4A4E62] hover:bg-[#FFF]"}
                hover:text-[#008382] transition-colors px-4 py-4`}
            >
              {subLink.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavItemComponent;

