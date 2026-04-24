"use client";

import useFetchPosts from "../../hooks/useFetchPosts";
import { useTheme } from "../../context/ThemeContext";
import Link from "next/link";
import FilteredPostGrid from "../cards/FilteredPostGrid";
import FilteredPostGridRows from "../cards/FilteredPostGridRows";

const AdBanner = () => {
  const { posts, loading, error } = useFetchPosts();
  const { isDark } = useTheme();

  if (loading) {
    return <p className="text-center text-lg">Carregando posts...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  // Filtra apenas posts da categoria "anuncios"
  const announcements = posts.filter((post) => post.category === "announcements");

  // Sort posts by date (most recent first)
  const sortedAnuncios = [...announcements].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Get the 6 most recent posts
  const recentAnuncios = sortedAnuncios.slice(0, 6);

  return (
    <div className={`relative w-full max-w-[1200px] mx-auto mt-[30px]  ${isDark ? 'bg-[#000000]' : 'bg-[#FFFCF6]'}`}>
      <div
        className={`w-full border-b-4 mb-1 ${
          isDark ? "border-[#F47521]" : "border-[#F47521]"
        } flex justify-between items-center`}
      >
          <h1 className={`text-3xl font-weight-700 ${isDark ? "text-[#FFFFFF]" : "text-[#000000]"}`}>
            Anúncios
          </h1>
        <div className={`text-[#008382] border ${isDark ? 'border-[#008382]' : 'border-[#008382]'} mb-2 px-4 py-2 hover:bg-[#008382] hover:text-[#000]`}>
          <Link href="/news/announcements">Todos os anúncios</Link>
        </div>
      </div>

      {/* Grid responsiva */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4 mb-8">
        {/* Primeira coluna - Post grande e post em row */}
        <div className="sm:col-span-1 md:col-span-1 lg:col-span-5">
          {recentAnuncios[4] && (
            <div className="mb-4">
              <FilteredPostGrid posts={[recentAnuncios[4]]} category="announcements" limit={1} />
            </div>
          )}
          {recentAnuncios[5] && (
            <div>
              <FilteredPostGridRows posts={[recentAnuncios[5]]} category="announcements" limit={1} />
            </div>
          )}
        </div>

        {/* Segunda coluna - Dois posts (menor) */}
        <div className={`sm:col-span-1 md:col-span-1 lg:col-span-3 lg:border-x-2 ${isDark ? "border-[#4A4E58]" : "border-[#A0A0A0]"}`}>
          {recentAnuncios[2] && (
            <div className="mb-4">
              <FilteredPostGrid posts={[recentAnuncios[2]]} category="announcements" limit={1} />
            </div>
          )}
          {recentAnuncios[3] && (
            <div>
              <FilteredPostGrid posts={[recentAnuncios[3]]} category="announcements" limit={1} />
            </div>
          )}
        </div>

        {/* Terceira coluna - Dois posts (um normal e um sem imagem) */}
        <div className="sm:col-span-1 md:col-span-1 lg:col-span-4">
          {recentAnuncios[0] && (
            <div className="mb-4">
              <FilteredPostGrid posts={[recentAnuncios[0]]} category="announcements" limit={1} />
            </div>
          )}
          {recentAnuncios[1] && (
            <div>
              <FilteredPostGrid posts={[recentAnuncios[1]]} category="announcements" limit={1} hideImage={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdBanner;


