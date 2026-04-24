// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// interface Article {
//   id: string;
//   title: string;
//   imageUrl: string;
//   url: string;
//   tags: { name: string; url: string }[];
//   date: string;
//   author: { name: string; url: string };
// }

// interface SpotlightCarouselProps {
//   articles: Article[];
//   title?: string;
//   autoplayDuration?: number;
// }

// const SpotlightCarousel: React.FC<SpotlightCarouselProps> = ({
//   articles,
//   title = "Destaque",
//   autoplayDuration = 8000
// }) => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [autoplayState, setAutoplayState] = useState<'running' | 'paused'>('running');

//   useEffect(() => {
//     if (autoplayState === 'paused') return;

//     const interval = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % articles.length);
//     }, autoplayDuration);

//     return () => clearInterval(interval);
//   }, [activeIndex, articles.length, autoplayDuration, autoplayState]);

//   const handlePrev = () => {
//     setAutoplayState('paused');
//     setActiveIndex((prev) => (prev - 1 + articles.length) % articles.length);
//   };

//   const handleNext = () => {
//     setAutoplayState('paused');
//     setActiveIndex((prev) => (prev + 1) % articles.length);
//   };

//   const handleTabClick = (index: number) => {
//     setAutoplayState('paused');
//     setActiveIndex(index);
//   };

//   return (
//     <div className="w-full max-w-6xl mx-auto">
//       <div className="mb-6">
//         <div className="flex items-center border-b-2 border-cyan-400 pb-2">
//           <h2 className="text-xl font-bold">{title}</h2>
//         </div>
//       </div>

//       <div 
//         className="relative overflow-hidden" 
//         style={{ 
//           '--autoplay-duration': `${autoplayDuration}ms`, 
//           '--js-autoplay-state': autoplayState 
//         } as React.CSSProperties}
//       >
//         {/* Navigation Arrows */}
//         <button 
//           onClick={handlePrev}
//           className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-30 rounded-full p-3 hover:bg-opacity-50 transition-all"
//           aria-label="Previous slide"
//         >
//           <svg width="13" height="21" viewBox="0 0 13 21" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path fillRule="evenodd" clipRule="evenodd" d="M10.0607 0L12.182 2.12132L4.24232 10.0607L12.182 18L10.0607 20.1213L0 10.0607L10.0607 0Z" fill="white" />
//           </svg>
//         </button>
//         <button 
//           onClick={handleNext}
//           className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-30 rounded-full p-3 hover:bg-opacity-50 transition-all"
//           aria-label="Next slide"
//         >
//           <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path fillRule="evenodd" clipRule="evenodd" d="M1.04481 10L-8.61508e-07 8.94573L3.91053 5L-1.71613e-07 1.05427L1.04482 5.20478e-07L6 5L1.04481 10Z" fill="white" />
//           </svg>
//         </button>

//         {/* Carousel Content */}
//         <div className="relative">
//           <div className="whitespace-nowrap">
//             <div 
//               className="inline-flex transition-transform duration-300 ease-in-out" 
//               style={{ transform: `translateX(-${activeIndex * 100}%)` }}
//             >
//               {articles.map((article, index) => (
//                 <div 
//                   key={article.id} 
//                   className="w-full inline-block px-1"
//                   inert={index !== activeIndex ? "" : undefined}
//                 >
//                   <article className="relative">
//                     <div className="relative">
//                       <div className="aspect-video overflow-hidden rounded-t-lg">
//                         <Link href={article.url} className="block">
//                           <Image 
//                             src={article.imageUrl} 
//                             alt={article.title} 
//                             width={576} 
//                             height={324}
//                             className="w-full h-full object-cover"
//                           />
//                         </Link>
//                       </div>
//                     </div>
//                     <div 
//                       className="p-4 rounded-b-lg bg-cover"
//                       style={{ backgroundImage: `url('/images/spotlight-background.png')` }}
//                     >
//                       <div className="flex justify-between items-center mb-2">
//                         <div className="flex gap-2">
//                           {article.tags.map((tag, i) => (
//                             <Link key={i} href={tag.url}>
//                               <div className="text-xs bg-cyan-500 text-white px-2 py-1 rounded">
//                                 {tag.name}
//                               </div>
//                             </Link>
//                           ))}
//                         </div>
//                         <div className="text-xs text-white">
//                           {article.date}
//                         </div>
//                       </div>
//                       <Link href={article.url} className="block mb-3">
//                         <h3 className="text-lg font-bold text-white">
//                           {article.title}
//                         </h3>
//                       </Link>
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <Link href={article.author.url} className="text-sm text-white hover:underline">
//                             {article.author.name}
//                           </Link>
//                         </div>
//                         <div>
//                           <button className="text-cyan-400 p-1">
//                             <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
//                               <path fillRule="evenodd" clipRule="evenodd" d="M14.0003 0.666992C15.8413 0.666992 17.3337 2.15938 17.3337 4.00033C17.3337 5.84127 15.8413 7.33366 14.0003 7.33366C12.8462 7.33366 11.8291 6.7471 11.2308 5.85583L7.0481 7.64839C7.23166 8.06159 7.33366 8.51905 7.33366 9.00033C7.33366 9.4816 7.23166 9.93906 7.0481 10.3523L11.2308 12.1448C11.8291 11.2535 12.8462 10.667 14.0003 10.667C15.8413 10.667 17.3337 12.1594 17.3337 14.0003C17.3337 15.8413 15.8413 17.3337 14.0003 17.3337C12.1594 17.3337 10.667 15.8413 10.667 14.0003C10.667 13.9064 10.6709 13.8134 10.6785 13.7214L5.95814 11.6984C5.40843 12.098 4.7319 12.3337 4.00033 12.3337C2.15938 12.3337 0.666992 10.8413 0.666992 9.00033C0.666992 7.15938 2.15938 5.66699 4.00033 5.66699C4.7319 5.66699 5.40843 5.90267 5.95814 6.30224L10.6785 4.27923C10.6709 4.18727 10.667 4.09425 10.667 4.00033C10.667 2.15938 12.1594 0.666992 14.0003 0.666992ZM14.0003 2.33366C13.0799 2.33366 12.3337 3.07985 12.3337 4.00033C12.3337 4.9208 13.0799 5.66699 14.0003 5.66699C14.9208 5.66699 15.667 4.9208 15.667 4.00033C15.667 3.07985 14.9208 2.33366 14.0003 2.33366ZM12.3337 14.0003C12.3337 13.0799 13.0799 12.3337 14.0003 12.3337C14.9208 12.3337 15.667 13.0799 15.667 14.0003C15.667 14.9208 14.9208 15.667 14.0003 15.667C13.0799 15.667 12.3337 14.9208 12.3337 14.0003ZM4.00033 7.33366C3.07985 7.33366 2.33366 8.07985 2.33366 9.00033C2.33366 9.9208 3.07985 10.667 4.00033 10.667C4.9208 10.667 5.66699 9.9208 5.66699 9.00033C5.66699 8.07985 4.9208 7.33366 4.00033 7.33366Z" fill="#2ABDBB" />
//                             </svg>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </article>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Tabs/Indicator */}
//         <div className="mt-4 flex justify-center">
//           <div className="flex gap-2" role="tablist">
//             {articles.map((_, index) => (
//               <button
//                 key={index}
//                 role="tab"
//                 onClick={() => handleTabClick(index)}
//                 className={`w-2 h-2 rounded-full ${
//                   index === activeIndex ? 'bg-cyan-500' : 'bg-gray-300'
//                 }`}
//                 aria-selected={index === activeIndex}
//                 tabIndex={0}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SpotlightCarousel;


// como usar:


// import React from 'react';
// import SpotlightCarousel from '@/components/SpotlightCarousel';

// // Dados de exemplo baseados no conteúdo do carousel fornecido
// const articles = [
//   {
//     id: '1',
//     title: 'Animes da Temporada de Abril de 2025 na Crunchyroll',
//     imageUrl: 'https://a.storyblok.com/f/178900/1600x900/b5468b55d0/temporada-de-abril-de-2025-crunchyroll-16x9.jpg',
//     url: '/pt-br/news/seasonal-lineup/2025/3/19/abril-2025-animes-crunchyroll',
//     tags: [
//       { name: 'Guia da temporada', url: '/pt-br/news/seasonal-lineup' }
//     ],
//     date: 'Mar 19, 2025 1:00 PM -03',
//     author: { name: 'José S.', url: '/pt-br/news/author/jose-s' }
//   },
//   {
//     id: '2',
//     title: 'Filme Kaiju No. 8: Missão de Reconhecimento confirma data de lançamento nos cinemas do Brasil',
//     imageUrl: 'https://a.storyblok.com/f/178900/1920x1080/f29cd0c57a/kaiju-no-8-mission-recon.png',
//     url: '/pt-br/news/announcements/2025/3/18/filme-kaiju-no-8-missao-de-reconhecimento-anime-brasil-cinema',
//     tags: [
//       { name: 'Anúncios', url: '/pt-br/news/announcements' },
//       { name: 'Filmes', url: '/pt-br/news/movies' }
//     ],
//     date: 'Mar 18, 2025 1:00 PM -03',
//     author: { name: 'José S.', url: '/pt-br/news/author/jose-s' }
//   },
//   {
//     id: '3',
//     title: 'Aniplex e Crunchyroll anunciam uma empresa conjunta de produção de anime, HAYATE Inc.',
//     imageUrl: 'https://a.storyblok.com/f/178900/960x540/ec3f601e78/hayate_logo.jpg',
//     url: '/pt-br/news/announcements/2025/3/17/aniplex-e-crunchyroll-anunciam-hayate-inc',
//     tags: [
//       { name: 'Anúncios', url: '/pt-br/news/announcements' }
//     ],
//     date: 'Mar 17, 2025 3:00 PM -03',
//     author: { name: 'Crunchyroll Oficial', url: '/pt-br/news/author/crunchyroll-official' }
//   },
//   {
//     id: '4',
//     title: 'OVA SK8 the Infinity EXTRA PART já está disponível na Crunchyroll',
//     imageUrl: 'https://a.storyblok.com/f/178900/920x517/680cdf44e6/sk8-the-infinity-anime-ova.jpg',
//     url: '/pt-br/news/announcements/2025/3/19/ova-sk8-the-infinity-extra-part-disponivel-crunchyroll',
//     tags: [
//       { name: 'Anúncios', url: '/pt-br/news/announcements' }
//     ],
//     date: 'Mar 19, 2025 2:00 AM -03',
//     author: { name: 'Samir Fraiha', url: '/pt-br/news/author/samir-fraiha' }
//   },
//   {
//     id: '5',
//     title: 'Hiwou War Chronicles, primeiro anime do estúdio BONES, está disponível na Crunchyroll',
//     imageUrl: 'https://a.storyblok.com/f/178900/1297x960/4a91350627/hiwou-war-chronicles.JPG',
//     url: '/pt-br/news/announcements/2025/3/17/anime-hiwou-war-chronicles-na-crunchyroll',
//     tags: [
//       { name: 'Anúncios', url: '/pt-br/news/announcements' }
//     ],
//     date: 'Mar 17, 2025 7:25 PM -03',
//     author: { name: 'Samir Fraiha', url: '/pt-br/news/author/samir-fraiha' }
//   }
// ];

// export default function HomePage() {
//   return (
//     <main className="min-h-screen p-8">
//       <SpotlightCarousel 
//         articles={articles} 
//         title="Destaque" 
//         autoplayDuration={8000} 
//       />
//     </main>
//   );
// }

