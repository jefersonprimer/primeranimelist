import Link from "next/link";
import Image from "next/image";
import { Star, Bookmark, Crown } from "lucide-react";

interface MangaCardProps {
  malId: number;
  title: string;
  imageUrl: string | null;
  score?: number | null;
  type?: string | null;
  chapters?: number | null;
  volumes?: number | null;
  rank?: number;
}

export function MangaCard({ 
  malId, 
  title, 
  imageUrl, 
  score, 
  type, 
  chapters, 
  volumes,
  rank
}: MangaCardProps) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  const isTop3 = rank !== undefined && rank >= 1 && rank <= 3;
  
  const rankStyles = {
    1: {
      badge: "bg-yellow-400 text-black scale-125 -rotate-12",
      shadow: "shadow-[12px_12px_0px_0px_rgba(234,179,8,0.5)]",
      hoverShadow: "group-hover/manga:shadow-[16px_16px_0px_0px_rgba(234,179,8,0.7)]",
      border: "border-yellow-500 dark:border-yellow-400"
    },
    2: {
      badge: "bg-slate-300 text-black scale-110 -rotate-6",
      shadow: "shadow-[10px_10px_0px_0px_rgba(148,163,184,0.5)]",
      hoverShadow: "group-hover/manga:shadow-[14px_14px_0px_0px_rgba(148,163,184,0.7)]",
      border: "border-slate-400 dark:border-slate-300"
    },
    3: {
      badge: "bg-orange-400 text-black scale-105 -rotate-3",
      shadow: "shadow-[8px_8px_0px_0px_rgba(251,146,60,0.5)]",
      hoverShadow: "group-hover/manga:shadow-[12px_12px_0px_0px_rgba(251,146,60,0.7)]",
      border: "border-orange-500 dark:border-orange-400"
    }
  }[rank as 1 | 2 | 3] || {
    badge: "bg-zinc-900 text-white dark:bg-white dark:text-black",
    shadow: "shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]",
    hoverShadow: "group-hover/manga:shadow-[12px_12px_0px_0px_rgba(79,70,229,0.4)] dark:group-hover/manga:shadow-[12px_12px_0px_0px_rgba(129,140,248,0.3)]",
    border: "border-zinc-900 dark:border-white"
  };

  return (
    <Link 
      href={`/manga/${malId}/${slug}`}
      className="group/manga relative block w-full transition-all duration-500 ease-out"
    >
      {/* Rank Badge - Manga Style */}
      {rank && (
        <div className={`absolute -left-2 -top-2 z-30 flex h-10 w-10 items-center justify-center font-black italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover/manga:-rotate-12 group-hover/manga:scale-110 ${rankStyles.badge}`}>
          <div className="flex flex-col items-center leading-none">
            {rank === 1 && <Crown size={10} className="mb-0.5 fill-current" />}
            <span className={rank === 1 ? "text-base" : "text-lg"}># {rank}</span>
          </div>
        </div>
      )}

      <div className={`relative aspect-[2/3] w-full overflow-hidden border-2 bg-white transition-all duration-300 group-hover/manga:translate-x-[-4px] group-hover/manga:translate-y-[-4px] dark:bg-zinc-900 ${rankStyles.border} ${rankStyles.shadow} ${rankStyles.hoverShadow}`}>
        {/* Spine/Fold Effect */}
        <div className="absolute left-0 top-0 z-20 h-full w-4 bg-gradient-to-r from-black/20 via-black/5 to-transparent opacity-60" />
        
        {/* Halftone Overlay (only visible on hover or subtle) */}
        <div className="pointer-events-none absolute inset-0 z-10 opacity-0 mix-blend-multiply transition-opacity duration-300 group-hover/manga:opacity-10 dark:mix-blend-screen bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px]" />

        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover/manga:scale-105"
            sizes="(max-width: 768px) 150px, 200px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-50 dark:bg-zinc-800">
             <Bookmark className="h-10 w-10 text-zinc-300" />
          </div>
        )}

        {/* Score Ribbon */}
        {score && (
          <div className={`absolute bottom-3 right-0 z-20 px-2 py-1 text-[10px] font-black shadow-[-4px_4px_0px_0px_rgba(0,0,0,0.2)] ${isTop3 ? rankStyles.badge : "bg-indigo-600 text-white"}`}>
            {score.toFixed(2)}
          </div>
        )}
      </div>
      
      <div className="mt-4 px-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-black uppercase tracking-widest ${isTop3 ? (rank === 1 ? "text-yellow-600 dark:text-yellow-400" : rank === 2 ? "text-slate-500 dark:text-slate-400" : "text-orange-600 dark:text-orange-400") : "text-indigo-600 dark:text-indigo-400"}`}>
            {type || "Manga"}
          </span>
          <span className={`h-[1px] flex-1 ${isTop3 ? (rank === 1 ? "bg-yellow-200 dark:bg-yellow-900/50" : rank === 2 ? "bg-slate-200 dark:bg-slate-800/50" : "bg-orange-200 dark:bg-orange-900/50") : "bg-zinc-200 dark:bg-zinc-800"}`} />
        </div>
        
        <h3 className={`line-clamp-2 text-sm font-black leading-tight transition-colors uppercase tracking-tight ${isTop3 ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-900 dark:text-zinc-100"} group-hover/manga:text-indigo-600 dark:group-hover/manga:text-indigo-400`}>
          {title}
        </h3>
        
        <p className="mt-1 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 italic">
          {volumes ? `${volumes} Volumes` : chapters ? `${chapters} Chapters` : "Status Unknown"}
        </p>
      </div>
    </Link>
  );
}
