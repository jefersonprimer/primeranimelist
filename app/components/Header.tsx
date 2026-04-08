import Link from 'next/link';

function getCurrentSeason(date = new Date()) {
  const month = date.getMonth(); // 0-11
  if (month <= 2) return "winter";
  if (month <= 5) return "spring";
  if (month <= 8) return "summer";
  return "fall";
}

export default function Header() {
  const currentYear = new Date().getFullYear();
  const currentSeason = getCurrentSeason();
  return (
    <header className="bg-zinc-100 border-b border-zinc-200 py-4 px-6 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <Link href="/" className="flex flex-row items-center gap-3">
            <div className="bg-indigo-600 text-white font-bold p-2 rounded shadow-md w-12 h-12 flex items-center justify-center text-lg">
              PAL
            </div>
            <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              PrimerAnimeList
            </span>
          </Link>
        </div>
        <nav>
          <ul className="flex flex-row gap-8">
            <li>
              <Link href="/" className="text-lg font-semibold text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/anime/top" className="text-lg font-semibold text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors">
                Top Anime
              </Link>
            </li>
            <li>
              <Link href="/manga/top" className="text-lg font-semibold text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors">
                Top Manga
              </Link>
            </li>
            <li>
              <Link
                href={`/anime/season/${currentYear}/${currentSeason}`}
                className="text-lg font-semibold text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors"
              >
                Season Anime
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
