"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface TopFilterItem {
  label: string;
  value: string | null;
}

interface TopFiltersProps {
  basePath: string;
  filters: TopFilterItem[];
  currentFilter: string | null;
}

export function TopFilters({
  basePath,
  filters,
  currentFilter,
}: TopFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedValue = currentFilter ?? "";

  function getFilterHref(filterValue: string | null) {
    if (!filterValue) return basePath;
    return `${basePath}?filter=${filterValue}`;
  }

  function handleSelectChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("filter", value);
    } else {
      params.delete("filter");
    }

    // Filter change should restart pagination for predictable results.
    params.delete("page");

    const queryString = params.toString();
    router.push(queryString ? `${basePath}?${queryString}` : basePath);
  }

  return (
    <section className="mb-4 rounded-xl border border-zinc-200 bg-white/80 p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="sm:hidden">
        <label
          htmlFor={`filter-${basePath.replace("/", "")}`}
          className="mb-1 block text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
        >
          Filter
        </label>
        <select
          id={`filter-${basePath.replace("/", "")}`}
          value={selectedValue}
          onChange={(event) => handleSelectChange(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 outline-none transition focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-500"
        >
          {filters.map((item) => (
            <option key={item.value ?? "all"} value={item.value ?? ""}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <nav
        aria-label="Top filters"
        className="hidden items-center gap-2 overflow-x-auto whitespace-nowrap px-1 py-1 sm:flex"
      >
        {filters.map((item) => {
          const isActive = item.value === currentFilter;

          return (
            <Link
              key={item.value ?? "all"}
              href={getFilterHref(item.value)}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex items-center rounded-full border px-2 py-1 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                  : "border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
