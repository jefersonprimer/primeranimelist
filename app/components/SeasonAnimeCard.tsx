import Image from "next/image";
import Link from "next/link";
import { Star, Users, Bookmark } from "lucide-react";

interface SeasonAnimeCardProps {
  anime: {
    malId: number;
    title: string;
    titleJapanese: string | null;
    titleEnglish: string | null;
    title_english?: string | null;
    imageUrl: string | null;
    type: string | null;
    season: string | null;
    year: number | null;
    episodes: number | null;
    duration: string | null;
    producers: string[] | null;
    licensors: string[] | null;
    genres: string[] | null;
    synopsis: string | null;
    studios: string[] | null;
    source: string | null;
    themes: string[] | null;
    demographics: string[] | null;
    score: number | null;
    members: number | null;
    airedFrom: Date | null;
  };
}

export function SeasonAnimeCard({ anime }: SeasonAnimeCardProps) {
  const slug = anime.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const englishTitle = anime.titleEnglish?.trim() || anime.title_english?.trim() || null;
  const primaryTitle = anime.title;
  const secondaryTitle = englishTitle && englishTitle !== primaryTitle ? englishTitle : null;
  
  const releaseMonth = anime.airedFrom 
    ? new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(anime.airedFrom))
    : anime.season;

  return (
    <div className="relative h-full w-full">
      <Link 
        href={`/anime/${anime.malId}/${slug}`}
        className="flex h-full w-full flex-col overflow-hidden border border-zinc-200/60 bg-white shadow-sm transition-all duration-300 dark:border-zinc-800/60 dark:bg-zinc-900/50"
      >
        {/* Header: Titles */}
        <div className="flex flex-col items-center justify-center py-2">
          <h2 className="line-clamp-2 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50 transition-colors">
            {primaryTitle}
          </h2>
          {secondaryTitle && (
            <h3 className="line-clamp-1 text-xs font-medium text-zinc-400 dark:text-zinc-500 italic">
              {secondaryTitle}
            </h3>
          )}
        </div>
      
        <div className="flex items-center justify-center text-[#a3a3a3] bg-[#181818] p-1 gap-2 text-xs font-medium">
          <span className="text-[#181818] bg-[#797979] px-1.5 py-0.5 rounded-md">
            {anime.type || "Special"}
          </span>
          <span className="tracking-wider">
            {releaseMonth} {anime.year}
          </span>
          <div className="flex items-center gap-2">
            {anime.episodes || "?"} eps, {anime.duration?.replace(" per ep", "")}
          </div>
        </div>  

        <div className="flex items-center justify-center bg-[#222222] p-1 flex-wrap gap-1.5">
          {[...(anime.genres || [])].slice(0, 3).map((genre) => (
            <span 
              key={genre} 
              className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[9px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 ring-1 ring-inset ring-zinc-200/50 dark:ring-zinc-700/50"
            >
              {genre}
            </span>
          ))}
        </div>

        {/* Info Grid Section */}
        <div className="flex flex-1 gap-0 overflow-hidden min-h-[220px]">
          {/* Image Container */}
          <div className="relative w-1/2 shrink-0 aspect-[3/4] overflow-hidden shadow-md ring-1 ring-zinc-200/50 dark:ring-zinc-800/50">
            {anime.imageUrl ? (
              <Image
                src={anime.imageUrl}
                alt={anime.title}
                fill
                className="object-cover transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                <span className="text-[10px] text-zinc-400">No Cover</span>
              </div>
            )}
          </div>


          {/* Details & Scrollable Synopsis */}
          <div className="flex w-1/2 flex-col min-w-0 p-3 h-full">
            <div className="relative flex-1 overflow-hidden">
              <div className="absolute inset-0 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 transition-colors pb-4">
                <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                  {anime.synopsis || "No synopsis available for this title."}
                </p>
                <div className="mt-4 space-y-1.5 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="font-bold text-zinc-400 dark:text-zinc-500 tracking-tighter">Studio</span>
                    <span className="truncate text-zinc-700 dark:text-zinc-300 font-medium">{anime.studios?.[0] || "N/A"}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="font-bold text-zinc-400 dark:text-zinc-500 tracking-tighter">Source</span>
                    <span className="truncate text-zinc-700 dark:text-zinc-300 font-medium">{anime.source}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="font-bold text-zinc-400 dark:text-zinc-500 tracking-tighter">Themes</span>
                    <span className="truncate text-zinc-700 dark:text-zinc-300 font-medium">
                      {anime.themes && anime.themes.length > 0 
                        ? anime.themes.slice(0, 3).join(", ") 
                        : "N/A"}
                    </span>
                  </div>

                </div>
              </div>
              {/* Fade out effect for synopsis bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent dark:from-zinc-900/50 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Footer: Metrics */}
        <div className="mt-auto flex items-center justify-center border-t border-zinc-100 bg-zinc-50/50 px-5 py-2 dark:border-zinc-800 dark:bg-zinc-800/30">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-black text-zinc-900 dark:text-zinc-50">
                {anime.score ? anime.score.toFixed(2) : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500">
              <Users className="h-3 w-3" />
              <span className="text-[10px] font-bold tracking-tighter">
                {anime.members?.toLocaleString() || 0}
              </span>
            </div>

            {/* TODO: feature to add my list, implement in after, not now */} 
            <button
              className="text-xs bg-[#3F5893] px-2 py-1 hover:cursor-pointer"
            >
              Add to my list
            </button>
          </div>
        </div>

      </Link>
    </div>
  );
}
