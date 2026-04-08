import Link from "next/link";
import Image from "next/image";

interface AnimeCardProps {
  malId: number;
  title: string;
  imageUrl: string | null;
}

export function AnimeCard({ malId, title, imageUrl }: AnimeCardProps) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  return (
    <Link 
      href={`/anime/${malId}/${slug}`}
      className="group block w-full max-w-50 shrink-0 transition-transform duration-200 hover:scale-105"
    >
      <div className="relative aspect-2/3 overflow-hidden shadow-md">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 150px, 200px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-200 dark:bg-zinc-800">
            <span className="text-xs text-zinc-500">No Image</span>
          </div>
        )}
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
    </Link>
  );
}
