import Link from "next/link";
import Image from "next/image";

interface AnimeCardProps {
  malId: number;
  title: string;
  imageUrl: string | null;
  rating: string | null;
  score: number | null;
  members: number | null;
  season: string | null;
  episodes: number | null;
  synopsis: string | null;
}

export function AnimeCard({
  malId,
  title,
  imageUrl,
  rating,
  score,
  members,
  season,
  episodes,
  synopsis,
}: AnimeCardProps) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  return (
    <Link 
      href={`/anime/${malId}/${slug}`}
      className="group/card relative block w-full overflow-hidden transition-transform duration-200 hover:scale-105 h-[340px] sm:h-[380px]"
    >
      <div className="relative h-[82%] w-full overflow-hidden shadow-md transition-all duration-300 ease-in-out group-hover/card:h-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 200px, 250px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-200 dark:bg-zinc-800">
            <span className="text-xs text-zinc-500">No Image</span>
          </div>
        )}
      </div>
      
      <div className="py-2 h-[18%] flex items-start">
        <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
          {title}
        </h3>
      </div>

      <div className="absolute inset-0 flex flex-col justify-start overflow-hidden bg-black/85 px-3 pt-3 text-sm text-white opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 z-20">
          <h3 className="line-clamp-2 font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
            {title}
          </h3>
          <p className="line-clamp-1">Rating: {rating || "N/A"}</p>
          <p className="line-clamp-1">
            Score: {score?.toFixed(2) || "N/A"}
          </p>
          <p className="line-clamp-1">
            Members: {members ? members.toLocaleString() : "N/A"}
          </p>
          <p className="line-clamp-1 text-[#8c8c8c]">Season: {season || "N/A"}</p>
          <p className="line-clamp-1 text-[#8c8c8c]">Episodes: {episodes ?? "N/A"}</p>

          <p className="line-clamp-4 break-words leading-relaxed text-zinc-100">
            {synopsis || "No synopsis available."}
          </p>
      </div>
    </Link>
  );
}
