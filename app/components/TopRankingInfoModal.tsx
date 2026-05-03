"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

export function TopRankingInfoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-medium text-indigo-600 underline-offset-2 transition hover:cursor-pointer hover:underline dark:text-indigo-400"
      >
        How do we rank shows?
      </button>

      {open
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
              onClick={() => setOpen(false)}
            >
              <div
                className="relative max-h-[60vh] w-full max-w-3xl overflow-y-auto border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
                role="dialog"
                aria-modal="true"
                aria-labelledby="top-ranking-modal-title"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  aria-label="Close ranking explanation modal"
                >
                  <X size={20} />
                </button>

                <h2
                  id="top-ranking-modal-title"
                  className="pr-10 text-xl font-bold text-zinc-900 dark:text-zinc-50"
                >
                  How are MyAnimeList scores calculated?
                </h2>

                <div className="mt-4 space-y-4 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                  <p>
                    All scores given in the database are calculated as a
                    weighted score.
                  </p>
                  <p className="font-semibold">
                    Weighted Score = (v / (v + m)) * S + (m / (v + m)) * C
                  </p>
                  <div className="space-y-1">
                    <p>S = Average score for the anime/manga</p>
                    <p>
                      v = Number users giving a score for the anime/manga
                      &#8224;
                    </p>
                    <p>
                      m = Minimum number of scored users required to get a
                      calculated score
                    </p>
                    <p>
                      C = The mean score across the entire Anime/Manga database
                    </p>
                  </div>
                  <p>
                    &#8224; Note that v does not correspond to the "number of
                    scored users" as seen on the database page. Scores from
                    users who have not viewed 1/5 of the series upon its
                    completion are not included. Scores given from illegitimate
                    accounts created to sway votes are also not included in the
                    scoring algorithm.
                  </p>
                  <p>
                    Not Yet Aired entries have no score and will display N/A.
                    Entries that do not meet the minimum number of scored users
                    will also not display a calculated score.
                  </p>
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      Top Anime/Manga Rankings
                    </h3>
                    <p className="mt-1">
                      The "Top Upcoming" and "Most Popular" rankings are ordered
                      by the number of users who have added the entry to their
                      list. All other Top Anime and Top Manga rankings are
                      ordered by weighted score, as calculated above. Please
                      note that while R18+ entries calculate a weighted score,
                      they are excluded from the rankings. Music Videos are also
                      excluded from Top Anime.
                    </p>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
