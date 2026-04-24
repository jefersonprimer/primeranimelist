"use client";

import { useTheme } from "../../context/ThemeContext";
import { Post } from "../../types/posts";
import Link from "next/link";

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

interface PostCardProps {
  post: Post;
  hideImage?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, hideImage = false }) => {
  const { isDark } = useTheme();

  return (
    <div className={`border-b ${isDark ? "border-[#4A4E58]" : "border-[#29B9B7]"} py-2`}>
      <Link href={getPostUrl(post)} className="block">
        {!hideImage && (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-auto mb-4"
          />
        )}
        
        <div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className={`${
                  isDark ? "bg-[#2B2D32] text-[#2ABDBB] hover:bg-[#000] hover:border hover:border-[#2ABDBB]" : "bg-[#F0EDE7] text-[#2ABDBB] hover:bg-[#fff] hover:border hover:border-[#F0EDE7]"
                }  text-[12px] font-weight-700 px-[18px] py-[1.5px] my-1 rounded-[9px] border border-transparent`}
              >
                {tag}
              </span>
            ))}
          </div>
          <p className={`text-[11px] font-weight-500 ${isDark ? "text-[#a0a0a0]" : "text-[#4a4e58]"} mt-2`}>
            {formatDate(post.created_at)}
          </p>
          <h2
            className={`text-[16px] font-weight-700 ${
              isDark ? "text-[#FFFFFF]" : "text-[#000000]"
            } font-bold mt-2`}
          >
            {post.title}
          </h2>
          <p className={`text-[12px] font-weight-700 ${isDark ? "text-[#00787E]" : "text-[#00787E]"} mt-2`}>
            {post.author.name}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;


