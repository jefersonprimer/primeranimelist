"use client";

import useFetchPosts from "../../hooks/useFetchPosts";
import { useTheme } from "../../context/ThemeContext";
import Link from "next/link";
import FilteredPostGrid from "../cards/FilteredPostGrid";
import FilteredPostGridRows from "../cards/FilteredPostGridRows";

const LatestPosts = () => {
  const { posts, loading, error } = useFetchPosts();
  const { isDark } = useTheme();

  if (loading) {
    return <p className="text-center text-lg">Carregando posts...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  // Sort posts by date (most recent first)
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Get the most recent post
  const latestPost = sortedPosts[0];
  
  // Get the next 3 posts (excluding the latest)
  const recentPosts = sortedPosts.slice(1, 4);

  return (
    <div
      className={`relative w-full max-w-[1200px] mx-auto mt-[30px] px-4 ${
        isDark ? "bg-[#000000]" : "bg-[#FFFCF6]"
      }`}
    >
      <div
        className={`w-full border-b-4 ${
          isDark ? "border-[#F47521]" : "border-[#F47521]"
        } flex justify-between items-center`}
      >
        <h1 className={`text-3xl ${isDark ? "text-white" : "text-black"} my-4`}>
          Últimas Publicações
        </h1>
        <div className={`text-[#008382] border ${isDark ? 'border-[#008382]' : 'border-[#008382]'}  px-4 py-2 hover:bg-[#008382] hover:text-[#000]`}>
          <Link href="/news/announcements">Ver todas as publicações</Link>
        </div>
      </div>

      {/* Grid responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 mb-8">
        {/* Post mais recente */}
        <div className="sm:col-span-1 lg:col-span-6 lg:border-r-2 border-[#A0A0A0]">
          {latestPost && (
            <FilteredPostGrid posts={[latestPost]} category={latestPost.category} limit={1} />
          )}
        </div>

        {/* 3 posts recentes (excluindo o mais recente) */}
        <div className="sm:col-span-1 lg:col-span-6">
          {recentPosts.length > 0 && (
            <FilteredPostGridRows posts={recentPosts} category={recentPosts[0].category} limit={3} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestPosts; 

