"use client";

import { Post } from "../../types/posts";
import { useTheme } from "../../context/ThemeContext";
import PostCard from "./PostCard";
import Link from "next/link";

type ArticlesGridProps = {
  posts: Post[];
};

const ArticlesGrid: React.FC<ArticlesGridProps> = ({ posts }) => {
  const { isDark } = useTheme(); // Pegando o estado do tema

  // Filtrar apenas os posts da categoria "Artigos"
  const articlesPosts = posts.filter((post) => post.category === "artigos");

  if (articlesPosts.length === 0) {
    return <p className={`text-center ${isDark ? "text-gray-300" : "text-gray-500"}`}>Nenhum artigo encontrado.</p>;
  }

  // Mostrar apenas os 5 primeiros posts
  const displayedPosts = articlesPosts.slice(0, 5);

  return (
    <div>
      <h1 className={`text-3xl ${isDark ? "text-white" : "text-black"} border-b-4 ${isDark ? "border-[#F47521]" : "border-[#F47521]"}  my-4`}>
        Artigos
      </h1>
      <div className={`flex flex-col ${isDark ? "bg-[#000000]" : "bg-[#FFFCF6]"} `}>
        {displayedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {/* Se houver mais de 5 artigos, mostrar o botão "Ver mais" */}
        {articlesPosts.length > 5 && (
          <div className="text-center mt-4">
            <Link
              href="/articles/latest"
              className={`px-4 py-2 ${isDark ? "text-black bg-[#F47521]" : "text-white bg-blue-600"} hover:bg-blue-700 transition rounded-md`}
            >
              Ver mais
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesGrid;


