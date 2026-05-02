import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
  prevHref: string;
  nextHref: string;
}

const iconBtnBase =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-sm transition-colors";

const iconBtnActive =
  "border-zinc-300 text-zinc-900 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-50 dark:hover:bg-zinc-800";

const iconBtnDisabled =
  "pointer-events-none border-zinc-200 text-zinc-300 dark:border-zinc-800 dark:text-zinc-600";

export function Pagination({
  hasPreviousPage,
  hasNextPage,
  currentPage,
  totalPages,
  prevHref,
  nextHref,
}: PaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex w-full flex-col items-center gap-3 border-t border-zinc-200 pt-8 dark:border-zinc-800"
    >
      <div className="flex w-full max-w-md items-center justify-between gap-4 sm:max-w-lg">
        {hasPreviousPage ? (
          <Link
            href={prevHref}
            className={`${iconBtnBase} ${iconBtnActive}`}
            aria-label={`Previous page, go to page ${currentPage - 1}`}
            prefetch={false}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </Link>
        ) : (
          <span
            className={`${iconBtnBase} ${iconBtnDisabled}`}
            aria-hidden="true"
          >
            <ChevronLeft className="h-5 w-5" />
          </span>
        )}

        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Page
          </p>
          <p className="mt-0.5 text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
            <span className="text-indigo-600 dark:text-indigo-400">
              {currentPage}
            </span>
            <span className="mx-1 font-medium text-zinc-400 dark:text-zinc-500">
              /
            </span>
            <span>{totalPages}</span>
          </p>
        </div>

        {hasNextPage ? (
          <Link
            href={nextHref}
            className={`${iconBtnBase} border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900`}
            aria-label={`Next page, go to page ${currentPage + 1}`}
            prefetch={false}
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </Link>
        ) : (
          <span
            className={`${iconBtnBase} ${iconBtnDisabled}`}
            aria-hidden="true"
          >
            <ChevronRight className="h-5 w-5" />
          </span>
        )}
      </div>
      <p className="sr-only">{`Page ${currentPage} of ${totalPages}`}</p>
    </nav>
  );
}
