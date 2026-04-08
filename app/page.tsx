import Link from "next/link";
import { AnimeCarousel } from "@/app/components/AnimeCarousel";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center justify-center pt-24 pb-12 px-6">
        <div className="max-w-3xl w-full text-center space-y-8">
          <h1 className="text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-7xl">
            Welcome to <span className="text-indigo-600">PrimerAnimeList</span>
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Track your favorite anime, discover new hits, and see what's trending. 
            Your ultimate destination for everything anime.
          </p>
          <div className="pt-8">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/anime/top"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all shadow-xl hover:scale-105"
              >
                Explore Top Anime
              </Link>
              <Link
                href="/manga/top"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full hover:bg-indigo-100 transition-all shadow-xl hover:scale-105 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-900"
              >
                Explore Top Manga
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full pb-20">
        <AnimeCarousel title="Top Airing Anime" filter="airing" />
        <AnimeCarousel title="Upcoming Anime" filter="upcoming" />
      </div>
    </div>
  );
}
