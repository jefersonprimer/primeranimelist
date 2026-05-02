"use client";

import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { Bookmark, LoaderCircle, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { createPortal } from "react-dom";
import {
  dispatchWatchlistUpdated,
  WATCHLIST_UPDATED_EVENT,
  type WatchlistUpdatedDetail,
} from "@/lib/watchlist-events";

const STATUS_OPTIONS = [
  "Watching",
  "Completed",
  "On-Hold",
  "Dropped",
  "Plan to Watch",
] as const;

interface WatchlistEntry {
  status: (typeof STATUS_OPTIONS)[number];
  episodesWatched: number;
  score: number | null;
  startDate: string | null;
  finishDate: string | null;
  isFavorite: boolean;
}

interface WatchlistButtonProps {
  malId: number;
  title: string;
  episodes: number | null;
  triggerLabel?: string;
  triggerClassName?: string;
  initialEntry?: WatchlistEntry | null;
  size?: number;
}

const defaultEntry: WatchlistEntry = {
  status: "Plan to Watch",
  episodesWatched: 0,
  score: null,
  startDate: null,
  finishDate: null,
  isFavorite: false,
};

export function WatchlistButton({
  malId,
  title,
  episodes,
  triggerLabel,
  triggerClassName,
  initialEntry = null,
  size = 24,
}: WatchlistButtonProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [entry, setEntry] = useState<WatchlistEntry>(
    initialEntry ?? defaultEntry,
  );
  const [hasSavedEntry, setHasSavedEntry] = useState(Boolean(initialEntry));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      setHasSavedEntry(false);
      return;
    }

    if (initialEntry) {
      setHasSavedEntry(true);
      return;
    }

    const controller = new AbortController();

    async function preloadSavedState() {
      try {
        const response = await fetch(`/api/v1/watchlist?malId=${malId}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          setHasSavedEntry(false);
          return;
        }

        const data = await response.json();
        setHasSavedEntry(Boolean(data.entry));
      } catch {
        setHasSavedEntry(false);
      }
    }

    preloadSavedState();

    return () => controller.abort();
  }, [initialEntry, loading, malId, user]);

  useEffect(() => {
    const handleWatchlistUpdated = (event: Event) => {
      const { detail } = event as CustomEvent<WatchlistUpdatedDetail>;

      if (detail?.malId === malId) {
        setHasSavedEntry(detail.inWatchlist);
      }
    };

    window.addEventListener(WATCHLIST_UPDATED_EVENT, handleWatchlistUpdated);

    return () => {
      window.removeEventListener(
        WATCHLIST_UPDATED_EVENT,
        handleWatchlistUpdated,
      );
    };
  }, [malId]);

  async function loadEntry() {
    setIsFetching(true);
    setError("");

    try {
      const response = await fetch(`/api/v1/watchlist?malId=${malId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load watchlist entry");
      }

      if (data.entry) {
        setEntry(data.entry);
        setHasSavedEntry(true);
      } else {
        setEntry(defaultEntry);
        setHasSavedEntry(false);
      }
    } catch (fetchError: any) {
      setError(fetchError.message);
    } finally {
      setIsFetching(false);
    }
  }

  async function handleOpen(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (loading) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    setIsOpen(true);
    await loadEntry();
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/v1/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          malId,
          ...entry,
          score:
            entry.score === null || Number.isNaN(entry.score)
              ? null
              : entry.score,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save watchlist entry");
      }

      setEntry(data.entry);
      setHasSavedEntry(true);
      dispatchWatchlistUpdated({ malId, inWatchlist: true });
      setIsOpen(false);
      router.refresh();
    } catch (saveError: any) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/v1/watchlist?malId=${malId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete watchlist entry");
      }

      setEntry(defaultEntry);
      setHasSavedEntry(false);
      dispatchWatchlistUpdated({ malId, inWatchlist: false });
      setIsOpen(false);
      router.refresh();
    } catch (deleteError: any) {
      setError(deleteError.message);
    } finally {
      setIsDeleting(false);
    }
  }

  const currentEpisodes = episodes ?? null;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={
          triggerClassName ??
          "inline-flex items-center text-white transition hover:border-indigo-400 hover:cursor-pointer"
        }
        aria-label={
          hasSavedEntry ? "Edit watchlist entry" : "Add anime to watchlist"
        }
      >
        <Bookmark
          size={size}
          className={
            hasSavedEntry ? "fill-indigo-400 text-indigo-400" : "text-white"
          }
        />
        {triggerLabel ? <span>{triggerLabel}</span> : null}
      </button>

      {mounted && isOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-6"
              onClick={() => setIsOpen(false)}
            >
              <div
                className="w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-50 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                      Watchlist
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight">
                      {title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full border border-zinc-700 p-2 text-zinc-400 transition hover:border-zinc-500 hover:text-white"
                    aria-label="Close watchlist modal"
                  >
                    <X size={18} />
                  </button>
                </div>

                {isFetching ? (
                  <div className="flex min-h-64 items-center justify-center">
                    <LoaderCircle
                      className="animate-spin text-indigo-400"
                      size={28}
                    />
                  </div>
                ) : (
                  <form className="mt-6 space-y-5" onSubmit={handleSave}>
                    {error ? (
                      <div className="rounded-2xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                        {error}
                      </div>
                    ) : null}

                    <div className="grid gap-5 md:grid-cols-2">
                      <label className="flex flex-col gap-2 text-sm font-semibold text-zinc-200">
                        Status
                        <select
                          value={entry.status}
                          onChange={(event) =>
                            setEntry((current) => ({
                              ...current,
                              status: event.target
                                .value as WatchlistEntry["status"],
                            }))
                          }
                          className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="flex flex-col gap-2 text-sm font-semibold text-zinc-200">
                        Episodes Watched
                        <input
                          type="number"
                          min={0}
                          max={currentEpisodes ?? undefined}
                          value={entry.episodesWatched}
                          onChange={(event) =>
                            setEntry((current) => ({
                              ...current,
                              episodesWatched: Number.parseInt(
                                event.target.value || "0",
                                10,
                              ),
                            }))
                          }
                          className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                        />
                        <span className="text-xs font-medium text-zinc-500">
                          {entry.episodesWatched} / {currentEpisodes ?? "?"}{" "}
                          episodes
                        </span>
                      </label>

                      <label className="flex flex-col gap-2 text-sm font-semibold text-zinc-200">
                        Your score
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          value={entry.score ?? ""}
                          onChange={(event) =>
                            setEntry((current) => ({
                              ...current,
                              score:
                                event.target.value === ""
                                  ? null
                                  : Number(event.target.value),
                            }))
                          }
                          className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                          placeholder="0 to 10"
                        />
                      </label>

                      <label className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm font-semibold text-zinc-200">
                        <input
                          type="checkbox"
                          checked={entry.isFavorite}
                          onChange={(event) =>
                            setEntry((current) => ({
                              ...current,
                              isFavorite: event.target.checked,
                            }))
                          }
                          className="h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-indigo-500 focus:ring-indigo-500"
                        />
                        Add to favorites
                      </label>

                      <label className="flex flex-col gap-2 text-sm font-semibold text-zinc-200">
                        Start date
                        <input
                          type="date"
                          value={entry.startDate ?? ""}
                          onChange={(event) =>
                            setEntry((current) => ({
                              ...current,
                              startDate: event.target.value || null,
                            }))
                          }
                          className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                        />
                      </label>

                      <label className="flex flex-col gap-2 text-sm font-semibold text-zinc-200">
                        Finish date
                        <input
                          type="date"
                          value={entry.finishDate ?? ""}
                          onChange={(event) =>
                            setEntry((current) => ({
                              ...current,
                              finishDate: event.target.value || null,
                            }))
                          }
                          className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500"
                        />
                      </label>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        {hasSavedEntry ? (
                          <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-2 rounded-full border border-red-900 bg-red-950/30 px-4 py-2 text-sm font-semibold text-red-300 transition hover:border-red-700 hover:bg-red-950/50 disabled:opacity-60"
                          >
                            <Trash2 size={16} />
                            {isDeleting ? "Removing..." : "Remove from list"}
                          </button>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsOpen(false)}
                          className="rounded-full border border-zinc-700 px-5 py-2 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
                        >
                          {isSaving
                            ? "Saving..."
                            : hasSavedEntry
                              ? "Update entry"
                              : "Save to list"}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
