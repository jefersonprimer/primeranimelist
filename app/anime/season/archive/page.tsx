import Link from "next/link";
import { listAvailableAnimeYears, listSeasonStats } from "@/lib/services/anime.service";
import { Snowflake, Sun, Leaf, Flower, Calendar, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

const SEASONS = ["winter", "spring", "summer", "fall"] as const;

const SEASON_CONFIG = {
  winter: {
    label: "Winter",
    icon: Snowflake,
    gradient: "from-blue-500/10 to-cyan-500/5",
    border: "border-blue-200/50 dark:border-blue-900/30",
    hoverBorder: "hover:border-blue-400 dark:hover:border-blue-700",
    text: "text-blue-600 dark:text-blue-400",
    iconColor: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  spring: {
    label: "Spring",
    icon: Flower,
    gradient: "from-green-500/10 to-emerald-500/5",
    border: "border-green-200/50 dark:border-green-900/30",
    hoverBorder: "hover:border-green-400 dark:hover:border-green-700",
    text: "text-green-600 dark:text-green-400",
    iconColor: "text-green-500",
    bg: "bg-green-500/10",
  },
  summer: {
    label: "Summer",
    icon: Sun,
    gradient: "from-orange-500/10 to-yellow-500/5",
    border: "border-orange-200/50 dark:border-orange-900/30",
    hoverBorder: "hover:border-orange-400 dark:hover:border-orange-700",
    text: "text-orange-600 dark:text-orange-400",
    iconColor: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  fall: {
    label: "Fall",
    icon: Leaf,
    gradient: "from-red-500/10 to-orange-500/5",
    border: "border-red-200/50 dark:border-red-900/30",
    hoverBorder: "hover:border-red-400 dark:hover:border-red-700",
    text: "text-red-600 dark:text-red-400",
    iconColor: "text-red-500",
    bg: "bg-red-500/10",
  },
};

export default async function SeasonArchivePage(
  _props: PageProps<"/anime/season/archive">,
) {
  const currentYear = new Date().getFullYear();
  const [availableYears, stats] = await Promise.all([
    listAvailableAnimeYears(),
    listSeasonStats(),
  ]);

  const minYear = availableYears.length > 0 ? Math.min(...availableYears) : currentYear;
  const maxYear = Math.max(
    currentYear,
    availableYears.length > 0 ? Math.max(...availableYears) : currentYear,
  );

  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    years.push(y);
  }

  // Map stats for easy access: statsMap[year][season] = count
  const statsMap: Record<number, Record<string, number>> = {};
  stats.forEach((s) => {
    if (!statsMap[s.year]) statsMap[s.year] = {};
    statsMap[s.year][s.season] = s.count;
  });

  return (
    <div className="relative min-h-screen">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/50 px-3 py-1 text-[10px] font-bold tracking-widest text-indigo-600 uppercase dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-400">
            <Calendar className="h-3 w-3" />
            Seasonal Catalog
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Season Archive
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Explore every anime season ever released. Journey through the history of seasonal anime and discover your next favorite series.
          </p>
        </div>

        <div className="space-y-20">
          {years.map((year) => (
            <div key={year} className="group/year">
              <div className="mb-8 flex items-center gap-4">
                <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100">
                  {year}
                </h2>
                <div className="h-px flex-1 bg-linear-to-r from-zinc-200 to-transparent dark:from-zinc-800" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {SEASONS.map((season) => {
                  const config = SEASON_CONFIG[season];
                  const Icon = config.icon;
                  const count = statsMap[year]?.[season] || 0;

                  return (
                    <Link
                      key={`${year}-${season}`}
                      href={`/anime/season/${year}/${season}`}
                      className={`group relative flex flex-col overflow-hidden rounded-2xl border ${config.border} bg-white dark:bg-zinc-900/50 p-6 transition-all duration-300 ${config.hoverBorder} hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/50 hover:-translate-y-1`}
                    >
                      {/* Gradient background on hover */}
                      <div className={`absolute inset-0 bg-linear-to-br ${config.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                      
                      <div className="relative flex items-start justify-between">
                        <div className={`rounded-xl ${config.bg} p-2.5 ${config.iconColor}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <ChevronRight className="h-5 w-5 text-zinc-300 transition-transform duration-300 group-hover:translate-x-1 dark:text-zinc-700" />
                      </div>

                      <div className="relative mt-8">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                          {config.label}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                          {count > 0 ? `${count} Titles` : 'No titles found'}
                        </p>
                      </div>

                      {/* Bottom decorative line */}
                      <div className={`absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r ${config.gradient.replace('/10', '').replace('/20', '').replace('/5', '')} transition-all duration-500 group-hover:w-full`} />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
