import Link from "next/link";
import { listAvailableAnimeYears } from "@/lib/services/anime.service";

export const dynamic = "force-dynamic";

const SEASONS = ["winter", "spring", "summer", "fall"] as const;

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default async function SeasonArchivePage(
  _props: PageProps<"/anime/season/archive">,
) {
  const currentYear = new Date().getFullYear();
  const availableYears = await listAvailableAnimeYears();
  const minYear =
    availableYears.length > 0 ? Math.min(...availableYears) : currentYear;
  const maxYear = Math.max(
    currentYear,
    availableYears.length > 0 ? Math.max(...availableYears) : currentYear,
  );

  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    years.push(y);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Season archive
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Browse every seasonal lineup from the newest year down to the oldest
            in the database. Select a season to open its catalog.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {years.map((year) => (
            <div
              key={year}
              className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-3"
            >
              <div className="flex shrink-0 items-center sm:w-14">
                <span className="text-xs font-black tracking-widest text-zinc-400 dark:text-zinc-500">
                  {year}
                </span>
              </div>
              <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                {SEASONS.map((season) => (
                  <Link
                    key={`${year}-${season}`}
                    href={`/anime/season/${year}/${season}`}
                    className="min-w-[120px] flex-1 rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 text-center text-xs font-black tracking-widest text-zinc-700 shadow-sm transition-all hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400 sm:flex-initial sm:min-w-[140px]"
                  >
                    {titleCase(season)} {year}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
