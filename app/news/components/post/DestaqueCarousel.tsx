"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext"; // Importando o hook useTheme
import PostCard from "./PostCard";
import { Post } from "../../types/posts";
import Link from "next/link";

type DestaqueCarouselProps = {
  posts: Post[];
};

const ArticlesCarousel: React.FC<DestaqueCarouselProps> = ({ posts }) => {
  const { isDark } = useTheme(); // Pegando o estado do tema
  const articlesPosts = posts.filter((post) => post.category === "destaques");
  const displayedPosts = articlesPosts.slice(0, 5);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (displayedPosts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayedPosts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [displayedPosts.length]);

  const prevSlide = () => {
    if (displayedPosts.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + displayedPosts.length) % displayedPosts.length);
  };

  const nextSlide = () => {
    if (displayedPosts.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % displayedPosts.length);
  };

  if (displayedPosts.length === 0) {
    return (
      <div>
        <h1 className={`text-3xl ${isDark ? "text-white" : "text-black"} border-b-4 ${isDark ? "border-[#F47521]" : "border-[#F47521]"} my-4`}>
          Destaque
        </h1>
        <div className={`relative ${isDark ? "bg-[#1c1c1c]" : "bg-[#F0EDE7]"} p-4 flex justify-center items-center`}>
          <p className={`${isDark ? "text-white" : "text-black"}`}>Nenhum post em destaque no momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className={`text-3xl ${isDark ? "text-white" : "text-black"} border-b-4 ${isDark ? "border-[#F47521]" : "border-[#F47521]"} my-4`}>
        Destaque
      </h1>
      <div className={`relative ${isDark ? "bg-[#1c1c1c]" : "bg-[#F0EDE7]"} p-4 flex justify-center items-center`}>
        <button onClick={prevSlide} className="absolute left-4 text-gray-700 text-2xl">
          <svg width="13" height="21" viewBox="0 0 13 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M10.0607 0L12.182 2.12132L4.24232 10.0607L12.182 18L10.0607 20.1213L0 10.0607L10.0607 0Z" fill="white"></path>
          </svg>
        </button>
        <PostCard key={displayedPosts[currentIndex].id} post={displayedPosts[currentIndex]} />
        <button onClick={nextSlide} className="absolute right-4 text-gray-700 text-2xl">
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M1.04481 10L-8.61508e-07 8.94573L3.91053 5L-1.71613e-07 1.05427L1.04482 5.20478e-07L6 5L1.04481 10Z" fill="#FFFFFF"></path>
          </svg>
        </button>
      </div>
      {articlesPosts.length > 5 && (
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
  );
};

export default ArticlesCarousel;


