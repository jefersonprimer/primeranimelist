import React from "react";
import Link from "next/link";
import Image from "next/image";

interface OutdoorProps {
  imageUrl: string;
  title: string;
  audiotype: string;
  description: string;
  buttonLink?: string;
  addToQueueText?: string;
  addToQueueLink?: string;
  loading?: boolean;
}

const OutdoorSkeleton: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full my-[100px]">
      <div className="flex justify-center items-center p-6 shadow-md w-auto h-auto lg:w-[1351px] lg:h-[335.53px] animate-pulse">
        <div className="flex justify-between items-center w-auto h-auto lg:w-[1223px] lg:h-[335.53px] flex-col min-[500px]:flex-col min-[568px]:flex-row">
          <div className="w-auto h-auto lg:w-[596.5px] lg:h-[335.53px] overflow-hidden">
            {/* Image skeleton */}
            <div className="w-full h-full bg-[#141519]" />
          </div>
          <div className="flex-1 h-[212px] px-6 flex flex-col justify-center">
            {/* Title skeleton */}
            <div className="w-2/3 h-7 bg-[#141519] mb-4" />
            {/* Audiotype skeleton */}
            <div className="w-1/3 h-5 bg-[#141519] mb-4" />
            {/* Description skeleton */}
            <div className="w-full h-5 bg-[#141519] mb-2" />
            <div className="w-5/6 h-5 bg-[#141519] mb-2" />
            <div className="w-4/6 h-5 bg-[#141519] mb-4" />
            {/* Buttons skeleton */}
            <div className="flex gap-2">
              <div className="w-40 h-10 bg-[#141519]" />
              <div className="w-40 h-10 bg-[#141519]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Outdoor: React.FC<OutdoorProps> = ({
  imageUrl,
  title,
  audiotype,
  description,
  buttonLink = "#",
  addToQueueText = "#",
  addToQueueLink = "#",
  loading = false,
}) => {
  return (
    <div className="flex justify-center items-center w-full lg:my-[100px]">
      <div className="flex justify-center items-center p-6 shadow-md bg-black w-auto h-auto lg:w-[1351px] lg:h-[335.53px]">
        <div className="flex justify-between items-center w-auto h-auto lg:w-[1223px] lg:h-[335.53px] flex-col min-[500px]:flex-col min-[568px]:flex-row">
          <div className="w-auto h-auto lg:w-[596.5px] lg:h-[335.53px] overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              width={596.5}
              height={335.53}
            />
          </div>
          <div className="flex-1 h-[212px] lg:px-6 flex flex-col justify-center">
            <h2 className="text-2xl mb-4 text-[#FFFFFF] cursor-pointer">
              <Link
                href="/pt-br/series/G1XHJV0D8/can-a-boy-girl-friendship-survive"
                className="hover:underline"
              >
                {title}
              </Link>
            </h2>
            <h2 className="text-base mb-4 text-[#A0A0A0] flex items-center justify-between sm:block">
              <span>{audiotype}</span>
              {/* SVG sozinho em telas sm ou menores */}
              <span className="flex sm:hidden items-center">
                <svg
                  className="w-5 h-5 fill-[#FF640A] max-[768px]:fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-labelledby="watchlist-svg"
                  role="img"
                >
                  <title id="watchlist-svg">Watchlist</title>
                  <path d="M17 18.113l-3.256-2.326A2.989 2.989 0 0 0 12 15.228c-.629 0-1.232.194-1.744.559L7 18.113V4h10v14.113zM18 2H6a1 1 0 0 0-1 1v17.056c0 .209.065.412.187.581a.994.994 0 0 0 1.394.233l4.838-3.455a1 1 0 0 1 1.162 0l4.838 3.455A1 1 0 0 0 19 20.056V3a1 1 0 0 0-1-1z" />
                </svg>
              </span>
            </h2>
            <p className="text-base mb-4 leading-relaxed text-[#FFFFFF] max-[768px]:overflow-hidden max-[768px]:text-ellipsis max-[768px]:line-clamp-3">
              {description}
            </p>
            <div className="flex gap-2">
              {buttonLink && (
                <Link
                  href={buttonLink}
                  className="flex items-center justify-center w-full sm:w-auto py-2.5 px-5 opacity-90 hover:opacity-100 bg-[#FF640A] text-black font-bold no-underline text-sm max-[768px]"
                >
                  <span className="flex items-center gap-2 justify-center w-full">
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      aria-labelledby="play-svg"
                      aria-hidden="false"
                      role="img"
                    >
                      <path d="M5.944 3C5.385 3 5 3.445 5 4.22v16.018c0 .771.384 1.22.945 1.22.234 0 .499-.078.779-.243l13.553-7.972c.949-.558.952-1.468 0-2.028L6.724 3.243C6.444 3.078 6.178 3 5.944 3m1.057 2.726l11.054 6.503L7 18.732l.001-13.006" />
                    </svg>
                    <span>COMEÇAR A ASSISTIR E1</span>
                  </span>
                </Link>
              )}
              {/* Botão completo só em telas maiores */}
              {addToQueueText && addToQueueLink && (
                <Link
                  href={addToQueueLink}
                  className="hidden sm:inline-block px-5 py-2.5 bg-transparent text-white no-underline text-sm border-2 border-[#FF640A]
                    max-[768px]:bg-[#555] max-[768px]:border-none max-[768px]:"
                >
                  <div className="relative group">
                    <span className="hidden group-hover:block absolute bg-black/80 text-white px-2.5 py-1.5  text-xs whitespace-nowrap -top-7 left-1/2 -translate-x-1/2">
                      Add to Watchlist
                    </span>
                    <div className="flex items-center gap-2 text-[#FF640A] max-[768px]:text-white">
                      <svg
                        className="w-5 h-5 fill-[#FF640A] max-[768px]:fill-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        aria-labelledby="watchlist-svg"
                        role="img"
                      >
                        <title id="watchlist-svg">Watchlist</title>
                        <path d="M17 18.113l-3.256-2.326A2.989 2.989 0 0 0 12 15.228c-.629 0-1.232.194-1.744.559L7 18.113V4h10v14.113zM18 2H6a1 1 0 0 0-1 1v17.056c0 .209.065.412.187.581a.994.994 0 0 0 1.394.233l4.838-3.455a1 1 0 0 1 1.162 0l4.838 3.455A1 1 0 0 0 19 20.056V3a1 1 0 0 0-1-1z" />
                      </svg>
                      <span>ADICIONAR À LISTA</span>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Outdoor;
