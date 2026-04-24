'use client';

import useFetchPosts from './hooks/useFetchPosts';
import Banner from './components/Banner';
import LatestNews from './components/latest-news/LatestNews';
import FeaturedContent from './components/post/FeaturedContent';
import SpecialArticles from './components/post/SpecialArticles';
import AdBanner from './components/post/AdBanner';
import AnimeSeriesCard from './components/AnimeSeriesCard';
import QuizzesAndTests from './components/post/QuizzesAndTests';
import Guides from './components/post/Guides';
import { useTheme } from './context/ThemeContext';
import CustomTagPanel from './components/CustomTagPanel';
import { useRef } from 'react';
import Link from 'next/link'
import Loading from '../loading';

const HomePage = () => {
  const { isDark } = useTheme(); 

  const { posts, loading, error } = useFetchPosts();
  const topRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    console.log('Scrolling to top...');
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  return (
    <div className="relative">
      <div ref={topRef} className="max-w-[1200px] w-full mx-auto px-4">
        <Link href="http://localhost:3001/watch/a98c2f98-db7a-4e9d-acb7-ecdd36042ea5/maomao">
          <Banner
            src="https://a.storyblok.com/f/178900/2304x154/9683340ebe/pt_byebyeearth_s2_cr_desktop_2304x154.png/m/filters:quality(95)format(webp)"
            alt="Bye Bye, Earth"
            width={2304}
            height={154}
          />
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-4 my-8">
          {/* Primeira coluna - Últimas Notícias */}
          <div className="md:col-span-1 lg:col-span-3 ">
            <LatestNews />
          </div>

          {/* Segunda coluna - Destaques e Anúncios */}
          <div className={`md:col-span-1 lg:col-span-6 px-4 border-l border-r ${isDark ? "border-[#4A4E58]" : "border-[#A0A0A0]"}`}>
            <FeaturedContent />
          </div>

          {/* Terceira coluna - Artigos Especiais */}
          <div className="md:col-span-1 lg:col-span-3">
            <SpecialArticles/>
          </div>
        </div>

        <Banner
          src="https://a.storyblok.com/f/178900/2304x154/2fb84820aa/q22025_crnews_bannerplacements_pt-br-cr_desktop_2304x154.png/m/filters:quality(95)format(webp)"
          alt="Temporada de janeiro de 2025"
          width={2304}
          height={154}
        />
        <AdBanner />
      </div>
      <div className='my-14'>
        <AnimeSeriesCard />
      </div>
      <QuizzesAndTests />
      <CustomTagPanel />
      <Guides />
      
      {/* Botão Voltar ao Topo */}
      <div className="flex justify-center my-8">
        <button
          onClick={() => scrollToTop()}
          type="button"
          className={`px-4 py-2 cursor-pointer text-[#008382] border border-[#008382] hover:bg-[#008382] hover:text-white transition-colors duration-200`}
        >
          <span>Voltar para o topo</span>
        </button>
      </div>
    </div>
  );
};

export default HomePage;

