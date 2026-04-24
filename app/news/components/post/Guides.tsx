"use client";

import useFetchPosts from "../../hooks/useFetchPosts";
import { useTheme } from "../../context/ThemeContext";
import Link from "next/link";
import FilteredPostGrid from "../cards/FilteredPostGrid";
import FilteredPostGridRows from "../cards/FilteredPostGridRows";

const Guides = () => {
  const { posts, loading, error } = useFetchPosts();
  const { isDark } = useTheme();

  if (loading) {
    return <p className="text-center text-lg">Carregando posts...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  // Filtra apenas posts da categoria "guias"
  const guides = posts.filter((post) => post.category === "guides");

  // Sort posts by date (most recent first)
  const sortedGuias = [...guides].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Get the 6 most recent posts
  const recentGuias = sortedGuias.slice(0, 6);

  return (
    <div
      className={`relative w-full max-w-[1200px] mx-auto mt-[30px] px-4 ${
        isDark ? "bg-[#000]" : "bg-[#FFFCF6]"
      }`}
    >
      <div
        className={`w-full border-b-4 mb-1 ${
          isDark ? "border-[#F47521]" : "border-[#F47521]"
        } flex justify-between items-center`}
      >
          <h1 className={`text-3xl font-weight-700 ${isDark ? "text-[#FFFFFF]" : "text-[#000000]"}`}>
            Guias
          </h1>
        <div className={`text-[#008382] border ${isDark ? 'border-[#008382]' : 'border-[#008382]'} mb-2 px-4 py-2 hover:bg-[#008382] hover:text-[#000]`}>
          <Link href="/news/announcements">Todos os Guias</Link>
        </div>
      </div>

      {/* Grid responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-4 mb-8">
        {/* Primeira coluna - Dois posts verticais */}
        <div className="sm:col-span-1 md:col-span-1 lg:col-span-3">
          {recentGuias[4] && (
            <div className="mb-4">
              <FilteredPostGrid posts={[recentGuias[4]]} category="guides" limit={1} />
            </div>
          )}
          {recentGuias[5] && (
            <div>
              <FilteredPostGrid posts={[recentGuias[5]]} category="guides" limit={1} />
            </div>
          )}
        </div>

        {/* Segunda coluna - Dois posts verticais (mais larga) */}
        <div className={`sm:col-span-1 md:col-span-1 lg:col-span-4 lg:border-x-2 ${isDark ? "border-[#4A4E58]" : "border-[#A0A0A0]"}`}>
          {recentGuias[2] && (
            <div className="mb-4">
              <FilteredPostGrid posts={[recentGuias[2]]} category="guides" limit={1} />
            </div>
          )}
          {recentGuias[3] && (
            <div>
              <FilteredPostGrid posts={[recentGuias[3]]} category="guides" limit={1} hideImage={true} />
            </div>
          )}
        </div>

        {/* Terceira coluna - Dois posts verticais (primeiro normal, segundo em row) */}
        <div className="sm:col-span-1 md:col-span-1 lg:col-span-5">
          {recentGuias[0] && (
            <div className="mb-4">
              <FilteredPostGrid posts={[recentGuias[0]]} category="guides" limit={1} />
            </div>
          )}
          {recentGuias[1] && (
            <div>
              <FilteredPostGridRows posts={[recentGuias[1]]} category="guides" limit={1} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Guides;


