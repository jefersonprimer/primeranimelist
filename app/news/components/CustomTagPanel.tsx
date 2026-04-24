import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const CustomTagPanel: React.FC = () => {
  const posts = [
    {
      id: 1,
      image: 'https://a.storyblok.com/f/178900/960x540/98a418e192/assassins-creed-shadows-mackenyu.jpg/m/576x0/filters:quality(95)format(webp)',
      tags: ['Entrevistas', 'Videogames'],
      date: 'Feb 25, 2025 12:00 PM -03',
      title: 'Mackenyu fala sobre o live-action de One Piece e Assassin’s Creed Shadows',
      author: 'Fábio Portugal',
      link: '/pt-br/news/interviews/2025/2/25/mackenyu-assassins-creed-one-piece-entrevista',
    },
    {
      id: 2,
      image: 'https://a.storyblok.com/f/178900/960x540/bc0422bcf7/have-you-heard-vaundy.png/m/576x0/filters:quality(95)format(webp)',
      tags: ['Entrevistas', 'Música'],
      date: 'Feb 10, 2025 1:00 PM -03',
      title: 'Descubra mais sobre Vaundy em entrevista exclusiva com o cantor',
      author: 'Talles Queiroz',
      link: '/pt-br/news/interviews/2025/2/10/vaundy-animes-favoritos-entrevista-exclusiva',
    },
    {
      id: 3,
      image: 'https://a.storyblok.com/f/178900/960x540/5db61c138c/luffy-in-one-piece.jpg/m/576x0/filters:quality(95)format(webp)',
      tags: ['Entrevistas', 'Música'],
      date: 'Jan 28, 2025 3:00 PM -03',
      title: 'Banda Chilli Beans. fala sobre a jornada para chegar ao encerramento de One Piece',
      author: 'José S.',
      link: '/pt-br/news/interviews/2025/1/28/one-piece-encerramento-banda-chilli-beans-entrevista',
    },
    {
      id: 4,
      image: 'https://a.storyblok.com/f/178900/960x540/89df564f1b/demon-slayer-giyu.jpg/m/576x0/filters:quality(95)format(webp)',
      tags: ['Entrevistas'],
      date: 'Dec 26, 2024 10:00 AM -03',
      title: 'Dubladores originais de Giyu e Muichiro, de Demon Slayer, falam sobre o crescimento de seus personagens',
      author: 'Samir Fraiha',
      link: '/pt-br/news/interviews/2024/12/26/entrevista-demon-slayer-giyu-muichiro',
    }, 
    {
        id: 5,
        image: 'https://a.storyblok.com/f/178900/960x540/89df564f1b/demon-slayer-giyu.jpg/m/576x0/filters:quality(95)format(webp)',
        tags: ['Entrevistas'],
        date: 'Dec 26, 2024 10:00 AM -03',
        title: 'Dubladores originais de Giyu e Muichiro, de Demon Slayer, falam sobre o crescimento de seus personagens',
        author: 'Samir Fraiha',
        link: '/pt-br/news/interviews/2024/12/26/entrevista-demon-slayer-giyu-muichiro',
      },
    // Adicione mais posts conforme necessário
  ];

  return (
    <section className="mt-4 mb-4">
      <div
        className="bg-cover bg-center py-12"
        style={{ backgroundImage: 'url("https://a.storyblok.com/f/178900/1439x469/cfbf9eb91a/custom_tag_background_circles.png/m/filters:quality(95)format(webp)")' }}
      >
        <div className="container mx-auto w-[1200px] bg-[#000000] py-6 px-12">
          <h2 className="text-2xl font-bold text-[#F47521] mb-6">Entrevistas</h2>
          <div className="relative">
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              spaceBetween={25}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
            >
              {posts.map((post) => (
                <SwiperSlide key={post.id}>
                  <article className="bg-[#000000]  shadow-md overflow-hidden">
                    <div className="relative">
                      <a href={post.link}>
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={576}
                          height={324}
                          className="w-full h-auto"
                          loading="lazy"
                        />
                      </a>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex space-x-2">
                          {post.tags.map((tag, index) => (
                            <span key={index} className="bg-[#2B2D32] text-[#2AB1B0] text-sm px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                        <span className="text-sm text-[#A0A0A0]">{post.date}</span>
                      <a href={post.link}>
                        <h3 className="text-lg font-semibold mb-2 text-[#FFFFFF]">{post.title}</h3>
                      </a>
                      <div className="flex justify-between items-center">
                        <div>
                          <a href={`/pt-br/news/author/${post.author.toLowerCase().replace(/ /g, '-')}`} className="text-sm text-[#2AB1B0]">
                            {post.author}
                          </a>
                        </div>
                       
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="swiper-button-prev absolute top-1/2 left-0 p-2 z-10 cursor-pointer hover:bg-[#2B2D32]">
            <svg
                width="3" // Metade de 13
                height="5" // Metade de 21
                viewBox="0 0 6 " // Mantém o viewBox original
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-white" // Garante que a seta seja branca
            >
                <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.0607 0L12.182 2.12132L4.24232 10.0607L12.182 18L10.0607 20.1213L0 10.0607L10.0607 0Z"
                />
            </svg>
            </div>
            <div className="swiper-button-next absolute top-1/2 right-0 p-2 z-10 cursor-pointer hover:bg-[#2B2D32]">
            <svg
                width="3" // Metade de 6
                height="5" // Metade de 10
                viewBox="0 0 6 10" // Mantém o viewBox original
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-white" // Garante que a seta seja branca
            >
                <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.04481 10L-8.61508e-07 8.94573L3.91053 5L-1.71613e-07 1.05427L1.04482 5.20478e-07L6 5L1.04481 10Z"
                />
            </svg>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomTagPanel;

