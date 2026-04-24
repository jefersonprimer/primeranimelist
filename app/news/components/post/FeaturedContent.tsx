"use client";

import { useState, useEffect } from "react";
import useFetchPosts from "../../hooks/useFetchPosts";
import { useTheme } from "../../context/ThemeContext";
import Link from "next/link";
import FilteredPostGrid from "../FeaturedContent/FilteredPostGrid";
import FilteredPostGridRows from "../cards/FilteredPostGridRows";

const FeaturedContent = () => {
  const { posts, loading, error } = useFetchPosts();
  const { isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get latest post from each category
  const categories = ["announcements", "latest", "guides", "quizzes", "seasonal-lineup"];
  const latestPosts = categories.map(category => {
    const categoryPosts = posts.filter(post => post.category === category);
    return categoryPosts.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
  }).filter(Boolean);

  // Get latest 5 announcements
  const announcements = posts
    .filter(post => post.category === "announcements")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === latestPosts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? latestPosts.length - 1 : prevIndex - 1
    );
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [latestPosts.length]); // Add dependency to prevent stale closure

  if (loading) {
    return <p className="text-center text-lg">Carregando posts...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  return (
    <div className={`relative w-full ${isDark ? "bg-[#000000]" : "bg-[#FFFCF6]"}`}>
      <div
        className={`w-full border-b-4 mb-1 ${
          isDark ? "border-[#F47521]" : "border-[#F47521]"
        } flex justify-between items-center`}
      >
        <h1 className={`text-3xl font-weight-700 ${isDark ? "text-[#FFFFFF]" : "text-[#000000]"} mb-2`}>
          Destaques
        </h1>
      </div>

      {/* Carousel */}
      <div className="relative mb-8">
        <div className="relative">
          {currentIndex > 0 && (
            <button 
              onClick={prevSlide} 
              className="absolute left-0 top-7/10 z-10 text-white bg-[#264949] py-1 px-2 text-2xl"
            >
              <svg width="13" height="21" viewBox="0 0 13 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.0607 0L12.182 2.12132L4.24232 10.0607L12.182 18L10.0607 20.1213L0 10.0607L10.0607 0Z" fill="white"></path>
              </svg>
            </button>
          )}
          
          {latestPosts[currentIndex] && (
            <FilteredPostGrid 
              posts={[latestPosts[currentIndex]]} 
              category={latestPosts[currentIndex].category} 
              limit={1} 
            />
          )}

          {currentIndex < latestPosts.length - 1 && (
            <button 
              onClick={nextSlide} 
              className="absolute right-0 top-7/10 z-10 text-white bg-[#264949] py-1 px-2 text-2xl"
            >
              <svg width="13" height="21" viewBox="0 0 13 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M2.93934 0L0.81802 2.12132L8.75768 10.0607L0.81802 18L2.93934 20.1213L13 10.0607L2.93934 0Z" fill="#FFFFFF"></path>
              </svg>
            </button>
          )}
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center mt-4 gap-2">
          {latestPosts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex 
                  ? isDark ? "bg-[#F47521]" : "bg-[#F47521]"
                  : isDark ? "bg-gray-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Latest Announcements */}
      <div className="mt-8">
        <div
          className={`w-full border-b-4 mb-1 ${
            isDark ? "border-[#F47521]" : "border-[#F47521]"
          } flex justify-between items-center`}
        >
          <h1 className={`text-3xl font-weight-700 ${isDark ? "text-[#FFFFFF]" : "text-[#000000]"} mb-2`}>
            Destaques
          </h1>
        </div>
        <div className="flex flex-col gap-4">
          {announcements.map((post) => (
            <div key={post.id}>
              <FilteredPostGridRows posts={[post]} category="announcements" limit={1} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedContent; 

