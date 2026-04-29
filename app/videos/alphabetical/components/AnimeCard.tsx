import Image from "next/image";
import Link from "next/link";
import { Star, Users } from "lucide-react";

type AlphabeticalAnime = {
  malId: number;
  title: string;
  imageUrl: string | null;
  imageCardCompact: string | null;
  score: number | null;
  members: number | null;
  episodes: number | null;
  synopsis: string | null;
};

interface AnimeCardProps {
  anime: AlphabeticalAnime;
}

function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatMembers(members: number | null) {
  if (!members) return null;
  return new Intl.NumberFormat("en-US", {
    notation: members >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(members);
}

const AnimeCard = ({ anime }: AnimeCardProps) => {
  const slug = slugifyTitle(anime.title) || "anime";
  const imageSrc = anime.imageCardCompact || anime.imageUrl;
  const formattedMembers = formatMembers(anime.members);

  return (
    <Link
      href={`/anime/${anime.malId}/${slug}`}
      className="group flex w-full gap-5 p-2 transition-all duration-300 hover:bg-zinc-900/90"
    >
      <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden bg-zinc-900 shadow-lg">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
            No Image
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col py-0.5">
        <h2 className="line-clamp-1 text-lg font-bold text-zinc-100 transition-colors group-hover:text-white">
          {anime.title}
        </h2>

        {/* Stats: Visible on Hover */}
        <div className="flex h-0 opacity-0 items-center gap-4 overflow-hidden text-sm transition-all duration-300 group-hover:h-7 group-hover:opacity-100 group-hover:mt-1">
          {anime.score ? (
            <span className="flex items-center gap-1.5 text-yellow-500 font-medium">
              <Star className="h-4 w-4 fill-current" />
              {anime.score.toFixed(1)}
            </span>
          ) : null}
          {formattedMembers ? (
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Users className="h-4 w-4" />
              {formattedMembers}
            </span>
          ) : null}
        </div>

        {anime.synopsis ? (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-400 transition-all duration-300 group-hover:line-clamp-3">
            {anime.synopsis}
          </p>
        ) : (
          <p className="mt-1 text-sm text-zinc-500 italic">
            No synopsis available.
          </p>
        )}
      </div>
    </Link>
  );
};

export default AnimeCard;
