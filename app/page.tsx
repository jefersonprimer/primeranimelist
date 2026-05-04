import { Suspense } from "react";
import { AnimeCarousel } from "@/app/components/AnimeCarousel";
import { MangaCarousel } from "@/app/components/MangaCarousel";
import { AnimeCarouselSkeleton } from "@/app/components/AnimeCarouselSkeleton";
import { HomeHeroAnimeCarousel } from "@/app/components/HomeHeroAnimeCarousel";
import { HomeHeroAnimeCarouselSkeleton } from "@/app/components/HomeHeroAnimeCarouselSkeleton";
import OutdoorCard from "./components/outdoors/OutdoorCard";
import Outdoor from "./components/outdoors/Outdoor";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Suspense fallback={<HomeHeroAnimeCarouselSkeleton />}>
        <HomeHeroAnimeCarousel />
      </Suspense>

      <div className="relative z-30 w-full -mt-14 md:-32 lg:-mt-45 xl:-mt-70 pb-20">
        <Suspense fallback={<AnimeCarouselSkeleton title="Top Airing Anime" />}>
          <AnimeCarousel title="Top Airing Anime" filter="airing" />
        </Suspense>

        <MangaCarousel title="Top Popular Manga" filter="bypopularity" />

        <Suspense
          fallback={<AnimeCarouselSkeleton title="Anime da Temporada Atual" />}
        >
          <AnimeCarousel title="Anime da Temporada Atual" filter="season" />
        </Suspense>

        <OutdoorCard
          link="https://www.crunchyroll.com/pt-br/series/G9VHN9QXQ/unnamed-memory"
          imageUrl="https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=1350/CurationAssets/Dekin%20no%20Mogura%20The%20Earthbound%20Mole/SEASON%201/MARKETING%20BANNER/DekinNoMoguraTheEarthboundMole-S1C1-KV1-(Character)-Banner-2100x700-PT.png"
        />

        <Suspense
          fallback={<AnimeCarouselSkeleton title="Top Popular Anime" />}
        >
          <AnimeCarousel title="Top Popular Anime" filter="bypopularity" />
        </Suspense>

        <Suspense fallback={<AnimeCarouselSkeleton title="Upcoming Anime" />}>
          <AnimeCarousel title="Upcoming Anime" filter="upcoming" />
        </Suspense>

        <Outdoor
          imageUrl="https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=600/catalog/crunchyroll/a249096c7812deb8c3c2c907173f3774.jpg"
          audiotype="Leg | Dub"
          description="Embarque em uma jornada com One Piece. A épica série de anime criada pelo renomado Eiichiro Oda é um fenômeno, cativando corações de fãs de várias gerações ao longo de seus 25 anos de existência. Esta aventura em alto-mar é..."
          buttonLink="https://www.crunchyroll.com/pt-br/series/G9VHN9QXQ/unnamed-memory"
          addToQueueLink="#"
          title="One Piece"
        />
      </div>
    </div>
  );
}
