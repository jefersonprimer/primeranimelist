'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Post } from '../../../../../types/posts';
import Link from 'next/link';
import RecommendationPostCardRows from '../../../../../components/post/RecommendationPostCardRows';
import { useTheme } from "../../../../../context/ThemeContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [recommendedPosts, setRecommendedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isDark } = useTheme();

  // Captura os parâmetros da URL
  const { category, year, month, day, slug } = params;

  useEffect(() => {
    async function fetchPostAndRecommendations() {
      try {
        setLoading(true);
        console.log("Fetching with params:", { category, year, month, day, slug });

        // Busca o post específico
        const postResponse = await fetch(`${API_URL}/api/posts/${category}/${year}/${month}/${day}/${slug}`);
        if (!postResponse.ok) {
          throw new Error(`Failed to fetch post (${postResponse.status})`);
        }
        const foundPost = await postResponse.json();

        if (foundPost) {
          console.log("Found post:", foundPost);
          setPost(foundPost);
          
          // Busca posts recomendados
          const recommendationsResponse = await fetch(`${API_URL}/api/posts`);
          if (!recommendationsResponse.ok) {
            throw new Error(`Failed to fetch recommendations (${recommendationsResponse.status})`);
          }
          const allPosts = await recommendationsResponse.json();
          
          // Encontrar posts recomendados baseados na categoria
          const recommendations = allPosts
            .filter((p: Post) => 
              p.category.toLowerCase() === foundPost.category.toLowerCase() && 
              p.id !== foundPost.id
            )
            .slice(0, 3); // Limitar a 3 recomendações
            
          setRecommendedPosts(recommendations);
        } else {
          setError('Post não encontrado com os parâmetros fornecidos.');
        }
      } catch (err) {
        console.error("Erro ao buscar o post:", err);
        setError(`Erro ao carregar o post: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPostAndRecommendations();
    } else {
      setError('Slug não fornecido na URL.');
      setLoading(false);
    }
  }, [category, year, month, day, slug]);

  useEffect(() => {
    if (post) {
      document.title = post.title;
    }
  }, [post]);

  if (loading) {
    return <div className={`container mx-auto p-4 ${isDark ? "bg-[#333333] text-white" : "bg-white text-black"}`}>Carregando...</div>;
  }

  if (error) {
    return <div className={`container mx-auto p-4 text-red-500 ${isDark ? "bg-[#333333]" : "bg-white"}`}>{error}</div>;
  }

  if (!post) {
    return <div className={`container mx-auto p-4 ${isDark ? "bg-[#333333] text-white" : "bg-white text-black"}`}>Post não encontrado.</div>;
  }

  return (
    <div className={`container mx-auto p-4 max-w-[1200px] 
      ${isDark ? "bg-[#000000] text-white" : "bg-white text-black"}`}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Coluna Principal com o Conteúdo do Post */}
        <div className="w-full lg:w-6/8">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-8">
            {/* Category */}
            <div className="flex items-center">
              <span
                className={`cursor-pointer ${
                  isDark ? "bg-[#2B2D32] text-[#2ABDBB] hover:bg-[#000] hover:border" : "bg-[#F0EDE7] text-[#2ABDBB] hover:bg-[#fff] hover:border"
                }  text-[12px] font-weight-700 px-[18px] py-[1.5px] my-1 rounded-[9px]`}
              >
                {post.category}
              </span>
            </div>

            {/* Date - abaixo em mobile, ao lado em md+ */}
            <p className={`text-[11px] font-weight-500 ${isDark ? "text-[#dadada]" : "text-[#4a4e58]"}`}>
              {new Date(post.created_at).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>

          {/* Título e Summary */}
          <h1 className={`text-[36px] font-weight-700 mb-2 ${isDark ? "text-[#FFFFFF]" : "text-[#000000]"}`}>{post.title}</h1>
          <h3 className={`text-[24px] font-weight-500 mb-2 ${isDark ? "text-[#DADADA]" : "text-[#000000]"}`}>{post.summary}</h3>

          {/* Author and Image */}
          <div className="flex items-center gap-2 mb-4">
            <img className='w-[50px] h-[50px] rounded-[50%]' src={post.author.image} alt={post.author.name} />
            <a href={`http://localhost:3001/news/author/${post.author.name}`}
             className="cursor-pointer hover:underline hover:text-[#51D6D5]">
              <span className={`text-[16px] font-weight-700 ${isDark ? "text-[#51D6D5]" : "text-[#51D6D5]"}`}>{post.author.name}</span>
            </a>
          </div>

          {/* Conteúdo */}
          <div className={`prose max-w-none mb-8 border-t-1 border-[#4A4E58] pt-2 ${isDark ? "text-white" : "text-[#000000]"} border-b ${isDark ? "border-[#4A4E58]" : "border-[#00787E]"}`}>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4 mt-[60px]">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`cursor-pointer ${
                    isDark ? "bg-[#2B2D32] text-[#2ABDBB] hover:bg-[#000] hover:border" : "bg-[#F0EDE7] text-[#2ABDBB] hover:bg-[#fff] hover:border"
                  }  text-xs font-semibold px-2 py-1 my-1 rounded-[10px]`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Coluna de Recomendações */}
        <div className="w-full lg:w-2/8 mt-9 border-[#4A4E58] border-l-1 pl-4">
          <div className="sticky top-4">
            <h3 className={`text-3xl font-weight-700  ${isDark ? "text-white" : "text-[#298382]"} border-b-2 pb-1 border-[#F47521]`}>
              Leia também
            </h3>
            
            {recommendedPosts.length > 0 ? (
              <div>
                {recommendedPosts.map((recPost) => (
                  <RecommendationPostCardRows key={recPost.id} post={recPost} />
                ))}
              </div>
            ) : (
              <p className={`${isDark ? "text-[#A4A5A7]" : "text-gray-600"}`}>Nenhuma recomendação disponível.</p>
            )}
            
            {/* Ver mais link */}
            <div className="mt-4 text-center">
              <Link 
                href={`/news/${post.category.toLowerCase()}`}
                className={`inline-block px-4 py-2 border-[#298382] border 
                  ${isDark ? " text-[#298382]" : " text-[#298382]"} font-medium hover:bg-[#29B9B7] hover:text-white transition-colors`}
              >
                Ver mais {post.category}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}