import VideoListPage from "@/app/videos/components/VideoListPage";
import { listAnime } from "@/lib/services/anime.service";

const PAGE_SIZE = 30;

function getPageNumber(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(rawValue ?? "1", 10);

  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return page;
}

export function generateMetadata() {
  return {
    title: "Most Popular Anime",
    description: "Browse the most popular anime on PrimerAnimeList.",
  };
}

export default async function PopularPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  const page = getPageNumber(params.page);
  const result = await listAnime({
    page,
    limit: PAGE_SIZE,
    filter: "bypopularity",
  });
  const currentPage = Math.min(page, result.totalPages);

  return (
    <VideoListPage
      key={`popular-${currentPage}`}
      animes={result.items}
      title="Most Popular Anime"
      currentPage={currentPage}
      totalPages={result.totalPages}
      total={result.total}
      mode="popular"
    />
  );
}
