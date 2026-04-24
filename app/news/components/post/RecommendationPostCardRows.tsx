"use client";

import { useTheme } from "../../context/ThemeContext"; // Importando o hook useTheme
import { Post } from "../../types/posts";
import Link from "next/link";

type RecommendationPostCardRowsProps = {
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

const RecommendationPostCardRows: React.FC<RecommendationPostCardRowsProps> = ({ post }) => {
  const { isDark } = useTheme(); // Pegando o estado do tema

  return (
    <div className={`border-b ${isDark ? "border-[#4A4E58]" : "border-[#29B9B7]"} px-3 py-4`}>
      <Link href={getPostUrl(post)} className="block">
        <div className="flex items-center gap-4">
          {/* Imagem à esquerda */}
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-[160px] h-[96px] object-cover"
          />

          {/* Conteúdo à direita */}
          <div className="flex-1">
            
            <p className={`text-[11px] font-weight-500 ${isDark ? "text-[#a0a0a0]" : "text-gray-500"} mt-1`}>
              {formatDate(post.created_at)}
            </p>
            <h2 className={`text-[16px] font-weight-700 ${isDark ? "text-white" : "text-[#000]"} mt-1`}>
              {post.title}
            </h2>
            <p className={`text-[12px] font-weight-700 ${isDark ? "text-[#00787E]" : "text-[#00787E]"} mt-1`}>
              {post.author.name}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RecommendationPostCardRows;


