import { getMangaByMalId } from "@/lib/services/manga.service";
import { ArrowBigLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminDetailEditButton } from "@/app/components/AdminDetailEditButton";

function toNameList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "name" in item && typeof (item as any).name === "string") {
        return (item as any).name as string;
      }
      return null;
    })
    .filter((v): v is string => typeof v === "string" && v.length > 0);
}

export async function generateMetadata({ params }: { params: Promise<{ mal_id: string; title: string }> }) {
  const { mal_id } = await params;
  const malId = Number.parseInt(mal_id, 10);

  if (!Number.isFinite(malId) || malId <= 0) {
    return { title: "Manga not found" };
  }

  const manga = await getMangaByMalId(malId);

  if (!manga) {
    return { title: "Manga not found" };
  }

  return {
    title: `${manga.title} - PrimerAnimeList`,
    description: manga.synopsis?.slice(0, 160) ?? `View details for ${manga.title}`,
  };
}

export default async function MangaDetailPage({ params }: { params: Promise<{ mal_id: string; title: string }> }) {
  const { mal_id, title: _title } = await params;
  const malId = Number.parseInt(mal_id, 10);

  if (!Number.isFinite(malId) || malId <= 0) {
    notFound();
  }

  const manga = await getMangaByMalId(malId);

  if (!manga) {
    notFound();
  }

  const genres = toNameList(manga.genres);
  const authors = toNameList(manga.authors);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-50 py-12 dark:bg-zinc-950/40">
      {/* Background Pattern matched from MangaCarousel */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col gap-12">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/manga/top"
            className="group inline-flex w-fit items-center gap-4 bg-zinc-900 dark:bg-zinc-100 px-6 py-3 text-xs font-black uppercase tracking-widest text-white dark:text-black transition-all hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white border-2 border-zinc-900 dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              <ArrowBigLeft />
            </span>
            BACK TO TOP MANGA
          </Link>
          <AdminDetailEditButton kind="manga" malId={malId} />
        </div>

        <div className="flex flex-col gap-12 md:flex-row items-start">
          <div className="flex-shrink-0 relative group self-center md:self-start">
            {/* Manga Image with Spine and Halftone effect from MangaCard */}
            {manga.imageUrl ? (
              <div className="relative h-[480px] w-[320px] overflow-hidden border-4 border-zinc-900 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.05)] transition-transform duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2">
                {/* Spine Effect */}
                <div className="absolute left-0 top-0 z-20 h-full w-6 bg-gradient-to-r from-black/20 via-black/5 to-transparent opacity-60" />
                
                {/* Halftone Overlay */}
                <div className="pointer-events-none absolute inset-0 z-10 opacity-5 mix-blend-multiply bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px]" />
                
                <Image
                  src={manga.imageUrl}
                  alt={manga.title}
                  fill
                  className="object-cover"
                  sizes="320px"
                  priority
                />
                <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 font-black border-l-4 border-b-4 border-zinc-900 dark:border-white">
                  {manga.type?.toUpperCase() || "MANGA"}
                </div>
              </div>
            ) : (
              <div className="flex h-[480px] w-[320px] items-center justify-center bg-zinc-200 dark:bg-zinc-800 border-4 border-zinc-900 dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-sm text-zinc-400 font-black tracking-widest uppercase">No Scan Data</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-8 flex-1">
            <div className="relative">
              <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 mb-2">
                Series Identity
              </span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase italic leading-none mb-4">
                {manga.title}
              </h1>
              <div className="flex gap-1 mb-6">
                <div className="h-2 w-20 bg-indigo-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]" />
                <div className="h-2 w-8 bg-zinc-900 dark:bg-zinc-100" />
                <div className="h-2 w-4 bg-zinc-300 dark:bg-zinc-700" />
              </div>
              
              {(manga.titleEnglish || manga.titleJapanese) && (
                <div className="space-y-1 border-l-4 border-zinc-200 dark:border-zinc-800 pl-4 py-2">
                  {manga.titleEnglish && (
                    <p className="text-lg font-bold text-zinc-500 dark:text-zinc-400 italic">
                      {manga.titleEnglish}
                    </p>
                  )}
                  {manga.titleJapanese && (
                    <p className="text-xl font-black text-zinc-400 dark:text-zinc-600">
                      {manga.titleJapanese}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              {manga.rank && (
                <div className="bg-yellow-400 text-black px-5 py-2 border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-xl italic -rotate-2">
                  RANK #{manga.rank}
                </div>
              )}
              {manga.score && (
                <div className="bg-indigo-600 text-white px-5 py-2 border-2 border-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-xl italic rotate-2">
                  ★ {manga.score.toFixed(2)}
                </div>
              )}
              {manga.status && (
                <div className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white px-5 py-2 border-2 border-zinc-900 dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] font-black text-lg">
                  {manga.status.toUpperCase()}
                </div>
              )}
            </div>

            {manga.synopsis && (
              <div className="bg-white dark:bg-zinc-900/50 border-2 border-zinc-900 dark:border-white p-8 shadow-[8px_8px_0px_0px_rgba(79,70,229,0.2)]">
                <h2 className="text-xs font-black mb-4 uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
                  Data // Log Content
                </h2>
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium italic">
                    {manga.synopsis}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Members", value: manga.members?.toLocaleString(), color: "bg-zinc-100 dark:bg-zinc-800" },
                { label: "Favorites", value: manga.favorites?.toLocaleString(), color: "bg-zinc-100 dark:bg-zinc-800" },
                { label: "Popularity", value: `#${manga.popularity}`, color: "bg-zinc-100 dark:bg-zinc-800" },
                { label: "Volumes", value: manga.volumes || "??", color: "bg-zinc-100 dark:bg-zinc-800" }
              ].map((stat, i) => (
                <div key={i} className={`${stat.color} border-2 border-zinc-900 dark:border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)]`}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50 italic leading-none">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 mt-4">
              {genres.length > 0 && (
                <div className="flex-1">
                  <h3 className="text-sm font-black mb-4 uppercase tracking-[0.2em] text-zinc-900 dark:text-white flex items-center gap-2">
                    <div className="h-4 w-1 bg-indigo-600" />
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre, idx) => (
                      <span
                        key={`${genre}-${idx}`}
                        className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border-2 border-zinc-900 dark:border-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-colors"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {authors.length > 0 && (
                <div className="flex-1">
                  <h3 className="text-sm font-black mb-4 uppercase tracking-[0.2em] text-zinc-900 dark:text-white flex items-center gap-2">
                    <div className="h-4 w-1 bg-zinc-900 dark:bg-white" />
                    Authors
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {authors.map((author, idx) => (
                      <span
                        key={`${author}-${idx}`}
                        className="bg-zinc-900 text-white dark:bg-white dark:text-black px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                      >
                        {author}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {manga.background && (
              <div className="mt-8 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800 pt-8">
                <h2 className="text-xs font-black mb-4 uppercase tracking-[0.3em] text-zinc-400">Background // History</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-bold italic leading-relaxed">
                  {manga.background}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

