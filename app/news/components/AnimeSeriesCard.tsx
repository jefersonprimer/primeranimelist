import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AnimeSeriesCardProps {
  title: string;
  imageUrl: string;
  imageAlt: string;
  href: string;
}

const AnimeSeriesCard: React.FC<AnimeSeriesCardProps> = ({ title, imageUrl, imageAlt, href }) => {
  return (
    <div className="flex flex-col">
      <Link href={href} className="block">
        <div className="relative w-full aspect-[172/262]">
          <Image 
            src={imageUrl} 
            alt={imageAlt} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 172px"
            loading="lazy"
          />
        </div>
      </Link>
      <Link href={href} className="mt-2">
        <p className="text-sm font-medium truncate">{title}</p>
      </Link>
    </div>
  );
};

interface EditorsChoiceCarouselProps {
  animeList: {
    title: string;
    imageUrl: string;
    imageAlt: string;
    href: string;
  }[];
}

const EditorsChoiceCarousel: React.FC<EditorsChoiceCarouselProps> = ({ animeList }) => {
  const scrollLeft = () => {
    const container = document.getElementById('anime-carousel');
    if (container) {
      container.scrollBy({ left: -container.clientWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('anime-carousel');
    if (container) {
      container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="w-full bg-cover bg-[#007877]" 
      style={{ backgroundImage: "url('https://a.storyblok.com/f/178900/1440x423/f5a26f0a1a/editor-s-picks-circles.png/m/filters:quality(95)format(webp)')" }}
    >
      <div className="container mx-auto px-4 py-8 text-[#FFFFFF] flex justify-center items-center w-[1520px] h-[420px]">
        {/* Div pai que envolve o container dos cards e a imagem */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 w-[1152px] h-[374px] relative">
          {/* Container dos cards */}
          <div className="w-[806px] h-[374px] md:w-3/4">
            <div className="flex items-center mb-2">
              <h2 className="text-2xl font-bold text-white">Escolhas do editor</h2>
              <div className="ml-2">
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M13.2734 1.11482C11.59 2.01317 10.3942 3.6543 9.93073 5.62114C8.0957 4.8809 6.1188 4.93282 4.46774 5.8139C1.03612 7.64516 -0.148498 12.385 1.82302 16.3958C3.70154 20.2175 7.3 22.8825 12.2244 24.1713C15.8655 25.094 18.9025 24.954 19.0182 24.94L19.384 24.9359L19.6009 24.6291C19.6794 24.5394 21.5956 22.0362 22.9725 18.4356C24.8466 13.5189 24.874 8.91898 22.9955 5.09732C21.0887 1.05191 16.705 -0.716438 13.2734 1.11482Z" fill="#FF944D" />
                </svg>
              </div>
              <div className="ml-1">
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.0064 1.11482C13.6898 2.01317 14.8855 3.6543 15.3491 5.62114C17.1841 4.8809 19.161 4.93282 20.812 5.8139C24.2437 7.64516 25.4283 12.385 23.4568 16.3958C21.5782 20.2175 17.9798 22.8825 13.0554 24.1713C9.4143 25.094 6.37731 24.954 6.26159 24.94L5.89583 24.9359L5.67886 24.6291C5.60034 24.5394 3.68414 22.0362 2.3073 18.4356C0.433191 13.5189 0.405784 8.91898 2.2843 5.09732C4.19107 1.05191 8.57475 -0.716438 12.0064 1.11482Z" fill="#51D6D5" />
                </svg>
              </div>
            </div>
            <p className="text-white mb-6">Confira o que a equipe da Crunchyroll Notícias está assistindo na Crunchyroll!</p>
            
            <div className="relative">
              <button 
                onClick={scrollLeft} 
                className="absolute left-[-40px] top-[120px] -translate-y-1/2 z-10 p-2 cursor-pointer"
                aria-label="previous"
              >
                <svg width="13" height="21" viewBox="0 0 13 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10.0607 0L12.182 2.12132L4.24232 10.0607L12.182 18L10.0607 20.1213L0 10.0607L10.0607 0Z" fill="white" />
                </svg>
              </button>
              
              <div 
                id="anime-carousel" 
                className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x max-w-[750px]"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {animeList.map((anime, index) => (
                  <div key={index} className="flex-shrink-0 w-[172px] snap-start">
                    <AnimeSeriesCard 
                      title={anime.title}
                      imageUrl={anime.imageUrl}
                      imageAlt={anime.imageAlt}
                      href={anime.href}
                    />
                  </div>
                ))}
              </div>
              
              <button 
                onClick={scrollRight} 
                className="absolute right-20 top-[120px] -translate-y-1/2 z-10 p-2 cursor-pointer"
                aria-label="next"
              >
                <svg width="13" height="21" viewBox="0 0 13 21"  fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M1.04481 10L-8.61508e-07 8.94573L3.91053 5L-1.71613e-07 1.05427L1.04482 5.20478e-07L6 5L1.04481 10Z" fill="#FFFFFF" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Imagem fora do container, mas alinhada horizontalmente */}
          <div className="hidden md:block absolute right-[-100px] bottom-[-100px] w-[495px] h-[581px]">
          <div className="relative w-[495px] h-[581px] translate-y-[50px]">
              <Image 
                src="https://a.storyblok.com/f/178900/495x576/2f6ebc9944/news-hime-cob-3.png/m/filters:quality(95)format(webp)" 
                alt="Hime" 
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 495px"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EditorsChoicePage() {
  const animeList = [
    {
      title: "Solo Leveling",
      imageUrl: "https://a.storyblok.com/f/178900/1067x1601/0090e9bf15/solo-leveling-season-2-key-visual.png/m/172x262/filters:quality(95)format(webp)",
      imageAlt: "Solo Leveling Season 2 Key Visual",
      href: "https://www.crunchyroll.com/series/GDKHZEJ0K/solo-leveling"
    },
    {
      title: "Re:ZERO -Starting Life in Another World-",
      imageUrl: "https://a.storyblok.com/f/178900/849x1200/8682dbbe63/rezero-s3-counterattack-arc-kv.jpg/m/172x262/filters:quality(95)format(webp)",
      imageAlt: "Re:ZERO -Starting Life in Another World- Season 3 Counterattack Story Arc Key Visual",
      href: "https://www.crunchyroll.com/series/GRGG9798R/rezero--starting-life-in-another-world-"
    },
    {
      title: "ZENSHU",
      imageUrl: "https://a.storyblok.com/f/178900/1064x1596/ccff6ac8ca/zenshu-key-art-2.png/m/172x262/filters:quality(95)format(webp)",
      imageAlt: "Zenshu Key Art 2",
      href: "https://www.crunchyroll.com/series/G24H1NW8E/zenshu"
    },
    {
      title: "Dr. STONE",
      imageUrl: "https://a.storyblok.com/f/178900/960x1357/d42021c586/dr-stone-science-future-kv.jpeg/m/172x262/filters:quality(95)format(webp)",
      imageAlt: "Dr. STONE SCIENCE FUTURE",
      href: "https://www.crunchyroll.com/series/GYEXQKJG6/dr-stone"
    },
    {
      title: "Shangri-La Frontier",
      imageUrl: "https://a.storyblok.com/f/178900/1061x1500/67820aea3e/shangri-la-frontier-season-2-arc-visual.jpg/m/172x262/filters:quality(95)format(webp)",
      imageAlt: "Shangri-La Frontier Season 2 anime cour 2 key visual",
      href: "https://www.crunchyroll.com/series/G79H23Z8P/shangri-la-frontier"
    },
    {
      title: "The Apothecary Diaries",
      imageUrl: "https://a.storyblok.com/f/178900/240x360/254ce5bb24/the-apothecary-diaries-s2-240.png/m/172x262/filters:quality(95)format(webp)",
      imageAlt: "The Apothecary Diaries S2 240",
      href: "https://www.crunchyroll.com/series/G3KHEVDJ7/the-apothecary-diaries"
    },
    {
      title: "Honey Lemon Soda",
      imageUrl: "https://a.storyblok.com/f/178900/720x1080/3f3ba30f71/honey-lemon-soda-kv-tall.jpg/m/172x262/filters:quality(95)format(webp)",
      imageAlt: "Honey Lemon Soda Tall Key Visual",
      href: "https://www.crunchyroll.com/series/GMEHME77W/honey-lemon-soda"
    },
    {
      title: "The 100 Girlfriends",
      imageUrl: "https://a.storyblok.com/f/178900/1000x1413/e999e88ccf/the-100-girlfriends-who-really-really-really-really-really-love-you-season-2-key-visual.jpg/m/172x262/filters:quality(95)format(webp)",
      imageAlt: "The 100 Girlfriends Who Really, Really, Really, Really, REALLY Love You anime key visual",
      href: "https://www.crunchyroll.com/series/GNVHKN933/the-100-girlfriends-who-really-really-really-really-really-love-you"
    }
  ];

  return (
    <div className="flex justify-center items-center w-[100%] bg-gray-900">
      <main>
        <EditorsChoiceCarousel animeList={animeList} />
      </main>
    </div>
  );
}

