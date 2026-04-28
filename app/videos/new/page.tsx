import VideoListPage from "@/app/videos/components/VideoListPage";
import { listNewestAnime } from "@/lib/services/anime.service";

const PAGE_SIZE = 50;

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
    title: "Newest Anime",
    description: "Browse the latest anime added to PrimerAnimeList.",
  };
}

export default async function NewPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  const page = getPageNumber(params.page);
  const result = await listNewestAnime({ page, limit: PAGE_SIZE });
  const currentPage = Math.min(page, result.totalPages);

  return (
    <VideoListPage
      animes={result.items}
      title="Newest Anime"
      currentPage={currentPage}
      totalPages={result.totalPages}
      total={result.total}
      basePath="/videos/new"
    />
  );
}
