"use client";

import { useTheme } from "../../context/ThemeContext"; // Importando o hook useTheme
import { Post } from "../../types/posts";
import Link from "next/link";

type SearchCardRowsProps = {
  post: Post;
};

// Função para formatar a data no formato "Mar 17, 2025"
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

// Função para formatar a URL do post
const getPostUrl = (post: Post) => {
  if (!post.created_at) {
    console.warn('Post date is undefined:', post);
    return `/news/${post.category.toLowerCase()}/${post.slug}`;
  }

  try {
    // Formato da data: "YYYY-MM-DD"
    const date = new Date(post.created_at);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `/news/${post.category.toLowerCase()}/${year}/${month}/${day}/${post.slug}`;
  } catch (error) {
    console.error('Error parsing post date:', error);
    return `/news/${post.category.toLowerCase()}/${post.slug}`;
  }
};

const SearchCardRows: React.FC<SearchCardRowsProps> = ({ post }) => {
  const { isDark } = useTheme(); // Pegando o estado do tema

  return (
    <div className={`border-b ${isDark ? "border-[#4A4E58]" : "border-[#29B9B7]"} px-3 py-4`}>
      <Link href={getPostUrl(post)} className="block">
        <div className="flex items-start gap-4">
          {/* Imagem à esquerda */}
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-[300px] h-[200px] object-cover"
          />

          {/* Conteúdo à direita */}
          <div className="flex-1 flex flex-col">
            {/* Tags e Data na mesma linha */}
            <div className="flex items-center gap-2">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className={`${
                      isDark ? "bg-[#2B2D32] text-[#2ABDBB] hover:bg-[#000] hover:border" : "bg-[#F0EDE7] text-[#2ABDBB] hover:bg-[#fff] hover:border"
                    }  text-xs font-semibold px-2 py-1 rounded-[10px]`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                {formatDate(post.created_at)}
              </p>
            </div>

            {/* Título */}
            <h2 className={`text-lg ${isDark ? "text-white" : "text-[#000]"} font-bold mt-2`}>
              {post.title}
            </h2>

            {/* Resumo */}
            <p className={`text-base ${isDark ? "text-gray-400" : "text-gray-600"} mt-1 line-clamp-2`}>
              {post.summary}
            </p>

            {/* Autor */}
            <p className={`text-base ${isDark ? "text-[#00787E]" : "text-[#00787E]"} mt-2`}>
              {post.author.name}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SearchCardRows;


