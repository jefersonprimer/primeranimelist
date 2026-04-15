import Link from "next/link";
import Image from "next/image";
import { Star, Users } from "lucide-react";
import { RatingIcon10 } from "./RatingIcon10";
import { RatingIcon12 } from "./RatingIcon12";
import { RatingIcon14 } from "./RatingIcon14";
import { RatingIcon16 } from "./RatingIcon16";
import { RatingIcon18 } from "./RatingIcon18";
import RatingIconAL from "./RatingIconAL";

interface AnimeCardProps {
  malId: number;
  title: string;
  imageUrl: string | null;
  rating: string | null;
  score: number | null;
  members: number | null;
  episodes: number | null;
  synopsis: string | null;
}

function getSeasonCountFromTitle(title: string): number | null {
  const normalizedTitle = title.toLowerCase();

  if (/\b(movie|film|ova|ona|special)\b/.test(normalizedTitle)) {
    return null;
  }

  const explicitSeasonMatch = normalizedTitle.match(
    /\b(?:season\s*(\d+)|(\d+)(?:st|nd|rd|th)\s+season)\b/
  );
  if (explicitSeasonMatch) {
    const value = Number.parseInt(explicitSeasonMatch[1] ?? explicitSeasonMatch[2], 10);
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  const wordSeasonMap: Record<string, number> = {
    second: 2,
    third: 3,
    fourth: 4,
    fifth: 5,
    sixth: 6,
    seventh: 7,
    eighth: 8,
    ninth: 9,
    tenth: 10,
  };

  for (const [word, count] of Object.entries(wordSeasonMap)) {
    if (new RegExp(`\\b${word}\\s+season\\b`).test(normalizedTitle)) {
      return count;
    }
  }

  return 1;
}

function getRatingIcon(rating: string | null) {
  if (!rating) return null;

  const normalizedRating = rating.toLocaleLowerCase();

  if (
    /^rx\b/.test(normalizedRating) ||
    /hentai|adult|18\+|r18|a18|18 anos/.test(normalizedRating)
  ) {
    return <RatingIcon18 />;
  }

  if (/^r\b|r\+|nudity|17\+|a16|16 anos|mature/.test(normalizedRating)) {
    return <RatingIcon16 />;
  }

  if (/pg-13|teens|13\+|a14|14 anos/.test(normalizedRating)) {
    return <RatingIcon14 />;
  }

  if (/kids|children|a12|12 anos/.test(normalizedRating)) {
    return <RatingIcon12 />;
  }

  if (/^pg\b|a10|10 anos/.test(normalizedRating)) {
    return <RatingIcon10 />;
  }

  if (/^g\b|all ages|livre/.test(normalizedRating)) {
    return <RatingIconAL />;
  }

  return null;
}

export function AnimeCard({
  malId,
  title,
  imageUrl,
  rating,
  score,
  members,
  episodes,
  synopsis,
}: AnimeCardProps) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const seasonCount = getSeasonCountFromTitle(title);
  const ratingIcon = getRatingIcon(rating);
  
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

      <div className="absolute inset-0 flex flex-col justify-start overflow-hidden bg-black/85 px-3 pt-4 text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 z-20">
          <h3 className="py-2 line-clamp-2 font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
            {title}
          </h3>

          <div className="flex items-center gap-2">
            {ratingIcon}
          <p className="flex items-center gap-1 line-clamp-1 text-[#bbb]">
            <Star size={16}/> {score?.toFixed(2) || "N/A"}
          </p>
          <p className="flex items-center gap-1 line-clamp-1 text-[#bbb]">
            <Users size={16}/> {members ? members.toLocaleString() : "N/A"}
          </p>

          </div>

          <p className="line-clamp-1 text-[#8c8c8c]">Seasons: {seasonCount ?? "N/A"}</p>
          <p className="line-clamp-1 text-[#8c8c8c]">Episodes: {episodes ?? "N/A"}</p>

          <p className="line-clamp-4 break-words leading-relaxed font-medium text-zinc-100">
            {synopsis || "No synopsis available."}
          </p>
      </div>
    </Link>
  );
}
