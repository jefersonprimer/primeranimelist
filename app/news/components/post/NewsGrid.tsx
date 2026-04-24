// components/post/NewsGrid.tsx
"use client";

import { useTheme } from "../../context/ThemeContext";
import PostCard from "./PostCard";
import { Post } from "../../types/posts";
import Link from "next/link";

type NewsGridProps = {
  posts: Post[];
};

const NewsGrid: React.FC<NewsGridProps> = ({ posts }) => {
  const { isDark } = useTheme(); // Obtendo o estado do tema

  const newsPosts = posts.filter((post) => post.category === "noticias");

  if (newsPosts.length === 0) {
    return (
      <p className={`text-center ${isDark ? "text-gray-300" : "text-gray-500"}`}>
        Nenhuma notícia encontrada.
      </p>
    );
  }

  const displayedPosts = newsPosts.slice(0, 5);

  return (
    <div>
      <h1 className={`text-3xl ${isDark ? "text-white" : "text-black"} border-b-4 border-[#F47521]  my-4`}>
        Últimas notícias
      </h1>
      <div className={`flex flex-col ${isDark ? "bg-[#2B2D32]" : "bg-[#F0EDE7]"} `}>
        {displayedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {newsPosts.length > 5 && (
          <div className="text-center mt-4">
            <Link
              href="/news/latest"
              className={`px-4 py-2 ${isDark ? "text-black bg-white" : "text-white bg-blue-600"} hover:bg-blue-700 transition rounded-md`}
            >
              Ver mais
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsGrid;


