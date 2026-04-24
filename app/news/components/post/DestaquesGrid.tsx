"use client";

import { useTheme } from "../../context/ThemeContext"; // Importando o hook useTheme
import { Post } from "../../types/posts";
import Link from "next/link";
import PostCardRows from "./PostCardRows";

type DestaquesGridProps = {
  posts: Post[];
};

const DestaquesGrid: React.FC<DestaquesGridProps> = ({ posts }) => {
  const { isDark } = useTheme(); // Pegando o estado do tema
  // Filtrar apenas os posts da categoria "Destaques"
  const DestaquesGrid = posts.filter((post) => post.category === "destaques");

  if (DestaquesGrid.length === 0) {
    return <p className={`text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>Nenhuma notícia encontrada.</p>;
  }

  // Mostrar apenas os 5 primeiros posts
  const displayedPosts = DestaquesGrid.slice(0, 5);

  return (
    <div>
      <h1 className={`text-3xl ${isDark ? "text-white" : "text-black"} border-b-4 ${isDark ? "border-[#F47521]" : "border-[#F47521]"} my-4`}>
        Destaques
      </h1>
      <div className={`flex flex-col ${isDark ? "bg-[#000000]" : "bg-[#FFFCF6]"}`}>
        {displayedPosts.map((post) => (
          <PostCardRows key={post.id} post={post} />
        ))}
        {/* Se houver mais de 5 posts, mostrar o botão "Ver mais" */}
        {DestaquesGrid.length > 5 && (
          <div className="text-center mt-4">
            <Link
              href="/news/latest"
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

export default DestaquesGrid;


