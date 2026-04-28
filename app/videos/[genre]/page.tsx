import { notFound } from "next/navigation";
import GenreOverviewPage from "./components/GenreOverviewPage";
import { getGenreDefinition } from "./genre-config";
import { listAnimeByGenre } from "@/lib/services/anime.service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ genre: string }>;
}) {
  const { genre } = await params;
  const genreInfo = getGenreDefinition(genre);

  if (!genreInfo) {
    return {
      title: "Genre Not Found",
      description: "The requested anime genre could not be found.",
    };
  }

  return {
    title: `${genreInfo.label} Anime`,
    description: `Browse ${genreInfo.label.toLowerCase()} anime on PrimerAnimeList.`,
  };
}

export default async function GenrePage({
  params,
}: {
  params: Promise<{ genre: string }>;
}) {
  const { genre } = await params;
  const genreInfo = getGenreDefinition(genre);

  if (!genreInfo) {
    notFound();
  }

  const [popularResult, newestResult] = await Promise.all([
    listAnimeByGenre({ genreName: genreInfo.label, sort: "popular", limit: 12 }),
    listAnimeByGenre({ genreName: genreInfo.label, sort: "newest", limit: 12 }),
  ]);

  return (
    <GenreOverviewPage
      genre={genre}
      genreInfo={genreInfo}
      popularAnime={popularResult.items}
      newestAnime={newestResult.items}
    />
  );
}
