import Link from "next/link";
import {
  getWeeklyReleaseCalendar,
  type CalendarMediaFilter,
} from "@/lib/services/calendar.service";

export const dynamic = "force-dynamic";

type CalendarSearchParams = Promise<{
  type?: string | string[];
}>;

const CALENDAR_FILTERS: Array<{ value: CalendarMediaFilter; label: string }> = [
  { value: "all", label: "Both" },
  { value: "anime", label: "Anime" },
  { value: "manga", label: "Manga" },
];

function parseFilter(
  value: string | string[] | undefined,
): CalendarMediaFilter {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "anime" || raw === "manga") return raw;
  return "all";
}

export default async function CalendarPage(props: {
  searchParams: CalendarSearchParams;
}) {
  const { type } = await props.searchParams;
  const activeFilter = parseFilter(type);
  const { days, totals } = await getWeeklyReleaseCalendar(activeFilter);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Release Calendar
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Weekly view for ongoing anime episodes and manga chapters.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
          <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">
            {totals.anime} airing anime
          </span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
            {totals.manga} publishing manga
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {CALENDAR_FILTERS.map((filter) => {
            const isActive = filter.value === activeFilter;
            const href =
              filter.value === "all"
                ? "/calendar"
                : `/calendar?type=${filter.value}`;
            return (
              <Link
                key={filter.value}
                href={href}
                className={`rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-wide transition-colors ${
                  isActive
                    ? "border-indigo-300 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500"
                    : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500"
                }`}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        {days.map((day, dayIndex) => (
          <section
            key={`${day.weekday}-${day.dateLabel}`}
            className="overflow-visible border border-zinc-200 bg-white/80 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80"
          >
            <header className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                {day.dateLabel}
              </p>
              <p
                className={`mt-1 text-sm font-black uppercase tracking-[0.14em] ${
                  day.label === "TODAY"
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-zinc-900 dark:text-zinc-50"
                }`}
              >
                {day.label}
              </p>
            </header>

            <div className="space-y-2 p-3">
              {day.items.length > 0 ? (
                day.items.map((item) => {
                  const href =
                    item.type === "anime"
                      ? `/anime/${item.malId}/${encodeURIComponent(item.title)}`
                      : `/manga/${item.malId}/${encodeURIComponent(item.title)}`;
                  const openLeft = dayIndex >= 5;

                  return (
                    <Link
                      key={`${item.type}-${item.malId}`}
                      href={href}
                      className="group relative block rounded-lg border border-zinc-200 bg-white px-2.5 py-2 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                    >
                      <span
                        className={`inline-flex rounded-full border px-1.5 py-0.5 text-[9px] font-black uppercase ${
                          item.type === "anime"
                            ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        {item.type}
                      </span>
                      <p className="mt-1.5 line-clamp-2 text-xs font-bold text-zinc-900 dark:text-zinc-50">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        {item.type === "anime"
                          ? `Episode ${item.episodesOrChapters ?? "?"}`
                          : `Chapter ${item.episodesOrChapters ?? "?"}`}
                      </p>
                      <div
                        className={`pointer-events-none absolute top-1/2 z-30 hidden w-80 -translate-y-1/2 rounded-xl border border-zinc-200 bg-white shadow-2xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 lg:block dark:border-zinc-700 dark:bg-zinc-900 ${
                          openLeft
                            ? "right-[calc(100%+0.5rem)]"
                            : "left-[calc(100%+0.5rem)]"
                        }`}
                      >
                        <div
                          className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 ${
                            openLeft
                              ? "-right-1.5 border-r border-t"
                              : "-left-1.5 border-b border-l"
                          }`}
                        />
                        <div className="flex items-center w-full h-auto p-4 gap-0 overflow-hidden rounded">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="h-full min-h-32 w-28 object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex min-h-32 w-28 items-center justify-center bg-zinc-100 px-2 text-center text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                              No image
                            </div>
                          )}
                          <div className="space-y-1.5 p-3">
                            <p className="line-clamp-2 text-sm font-black text-zinc-900 dark:text-zinc-50">
                              {item.title}
                            </p>
                            <p className="line-clamp-5 text-xs text-zinc-600 dark:text-zinc-300">
                              {item.synopsis ?? "No description available."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <p className="rounded-lg border border-dashed border-zinc-200 px-2.5 py-3 text-center text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  No releases
                </p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
