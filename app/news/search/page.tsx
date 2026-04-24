"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import useFetchPosts from '../hooks/useFetchPosts';
import { useTheme } from "../context/ThemeContext";
import SearchLatestNews from './components/SearchLatestNews';
import SearchCard from './components/SearchCard';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('s') || '');
  const [displayQuery, setDisplayQuery] = useState(searchParams.get('s') || '');
  const { posts, loading, error } = useFetchPosts();
  const { isDark } = useTheme();

  useEffect(() => {
    const query = searchParams.get('s') || '';
    setSearchQuery(query);
    setDisplayQuery(query);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/news/search?s=${encodeURIComponent(searchQuery.trim())}`);
      setDisplayQuery(searchQuery.trim());
    }
  };

  const filteredPosts = displayQuery
    ? posts.filter(post =>
        post.title.toLowerCase().includes(displayQuery.toLowerCase())
      )
    : [];

  if (loading) return <p className={`${isDark ? "text-white" : "text-black"}`}>Carregando...</p>;
  if (error) return <p className={`${isDark ? "text-white" : "text-red-500"}`}>{error}</p>;

  return (
    <div className={`container mx-auto px-4 py-8 ${isDark ? "bg-[#000000] text-white" : "bg-white text-black"}`}>
      <div className="w-full h-full flex flex-col gap-4 mb-8">
        {displayQuery && <span className="relative">Mostrando resultados para: {displayQuery}</span>}
        <form onSubmit={handleSearch} className="w-[334px] relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full h-12 px-4 border-b border-gray-300 focus:outline-none text-3xl placeholder:text-[#a0a0a0] ${isDark ? "bg-[#000000] text-white" : "bg-white text-black"}`}
            placeholder="Buscar..."
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M9.20078 0.799988C13.84 0.799988 17.6008 4.5608 17.6008 9.19999C17.6008 11.1954 16.905 13.0283 15.7429 14.4693L21.2372 19.9636L19.9644 21.2364L14.4701 15.7421C13.0291 16.9042 11.1962 17.6 9.20078 17.6C4.56159 17.6 0.800781 13.8392 0.800781 9.19999C0.800781 4.5608 4.56159 0.799988 9.20078 0.799988ZM9.20078 2.59999C5.5557 2.59999 2.60078 5.55491 2.60078 9.19999C2.60078 12.8451 5.5557 15.8 9.20078 15.8C12.8459 15.8 15.8008 12.8451 15.8008 9.19999C15.8008 5.55491 12.8459 2.59999 9.20078 2.59999Z" fill="white"></path>
            </svg>
          </button>
        </form>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-4">
        {/* Search Results - Takes up 2/3 of the space */}
        <div className="lg:col-span-6">
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => <SearchCard key={post.id} post={post} />)
            ) : (
              displayQuery && <p>Nenhum post encontrado.</p>
            )}
          </div>
        </div>

        {/* Latest News - Takes up 1/3 of the space */}
        <div className="lg:col-span-2">
          <SearchLatestNews />
        </div>
      </div>
    </div>
  );
}

