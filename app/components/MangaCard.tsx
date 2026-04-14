import Link from "next/link";
import Image from "next/image";
import { Star, Bookmark } from "lucide-react";

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
  
  return (
    <Link 
      href={`/manga/${malId}/${slug}`}
      className="group/manga relative block w-full transition-all duration-500 ease-out"
    >
      {/* Rank Badge - Manga Style */}
      {rank && (
        <div className="absolute -left-2 -top-2 z-30 flex h-10 w-10 items-center justify-center bg-zinc-900 text-white dark:bg-white dark:text-black font-black italic shadow-[4px_4px_0px_0px_rgba(79,70,229,0.5)] transition-transform group-hover/manga:-rotate-12 group-hover/manga:scale-110">
          <span className="text-lg"># {rank}</span>
        </div>
      )}

      <div className="relative aspect-[2/3] w-full overflow-hidden border-2 border-zinc-900 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] transition-all duration-300 group-hover/manga:translate-x-[-4px] group-hover/manga:translate-y-[-4px] group-hover/manga:shadow-[12px_12px_0px_0px_rgba(79,70,229,0.4)] dark:border-white dark:bg-zinc-900 dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)] dark:group-hover/manga:shadow-[12px_12px_0px_0px_rgba(129,140,248,0.3)]">
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
          <div className="absolute bottom-3 right-0 z-20 bg-indigo-600 px-2 py-1 text-[10px] font-black text-white shadow-[-4px_4px_0px_0px_rgba(0,0,0,0.2)]">
            {score.toFixed(2)}
          </div>
        )}
      </div>
      
      <div className="mt-4 px-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            {type || "Manga"}
          </span>
          <span className="h-[1px] flex-1 bg-zinc-200 dark:bg-zinc-800" />
        </div>
        
        <h3 className="line-clamp-2 text-sm font-black leading-tight text-zinc-900 transition-colors group-hover/manga:text-indigo-600 dark:text-zinc-100 dark:group-hover/manga:text-indigo-400 uppercase tracking-tight">
          {title}
        </h3>
        
        <p className="mt-1 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 italic">
          {volumes ? `${volumes} Volumes` : chapters ? `${chapters} Chapters` : "Status Unknown"}
        </p>
      </div>
    </Link>
  );
}
