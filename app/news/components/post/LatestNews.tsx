"use client";

import useFetchPosts from "../../hooks/useFetchPosts";
import { useTheme } from "../../context/ThemeContext";
import Link from "next/link";
import FilteredPostGrid from "../latest-news/FilteredPostGrid";

const LatestNews = () => {
  const { posts, loading, error } = useFetchPosts();
  const { isDark } = useTheme();

  if (loading) {
    return <p className="text-center text-lg">Carregando posts...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  // Filtra apenas posts da categoria "latest"
  const latestPosts = posts.filter((post) => post.category === "latest");

  // Sort posts by date (most recent first)
  const sortedPosts = [...latestPosts].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Get the 5 most recent posts
  const recentPosts = sortedPosts.slice(0, 5);

  return (
    <div className={`relative w-full ${isDark ? "bg-[#000000]" : "bg-[#FFFCF6]"}`}>
      <div
        className={`w-full border-b-4 mb-1 ${
          isDark ? "border-[#F47521]" : "border-[#F47521]"
        } flex justify-between items-center`}
      >
        <h1 className={`text-3xl font-weight-700 ${isDark ? "text-[#FFFFFF]" : "text-[#000000]"} mb-2`}>
          Últimas Notícias
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        {/* Primeiros 3 posts com imagem */}
        {recentPosts.slice(0, 3).map((post, index) => (
          <div key={post.id}>
            <FilteredPostGrid posts={[post]} category="latest" limit={1} />
          </div>
        ))}

        {/* Últimos 2 posts sem imagem */}
        {recentPosts.slice(3, 5).map((post, index) => (
          <div key={post.id}>
            <FilteredPostGrid posts={[post]} category="latest" limit={1} hideImage={true} />
          </div>
        ))}

        {/* Botão "Todas as Notícias" */}
        <div className="text-center mt-4">
          <Link
            href="/news/latest"
            className={`text-[#008382] border ${isDark ? 'border-[#008382]' : 'border-[#008382]'} px-4 py-2 hover:bg-[#008382] hover:text-[#000] inline-block`}
          >
            Todas as Notícias
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LatestNews; 

