"use client";

import useFetchPosts from "../../hooks/useFetchPosts";
import { useTheme } from "../../context/ThemeContext"; 
import Link from "next/link";
import FilteredPostGrid from "../cards/FilteredPostGrid";
import FilteredPostGridRows from "../cards/FilteredPostGridRows";

const QuizzesAndTests = () => {
  const { posts, loading, error } = useFetchPosts();
  const { isDark } = useTheme();

  if (loading) {
    return <p className="text-center text-lg">Carregando posts...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  // Filtra apenas posts da categoria "quizzes"
  const quizzes = posts.filter((post) => post.category === "quizzes");

  // Sort posts by date (most recent first)
  const sortedQuizzes = [...quizzes].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Get the most recent quiz
  const latestQuiz = sortedQuizzes[0];
  
  // Get the next 3 quizzes (excluding the latest)
  const recentQuizzes = sortedQuizzes.slice(1, 4);

  return (
    <div
      className={`relative w-full max-w-[1200px] mx-auto mt-[30px] px-4 ${
        isDark ? "bg-[#000000]" : "bg-[#FFFCF6]"
      }`}
    >
      <div
        className={`w-full border-b-4 mb-1 ${
          isDark ? "border-[#F47521]" : "border-[#F47521]"
        } flex justify-between items-center`}
      >
          <h1 className={`text-3xl font-weight-700 ${isDark ? "text-[#FFFFFF]" : "text-[#000000]"}`}>
            Quizzes e Testes
          </h1>
        <div className={`text-[#008382] border ${isDark ? 'border-[#008382]' : 'border-[#008382]'} mb-2 px-4 py-2 hover:bg-[#008382] hover:text-[#000]`}>
          <Link href="/news/announcements">Todos os quizzes e testes</Link>
        </div>
      </div>

      {/* Grid responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 mb-8">
        {/* Quiz mais recente */}
        <div className={`sm:col-span-1 lg:col-span-6 lg:border-r-2 ${isDark ? "border-[#4A4E58]" : "border-[#A0A0A0]"}`}>
          {latestQuiz && (
            <FilteredPostGrid posts={[latestQuiz]} category="quizzes" limit={1} />
          )}
        </div>

        {/* 3 quizzes recentes (excluindo o mais recente) */}
        <div className="sm:col-span-1 lg:col-span-6 px-2">
          {recentQuizzes.length > 0 && (
            <FilteredPostGridRows posts={recentQuizzes} category="quizzes" limit={3} />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizzesAndTests;


