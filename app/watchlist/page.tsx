import { EmptyWatchlistState } from "@/app/components/EmptyWatchlistState";
import { getSession } from "@/lib/auth";
import { listWatchlistEntries } from "@/lib/services/watchlist.service";
import { listMangaWatchlistEntries } from "@/lib/services/manga-watchlist.service";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, BookOpen, Film } from "lucide-react";
import { WatchlistButton } from "@/app/components/WatchlistButton";
import { MangaWatchlistButton } from "@/app/components/MangaWatchlistButton";

function formatDate(date: string | null) {
  if (!date) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { type = "anime" } = await searchParams;
  const isManga = type === "manga";

  const animeEntries = await listWatchlistEntries(session.user.id);
  const mangaEntries = await listMangaWatchlistEntries(session.user.id);

  const hasEntries = isManga ? mangaEntries.length > 0 : animeEntries.length > 0;

  return (
    <main className="min-h-screen bg-[#111111] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-400">
            Your watchlist
          </p>
          <h1 className="text-4xl font-black tracking-tight text-white">Library</h1>
          <p className="max-w-2xl text-zinc-400">
            Organize favorites, track progress, and score every title on your list.
          </p>
        </div>

        <div className="mt-10 flex border-b border-zinc-800">
          <Link
            href="/watchlist?type=anime"
            className={`flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-bold transition ${
              !isManga
                ? "border-indigo-500 text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Film size={18} />
            Anime
            <span className="ml-1 rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
              {animeEntries.length}
            </span>
          </Link>
          <Link
            href="/watchlist?type=manga"
            className={`flex items-center gap-2 border-b-2 px-6 py-4 text-sm font-bold transition ${
              isManga
                ? "border-indigo-500 text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <BookOpen size={18} />
            Manga
            <span className="ml-1 rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
              {mangaEntries.length}
            </span>
          </Link>
        </div>

        {!hasEntries ? (
          <div className="mt-10">
            <EmptyWatchlistState />
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-800">
                <thead className="bg-zinc-900/80">
                  <tr className="text-left text-xs uppercase tracking-[0.25em] text-zinc-500">
                    <th className="px-6 py-4 font-semibold">{isManga ? "Manga" : "Anime"}</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Progress</th>
                    <th className="px-6 py-4 font-semibold">Score</th>
                    <th className="px-6 py-4 font-semibold">Dates</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {!isManga
                    ? animeEntries.map((entry) => (
                        <tr key={entry.id} className="align-top">
                          <td className="px-6 py-5">
                            <div className="flex min-w-[280px] items-start gap-4">
                              <Link
                                href={`/anime/${entry.anime.malId}/${entry.anime.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                                className="shrink-0 overflow-hidden rounded-2xl border border-zinc-800"
                              >
                                {entry.anime.imageUrl ? (
                                  <div className="relative h-28 w-20">
                                    <Image
                                      src={entry.anime.imageUrl}
                                      alt={entry.anime.title}
                                      fill
                                      sizes="80px"
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex h-28 w-20 items-center justify-center bg-zinc-900 text-xs text-zinc-500">
                                    No image
                                  </div>
                                )}
                              </Link>

                              <div className="min-w-0">
                                <Link
                                  href={`/anime/${entry.anime.malId}/${entry.anime.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                                  className="text-lg font-bold text-white transition hover:text-indigo-400"
                                >
                                  {entry.anime.title}
                                </Link>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {entry.isFavorite ? (
                                    <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                                      Favorite
                                    </span>
                                  ) : null}
                                  <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-300">
                                    {entry.anime.totalEpisodes ?? "?"} total episodes
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-sm font-semibold text-indigo-300">
                              {entry.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-sm text-zinc-300">
                            {entry.episodesWatched} / {entry.anime.totalEpisodes ?? "?"} episodes
                          </td>
                          <td className="px-6 py-5">
                            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm font-semibold text-zinc-200">
                              <Star size={14} className="text-amber-300" />
                              {entry.score ?? "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm text-zinc-400">
                            <p>Start: {formatDate(entry.startDate)}</p>
                            <p className="mt-1">Finish: {formatDate(entry.finishDate)}</p>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <WatchlistButton
                              malId={entry.anime.malId}
                              title={entry.anime.title}
                              episodes={entry.anime.totalEpisodes}
                              triggerLabel="Edit"
                              triggerClassName="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-indigo-500 hover:text-white"
                              initialEntry={{
                                status: entry.status,
                                episodesWatched: entry.episodesWatched,
                                score: entry.score,
                                startDate: entry.startDate,
                                finishDate: entry.finishDate,
                                isFavorite: entry.isFavorite,
                              }}
                            />
                          </td>
                        </tr>
                      ))
                    : mangaEntries.map((entry) => (
                        <tr key={entry.id} className="align-top">
                          <td className="px-6 py-5">
                            <div className="flex min-w-[280px] items-start gap-4">
                              <Link
                                href={`/manga/${entry.manga.malId}/${entry.manga.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                                className="shrink-0 overflow-hidden rounded-2xl border border-zinc-800"
                              >
                                {entry.manga.imageUrl ? (
                                  <div className="relative h-28 w-20">
                                    <Image
                                      src={entry.manga.imageUrl}
                                      alt={entry.manga.title}
                                      fill
                                      sizes="80px"
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex h-28 w-20 items-center justify-center bg-zinc-900 text-xs text-zinc-500">
                                    No image
                                  </div>
                                )}
                              </Link>

                              <div className="min-w-0">
                                <Link
                                  href={`/manga/${entry.manga.malId}/${entry.manga.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                                  className="text-lg font-bold text-white transition hover:text-indigo-400"
                                >
                                  {entry.manga.title}
                                </Link>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-300">
                                    {entry.manga.totalVolumes ?? "?"} volumes
                                  </span>
                                  <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-zinc-300">
                                    {entry.manga.totalChapters ?? "?"} chapters
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-sm font-semibold text-teal-300">
                              {entry.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-sm text-zinc-300">
                            <p>{entry.volumesRead} / {entry.manga.totalVolumes ?? "?"} volumes</p>
                            <p className="mt-1">{entry.chaptersRead} / {entry.manga.totalChapters ?? "?"} chapters</p>
                          </td>
                          <td className="px-6 py-5">
                            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm font-semibold text-zinc-200">
                              <Star size={14} className="text-amber-300" />
                              {entry.score ?? "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm text-zinc-400">
                            <p>Start: {formatDate(entry.startDate)}</p>
                            <p className="mt-1">Finish: {formatDate(entry.finishDate)}</p>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <MangaWatchlistButton
                              malId={entry.manga.malId}
                              title={entry.manga.title}
                              volumes={entry.manga.totalVolumes}
                              chapters={entry.manga.totalChapters}
                              triggerLabel="Edit"
                              triggerClassName="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-indigo-500 hover:text-white"
                              initialEntry={{
                                status: entry.status as any,
                                volumesRead: entry.volumesRead,
                                chaptersRead: entry.chaptersRead,
                                score: entry.score,
                                startDate: entry.startDate,
                                finishDate: entry.finishDate,
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
