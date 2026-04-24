"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from "../../context/ThemeContext";
import NavItem from './components/NavItem';
import UserProfileButton from './components/buttons/LoginButton';
import SearchButton from './components/buttons/SearchButton';
import { navItems } from './utils/constants';
import MobileMenu from './components/MobileMenu';


const Header = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);
  const { isDark } = useTheme();

  const handleMouseEnter = (label: string) => {
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileAccordion = (label: string) => {
    if (openMobileAccordion === label) {
      setOpenMobileAccordion(null);
    } else {
      setOpenMobileAccordion(label);
    }
  };

  return (
    <header className={`${isDark ? "bg-[#000000] text-white" : "bg-[#FFFCF6] text-[#4A4E58]"} border-b-4 border-orange-500`}>  
      <div className="container mx-auto max-w-[1200px]">
        <div className="flex items-center justify-between px-4 2xl:px-[174px] h-16">
          {/* Left side: Hamburger + Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <div className={`block md:hidden px-4 py-[16px] cursor-pointer ${isDark ? "text-white hover:bg-[#4A4E58]" : "text-[#4A4E62] hover:bg-[#E6E5E3]"}`}>
              <button 
                onClick={toggleMobileMenu}
                className="mobile-menu-button cursor-pointer "
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/news" className="text-xl font-bold">
                <img src="/logo.webp" alt="Logo" className="" />
              </Link>
            </div>
          </div>
  
          {/* Right side: Navigation (desktop) + Login + Search */}
          <div className="flex items-center gap-2">
            {/* Navigation for desktop */}
            <nav className="hidden md:flex">
              {navItems.map((item) => (
                <NavItem
                  key={item.label}
                  item={item}
                  isDark={isDark}
                  openDropdown={openDropdown}
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                />
              ))}
            </nav>
            <div className="flex items-center">
              <SearchButton isDark={isDark} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu (sidebar) */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        isDark={isDark}
        navItems={navItems}
        openMobileAccordion={openMobileAccordion}
        toggleMobileAccordion={toggleMobileAccordion}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Header;

