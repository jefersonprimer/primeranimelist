"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchButtonProps {
  isDark: boolean;
}

const SearchButton: React.FC<SearchButtonProps> = ({ isDark }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/news/search?s=${encodeURIComponent(searchQuery.trim())}`);
      setIsModalOpen(false);
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsModalOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(!isModalOpen)}
        className={`cursor-pointer ${isModalOpen ? "bg-[#008382]" : ""} ${isDark ? "text-white hover:bg-[#2B2D32]" : "text-white hover:bg-[#E6E5E3]"} hover:text-[#008382] transition-colors px-3 py-[21px] group-hover:text-[#008382] group mr-4 sm:mx-0`}>
        {isModalOpen ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`group-hover:stroke-[#2ABDBB] ${isDark ? "stroke-white" : ""}`}
          >
            <path
              d="M16.5 5.5L5.5 16.5M5.5 5.5L16.5 16.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`group-hover:stroke-[#2ABDBB] ${isDark ? "stroke-white" : ""}`}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.20078 0.799988C13.84 0.799988 17.6008 4.5608 17.6008 9.19999C17.6008 11.1954 16.905 13.0283 15.7429 14.4693L21.2372 19.9636L19.9644 21.2364L14.4701 15.7421C13.0291 16.9042 11.1962 17.6 9.20078 17.6C4.56159 17.6 0.800781 13.8392 0.800781 9.19999C0.800781 4.5608 4.56159 0.799988 9.20078 0.799988ZM9.20078 2.59999C5.5557 2.59999 2.60078 5.55491 2.60078 9.19999C2.60078 12.8451 5.5557 15.8 9.20078 15.8C12.8459 15.8 15.8008 12.8451 15.8008 9.19999C15.8008 5.55491 12.8459 2.59999 9.20078 2.59999Z"
              fill={isDark ? "#FFFFFF" : "#4A4E58"}
            />
          </svg>
        )}
      </button>

      {isModalOpen && ( 
        <div className={`fixed top-27 left-0 w-[calc(100%-15px)] h-[101px] shadow-md z-50 ${isDark ? "bg-[#2B2D32]" : "bg-[#F0EDE7]"}`}>
          <div className="w-full h-full flex items-center justify-center">
            <form onSubmit={handleSearch} className="w-[778px] relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pesquisar..."
                className={`w-full h-12 px-4 pr-12 border-b focus:outline-none placeholder:text-[#757575] text-3xl ${isDark? "border-[#F47521]" : "border-[#008382]"}`}
                autoFocus
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.20078 0.799988C13.84 0.799988 17.6008 4.5608 17.6008 9.19999C17.6008 11.1954 16.905 13.0283 15.7429 14.4693L21.2372 19.9636L19.9644 21.2364L14.4701 15.7421C13.0291 16.9042 11.1962 17.6 9.20078 17.6C4.56159 17.6 0.800781 13.8392 0.800781 9.19999C0.800781 4.5608 4.56159 0.799988 9.20078 0.799988ZM9.20078 2.59999C5.5557 2.59999 2.60078 5.55491 2.60078 9.19999C2.60078 12.8451 5.5557 15.8 9.20078 15.8C12.8459 15.8 15.8008 12.8451 15.8008 9.19999C15.8008 5.55491 12.8459 2.59999 9.20078 2.59999Z" fill="white"></path>
                </svg>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchButton;

