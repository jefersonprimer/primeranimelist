import { Suspense } from "react";
import { AnimeCarousel } from "@/app/components/AnimeCarousel";
import { MangaCarousel } from "@/app/components/MangaCarousel";
import { AnimeCarouselSkeleton } from "@/app/components/AnimeCarouselSkeleton";
import { HomeHeroAnimeCarousel } from "@/app/components/HomeHeroAnimeCarousel";
import { HomeHeroAnimeCarouselSkeleton } from "@/app/components/HomeHeroAnimeCarouselSkeleton";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Suspense fallback={<HomeHeroAnimeCarouselSkeleton />}>
        <HomeHeroAnimeCarousel />
      </Suspense>

      <div className="relative z-30 w-full sm:-mt-[7rem] pb-20">
        <Suspense fallback={<AnimeCarouselSkeleton title="Top Airing Anime" />}>
          <AnimeCarousel title="Top Airing Anime" filter="airing" />
        </Suspense>

        <MangaCarousel title="Top Popular Manga" filter="bypopularity" />

        <Suspense
          fallback={<AnimeCarouselSkeleton title="Anime da Temporada Atual" />}
        >
          <AnimeCarousel title="Anime da Temporada Atual" filter="season" />
        </Suspense>

        <Suspense
          fallback={<AnimeCarouselSkeleton title="Top Popular Anime" />}
        >
          <AnimeCarousel title="Top Popular Anime" filter="bypopularity" />
        </Suspense>

        <Suspense fallback={<AnimeCarouselSkeleton title="Upcoming Anime" />}>
          <AnimeCarousel title="Upcoming Anime" filter="upcoming" />
        </Suspense>
      </div>
    </div>
  );
}
