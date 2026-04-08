import { listManga } from "@/lib/services/manga.service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pageRaw = url.searchParams.get("page");
  const limitRaw = url.searchParams.get("limit");
  const filterRaw = url.searchParams.get("filter");

  const page = pageRaw ? Number.parseInt(pageRaw, 10) : undefined;
  const limit = limitRaw ? Number.parseInt(limitRaw, 10) : undefined;

  const data = await listManga({
    page,
    limit,
    filter: filterRaw ?? undefined,
  });

  return Response.json(data);
}

