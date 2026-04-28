import { notFound } from "next/navigation";
import GenreListPage from "../components/GenreListPage";
import { getGenreDefinition } from "../genre-config";
import { listAnimeByGenre } from "@/lib/services/anime.service";

const PAGE_SIZE = 50;

function getPageNumber(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(rawValue ?? "1", 10);

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return page;
}

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
    title: `Newest ${genreInfo.label} Anime`,
    description: `Browse the newest ${genreInfo.label.toLowerCase()} anime on PrimerAnimeList.`,
  };
}

export default async function GenreNewPage({
  params,
  searchParams,
}: {
  params: Promise<{ genre: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { genre } = await params;
  const genreInfo = getGenreDefinition(genre);

  if (!genreInfo) {
    notFound();
  }

  const paramsValue = await searchParams;
  const page = getPageNumber(paramsValue.page);
  const result = await listAnimeByGenre({
    genreName: genreInfo.label,
    sort: "newest",
    page,
    limit: PAGE_SIZE,
  });
  const currentPage = Math.min(page, result.totalPages);

  return (
    <GenreListPage
      genre={genre}
      genreInfo={genreInfo}
      pageTitle={`Newest ${genreInfo.label} Anime`}
      subtitle="Sorted by the most recent release dates in the current database."
      anime={result.items}
      currentPage={currentPage}
      totalPages={result.totalPages}
      total={result.total}
      basePath={`/videos/${genre}/new`}
      activeView="new"
    />
  );
}
