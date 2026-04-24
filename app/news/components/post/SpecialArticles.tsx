"use client";

import useFetchPosts from "../../hooks/useFetchPosts";
import { useTheme } from "../../context/ThemeContext";
import FilteredPostGrid from "../cards/FilteredPostGrid";

const categories = ["guides", "quizzes", "seasonal-lineup"];

const SpecialArticles = () => {
  const { posts, loading, error } = useFetchPosts();
  const { isDark } = useTheme();

  if (loading) {
    return <p className="text-center text-lg">Carregando posts...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  // Get the latest post from each special category
  const latestSpecialPosts = categories.map(category => {
    const categoryPosts = posts.filter(post => post.category === category);
    return categoryPosts.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
  }).filter(Boolean);

  return (
    <div className={`relative w-full ${isDark ? "bg-[#000000]" : "bg-[#FFFCF6]"}`}>
      <div
        className={`w-full border-b-4 mb-1 ${
          isDark ? "border-[#F47521]" : "border-[#F47521]"
        } flex justify-between items-center`}
      >
        <h1 className={`text-3xl font-weight-700 ${isDark ? "text-[#FFFFFF]" : "text-[#000000]"} mb-2`}>
          Artigos Especiais
        </h1>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {latestSpecialPosts.length === 0 && (
          <p className="text-center text-gray-500">Nenhum artigo especial encontrado.</p>
        )}
        {latestSpecialPosts.map((post) => (
          <FilteredPostGrid key={post.id} posts={[post]} category={post.category} limit={1} />
        ))}
      </div>
    </div>
  );
};

export default SpecialArticles;
