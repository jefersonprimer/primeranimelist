import Link from "next/link";

export default function Home() {
  return (
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
          <Link
            href="/anime"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all shadow-xl hover:scale-105"
          >
            Explore Top Anime
          </Link>
        </div>
      </div>
    </div>
  );
}
