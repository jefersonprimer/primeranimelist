"use client";

import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

type Kind = "anime" | "manga";
type Mode = "create" | "edit";

type AdminMediaModalProps = {
  open: boolean;
  onClose: () => void;
  kind: Kind;
  mode: Mode;
  malId?: number;
  onSaved?: (info: { mal_id: number; kind: Kind; title: string }) => void;
};

type FormState = Record<string, string>;

function emptyForm(): FormState {
  return {
    mal_id: "",
    title: "",
    title_english: "",
    title_japanese: "",
    image_url: "",
    synopsis: "",
    background: "",
    score: "",
    scored_by: "",
    rank: "",
    popularity: "",
    status: "",
    type: "",
    members: "",
    favorites: "",
    genres: "",
    themes: "",
    demographics: "",
    authors: "",
    serializations: "",
    chapters: "",
    volumes: "",
    publishing: "",
    published_from: "",
    published_to: "",
    episodes: "",
    rating: "",
    source: "",
    season: "",
    year: "",
    studios: "",
    producers: "",
    licensors: "",
    aired_from: "",
    aired_to: "",
    is_airing: "",
    trailer_url: "",
    duration: "",
    image_banner_desktop: "",
    image_banner_mobile: "",
    image_logo: "",
    image_thumbnail: "",
    image_card_compact: "",
  };
}

function relationNames(values: unknown): string {
  if (!Array.isArray(values)) return "";
  return values
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "name" in item) {
        return String((item as { name: string }).name);
      }
      return "";
    })
    .filter((value) => value.length > 0)
    .join(", ");
}

function isoToDateInput(iso: string | null | undefined) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

function buildAnimePayload(form: FormState, mode: Mode) {
  const mal_id = Number.parseInt(form.mal_id, 10);
  const payload: Record<string, unknown> = {
    title: form.title.trim(),
    title_english: form.title_english.trim() || null,
    title_japanese: form.title_japanese.trim() || null,
    image_url: form.image_url.trim() || null,
    synopsis: form.synopsis.trim() || null,
    score: form.score.trim() ? Number.parseFloat(form.score) : null,
    scored_by: form.scored_by.trim() ? Number.parseInt(form.scored_by, 10) : null,
    rank: form.rank.trim() ? Number.parseInt(form.rank, 10) : null,
    popularity: form.popularity.trim() ? Number.parseInt(form.popularity, 10) : null,
    episodes: form.episodes.trim() ? Number.parseInt(form.episodes, 10) : null,
    status: form.status.trim() || null,
    rating: form.rating.trim() || null,
    source: form.source.trim() || null,
    season: form.season.trim() || null,
    year: form.year.trim() ? Number.parseInt(form.year, 10) : null,
    genres: form.genres.trim() ? form.genres.split(",").map((s) => s.trim()).filter(Boolean) : null,
    studios: form.studios.trim() ? form.studios.split(",").map((s) => s.trim()).filter(Boolean) : null,
    producers: form.producers.trim() ? form.producers.split(",").map((s) => s.trim()).filter(Boolean) : null,
    licensors: form.licensors.trim() ? form.licensors.split(",").map((s) => s.trim()).filter(Boolean) : null,
    themes: form.themes.trim() ? form.themes.split(",").map((s) => s.trim()).filter(Boolean) : null,
    demographics: form.demographics.trim()
      ? form.demographics.split(",").map((s) => s.trim()).filter(Boolean)
      : null,
    aired_from: form.aired_from.trim() ? `${form.aired_from.trim()}T00:00:00.000Z` : null,
    aired_to: form.aired_to.trim() ? `${form.aired_to.trim()}T00:00:00.000Z` : null,
    is_airing: form.is_airing === "true" ? true : form.is_airing === "false" ? false : null,
    trailer_url: form.trailer_url.trim() || null,
    type: form.type.trim() || null,
    members: form.members.trim() ? Number.parseInt(form.members, 10) : null,
    favorites: form.favorites.trim() ? Number.parseInt(form.favorites, 10) : null,
    duration: form.duration.trim() || null,
    image_banner_desktop: form.image_banner_desktop.trim() || null,
    image_banner_mobile: form.image_banner_mobile.trim() || null,
    image_logo: form.image_logo.trim() || null,
    image_thumbnail: form.image_thumbnail.trim() || null,
    image_card_compact: form.image_card_compact.trim() || null,
  };

  if (mode === "create") {
    payload.mal_id = mal_id;
  }

  return payload;
}

function buildMangaPayload(form: FormState, mode: Mode) {
  const mal_id = Number.parseInt(form.mal_id, 10);
  const payload: Record<string, unknown> = {
    title: form.title.trim(),
    title_english: form.title_english.trim() || null,
    title_japanese: form.title_japanese.trim() || null,
    image_url: form.image_url.trim() || null,
    synopsis: form.synopsis.trim() || null,
    background: form.background.trim() || null,
    score: form.score.trim() ? Number.parseFloat(form.score) : null,
    scored_by: form.scored_by.trim() ? Number.parseInt(form.scored_by, 10) : null,
    rank: form.rank.trim() ? Number.parseInt(form.rank, 10) : null,
    popularity: form.popularity.trim() ? Number.parseInt(form.popularity, 10) : null,
    chapters: form.chapters.trim() ? Number.parseInt(form.chapters, 10) : null,
    volumes: form.volumes.trim() ? Number.parseInt(form.volumes, 10) : null,
    status: form.status.trim() || null,
    publishing: form.publishing === "true" ? true : form.publishing === "false" ? false : null,
    genres: form.genres.trim() ? form.genres.split(",").map((s) => s.trim()).filter(Boolean) : null,
    themes: form.themes.trim() ? form.themes.split(",").map((s) => s.trim()).filter(Boolean) : null,
    demographics: form.demographics.trim()
      ? form.demographics.split(",").map((s) => s.trim()).filter(Boolean)
      : null,
    authors: form.authors.trim() ? form.authors.split(",").map((s) => s.trim()).filter(Boolean) : null,
    serializations: form.serializations.trim()
      ? form.serializations.split(",").map((s) => s.trim()).filter(Boolean)
      : null,
    published_from: form.published_from.trim() ? `${form.published_from.trim()}T00:00:00.000Z` : null,
    published_to: form.published_to.trim() ? `${form.published_to.trim()}T00:00:00.000Z` : null,
    type: form.type.trim() || null,
    members: form.members.trim() ? Number.parseInt(form.members, 10) : null,
    favorites: form.favorites.trim() ? Number.parseInt(form.favorites, 10) : null,
  };

  if (mode === "create") {
    payload.mal_id = mal_id;
  }

  return payload;
}

export function AdminMediaModal({ open, onClose, kind, mode, malId, onSaved }: AdminMediaModalProps) {
  const [form, setForm] = useState<FormState>(() => emptyForm());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleText = useMemo(() => {
    const action = mode === "create" ? "Adicionar" : "Editar";
    const label = kind === "anime" ? "anime" : "manga";
    return `${action} ${label}`;
  }, [kind, mode]);

  const applyAnimeData = useCallback((data: Record<string, unknown>) => {
    const images = data.images as { jpg?: { image_url?: string | null; large_image_url?: string | null } } | undefined;
    const imageUrl = images?.jpg?.large_image_url || images?.jpg?.image_url || "";
    const aired = data.aired as { from?: string | null; to?: string | null } | undefined;

    setForm({
      ...emptyForm(),
      mal_id: String(data.mal_id ?? ""),
      title: String(data.title ?? ""),
      title_english: String(data.title_english ?? ""),
      title_japanese: String(data.title_japanese ?? ""),
      image_url: String(imageUrl ?? ""),
      synopsis: String(data.synopsis ?? ""),
      score: data.score != null ? String(data.score) : "",
      scored_by: data.scored_by != null ? String(data.scored_by) : "",
      rank: data.rank != null ? String(data.rank) : "",
      popularity: data.popularity != null ? String(data.popularity) : "",
      status: String(data.status ?? ""),
      type: String(data.type ?? ""),
      members: data.members != null ? String(data.members) : "",
      favorites: data.favorites != null ? String(data.favorites) : "",
      genres: relationNames(data.genres),
      themes: relationNames(data.themes),
      demographics: relationNames(data.demographics),
      studios: relationNames(data.studios),
      producers: relationNames(data.producers),
      licensors: relationNames(data.licensors),
      episodes: data.episodes != null ? String(data.episodes) : "",
      rating: String(data.rating ?? ""),
      source: String(data.source ?? ""),
      season: String(data.season ?? ""),
      year: data.year != null ? String(data.year) : "",
      aired_from: isoToDateInput(aired?.from ?? undefined),
      aired_to: isoToDateInput(aired?.to ?? undefined),
      is_airing: data.airing === true ? "true" : data.airing === false ? "false" : "",
      trailer_url: String((data.trailer as { url?: string | null } | undefined)?.url ?? ""),
      duration: String(data.duration ?? ""),
      image_banner_desktop: String(data.image_banner_desktop ?? ""),
      image_banner_mobile: String(data.image_banner_mobile ?? ""),
      image_logo: String(data.image_logo ?? ""),
      image_thumbnail: String(data.image_thumbnail ?? ""),
      image_card_compact: String(data.image_card_compact ?? ""),
    });
  }, []);

  const applyMangaData = useCallback((data: Record<string, unknown>) => {
    const images = data.images as { jpg?: { image_url?: string | null; large_image_url?: string | null } } | undefined;
    const imageUrl = images?.jpg?.large_image_url || images?.jpg?.image_url || "";
    const published = data.published as { from?: string | null; to?: string | null } | undefined;

    setForm({
      ...emptyForm(),
      mal_id: String(data.mal_id ?? ""),
      title: String(data.title ?? ""),
      title_english: String(data.title_english ?? ""),
      title_japanese: String(data.title_japanese ?? ""),
      image_url: String(imageUrl ?? ""),
      synopsis: String(data.synopsis ?? ""),
      background: String(data.background ?? ""),
      score: data.score != null ? String(data.score) : "",
      scored_by: data.scored_by != null ? String(data.scored_by) : "",
      rank: data.rank != null ? String(data.rank) : "",
      popularity: data.popularity != null ? String(data.popularity) : "",
      status: String(data.status ?? ""),
      type: String(data.type ?? ""),
      members: data.members != null ? String(data.members) : "",
      favorites: data.favorites != null ? String(data.favorites) : "",
      genres: relationNames(data.genres),
      themes: relationNames(data.themes),
      demographics: relationNames(data.demographics),
      authors: relationNames(data.authors),
      serializations: relationNames(data.serializations),
      chapters: data.chapters != null ? String(data.chapters) : "",
      volumes: data.volumes != null ? String(data.volumes) : "",
      publishing: data.publishing === true ? "true" : data.publishing === false ? "false" : "",
      published_from: isoToDateInput(published?.from ?? undefined),
      published_to: isoToDateInput(published?.to ?? undefined),
    });
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (mode === "create") {
      setForm(emptyForm());
      setError(null);
      setLoading(false);
      return;
    }

    if (!malId) {
      setError("ID inválido.");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(`/api/v1/${kind}/${malId}`);
        const json = (await res.json()) as { data?: Record<string, unknown>; error?: string };
        if (!res.ok) {
          throw new Error(json.error || "Não foi possível carregar os dados.");
        }
        if (cancelled || !json.data) {
          return;
        }
        if (kind === "anime") {
          applyAnimeData(json.data);
        } else {
          applyMangaData(json.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erro ao carregar.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applyAnimeData, applyMangaData, kind, malId, mode, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (mode === "create" && (!form.mal_id.trim() || Number.parseInt(form.mal_id, 10) <= 0)) {
        throw new Error("Informe um MAL ID válido.");
      }
      if (!form.title.trim()) {
        throw new Error("O título é obrigatório.");
      }

      const basePath = kind === "anime" ? "/api/v1/anime" : "/api/v1/manga";
      const payload =
        kind === "anime" ? buildAnimePayload(form, mode) : buildMangaPayload(form, mode);
      const url = mode === "create" ? basePath : `${basePath}/${malId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await res.json()) as { data?: { mal_id?: number }; error?: string };
      if (!res.ok) {
        throw new Error(json.error || "Não foi possível salvar.");
      }

      const savedMalId = json.data?.mal_id ?? malId;
      if (savedMalId) {
        onSaved?.({ mal_id: savedMalId, kind, title: form.title.trim() });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return null;
  }

  const fieldClass =
    "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-zinc-800 bg-[#181818] p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-media-modal-title"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">Admin</p>
            <h2 id="admin-media-modal-title" className="text-xl font-bold text-white">
              {titleText}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Os dados são guardados na base de dados. Campos vazios são gravados como vazios ou nulos quando aplicável.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-zinc-300">A carregar…</p>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-zinc-300">
                MAL ID
                <input
                  className={fieldClass}
                  value={form.mal_id}
                  onChange={(event) => updateField("mal_id", event.target.value)}
                  disabled={mode === "edit"}
                  inputMode="numeric"
                  required={mode === "create"}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-zinc-300">
                Título
                <input
                  className={fieldClass}
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-zinc-300">
                Título (EN)
                <input
                  className={fieldClass}
                  value={form.title_english}
                  onChange={(event) => updateField("title_english", event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-zinc-300">
                Título (JP)
                <input
                  className={fieldClass}
                  value={form.title_japanese}
                  onChange={(event) => updateField("title_japanese", event.target.value)}
                />
              </label>
              <label className="md:col-span-2 flex flex-col gap-1 text-sm text-zinc-300">
                URL da imagem
                <input
                  className={fieldClass}
                  value={form.image_url}
                  onChange={(event) => updateField("image_url", event.target.value)}
                />
              </label>
            </div>

            <label className="flex flex-col gap-1 text-sm text-zinc-300">
              Sinopse
              <textarea
                className={`${fieldClass} min-h-[140px]`}
                value={form.synopsis}
                onChange={(event) => updateField("synopsis", event.target.value)}
              />
            </label>

            {kind === "manga" && (
              <label className="flex flex-col gap-1 text-sm text-zinc-300">
                Background
                <textarea
                  className={`${fieldClass} min-h-[100px]`}
                  value={form.background}
                  onChange={(event) => updateField("background", event.target.value)}
                />
              </label>
            )}

            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-1 text-sm text-zinc-300">
                Score
                <input className={fieldClass} value={form.score} onChange={(e) => updateField("score", e.target.value)} />
              </label>
              <label className="flex flex-col gap-1 text-sm text-zinc-300">
                Rank
                <input className={fieldClass} value={form.rank} onChange={(e) => updateField("rank", e.target.value)} />
              </label>
              <label className="flex flex-col gap-1 text-sm text-zinc-300">
                Popularidade
                <input
                  className={fieldClass}
                  value={form.popularity}
                  onChange={(e) => updateField("popularity", e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-zinc-300">
                Votos (scored_by)
                <input
                  className={fieldClass}
                  value={form.scored_by}
                  onChange={(e) => updateField("scored_by", e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-zinc-300">
                Membros
                <input
                  className={fieldClass}
                  value={form.members}
                  onChange={(e) => updateField("members", e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-zinc-300">
                Favoritos
                <input
                  className={fieldClass}
                  value={form.favorites}
                  onChange={(e) => updateField("favorites", e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-zinc-300">
                Estado
                <input
                  className={fieldClass}
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-zinc-300">
                Tipo
                <input className={fieldClass} value={form.type} onChange={(e) => updateField("type", e.target.value)} />
              </label>
              {kind === "anime" ? (
                <label className="flex flex-col gap-1 text-sm text-zinc-300">
                  Episódios
                  <input
                    className={fieldClass}
                    value={form.episodes}
                    onChange={(e) => updateField("episodes", e.target.value)}
                  />
                </label>
              ) : (
                <>
                  <label className="flex flex-col gap-1 text-sm text-zinc-300">
                    Capítulos
                    <input
                      className={fieldClass}
                      value={form.chapters}
                      onChange={(e) => updateField("chapters", e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-zinc-300">
                    Volumes
                    <input
                      className={fieldClass}
                      value={form.volumes}
                      onChange={(e) => updateField("volumes", e.target.value)}
                    />
                  </label>
                </>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm text-zinc-300">
                Géneros (separados por vírgula)
                <input
                  className={fieldClass}
                  value={form.genres}
                  onChange={(e) => updateField("genres", e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-zinc-300">
                Temas (separados por vírgula)
                <input
                  className={fieldClass}
                  value={form.themes}
                  onChange={(e) => updateField("themes", e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-zinc-300">
                Demografia (separados por vírgula)
                <input
                  className={fieldClass}
                  value={form.demographics}
                  onChange={(e) => updateField("demographics", e.target.value)}
                />
              </label>
              {kind === "anime" ? (
                <label className="flex flex-col gap-1 text-sm text-zinc-300">
                  Estúdios (separados por vírgula)
                  <input
                    className={fieldClass}
                    value={form.studios}
                    onChange={(e) => updateField("studios", e.target.value)}
                  />
                </label>
              ) : (
                <>
                  <label className="flex flex-col gap-1 text-sm text-zinc-300">
                    Autores (separados por vírgula)
                    <input
                      className={fieldClass}
                      value={form.authors}
                      onChange={(e) => updateField("authors", e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-zinc-300">
                    Serialização (separados por vírgula)
                    <input
                      className={fieldClass}
                      value={form.serializations}
                      onChange={(e) => updateField("serializations", e.target.value)}
                    />
                  </label>
                </>
              )}
            </div>

            {kind === "anime" && (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="flex flex-col gap-1 text-sm text-zinc-300">
                    Temporada
                    <input
                      className={fieldClass}
                      value={form.season}
                      onChange={(e) => updateField("season", e.target.value)}
                      placeholder="winter, spring, summer, fall"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-zinc-300">
                    Ano
                    <input className={fieldClass} value={form.year} onChange={(e) => updateField("year", e.target.value)} />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-zinc-300">
                    Classificação indicativa
                    <input
                      className={fieldClass}
                      value={form.rating}
                      onChange={(e) => updateField("rating", e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-zinc-300">
                    Fonte
                    <input
                      className={fieldClass}
                      value={form.source}
                      onChange={(e) => updateField("source", e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-zinc-300">
                    Duração
                    <input
                      className={fieldClass}
                      value={form.duration}
                      onChange={(e) => updateField("duration", e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-zinc-300">
                    Em exibição
                    <select
                      className={fieldClass}
                      value={form.is_airing}
                      onChange={(e) => updateField("is_airing", e.target.value)}
                    >
                      <option value="">(não definido)</option>
                      <option value="true">Sim</option>
                      <option value="false">Não</option>
                    </select>
                  </label>
                  <label className="md:col-span-3 flex flex-col gap-1 text-sm text-zinc-300">
                    URL do trailer (YouTube)
                    <input
                      className={fieldClass}
                      value={form.trailer_url}
                      onChange={(e) => updateField("trailer_url", e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-zinc-300">
                    Produtores (vírgula)
                    <input
                      className={fieldClass}
                      value={form.producers}
                      onChange={(e) => updateField("producers", e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-zinc-300">
                    Licenciadores (vírgula)
                    <input
                      className={fieldClass}
                      value={form.licensors}
                      onChange={(e) => updateField("licensors", e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-zinc-300">
                    Exibição (de)
                    <input
                      type="date"
                      className={fieldClass}
                      value={form.aired_from}
                      onChange={(e) => updateField("aired_from", e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-zinc-300">
                    Exibição (até)
                    <input
                      type="date"
                      className={fieldClass}
                      value={form.aired_to}
                      onChange={(e) => updateField("aired_to", e.target.value)}
                    />
                  </label>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-1 text-sm text-zinc-300">
                    Banner desktop (URL)
                    <input
                      className={fieldClass}
                      value={form.image_banner_desktop}
                      onChange={(e) => updateField("image_banner_desktop", e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-zinc-300">
                    Banner mobile (URL)
                    <input
                      className={fieldClass}
                      value={form.image_banner_mobile}
                      onChange={(e) => updateField("image_banner_mobile", e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-zinc-300">
                    Logótipo (URL)
                    <input
                      className={fieldClass}
                      value={form.image_logo}
                      onChange={(e) => updateField("image_logo", e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-zinc-300">
                    Miniatura (URL)
                    <input
                      className={fieldClass}
                      value={form.image_thumbnail}
                      onChange={(e) => updateField("image_thumbnail", e.target.value)}
                    />
                  </label>
                  <label className="md:col-span-2 flex flex-col gap-1 text-sm text-zinc-300">
                    Cartão compacto (URL)
                    <input
                      className={fieldClass}
                      value={form.image_card_compact}
                      onChange={(e) => updateField("image_card_compact", e.target.value)}
                    />
                  </label>
                </div>
              </>
            )}

            {kind === "manga" && (
              <div className="grid gap-4 md:grid-cols-3">
                <label className="flex flex-col gap-1 text-sm text-zinc-300">
                  Em publicação
                  <select
                    className={fieldClass}
                    value={form.publishing}
                    onChange={(e) => updateField("publishing", e.target.value)}
                  >
                    <option value="">(não definido)</option>
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm text-zinc-300">
                  Publicação (de)
                  <input
                    type="date"
                    className={fieldClass}
                    value={form.published_from}
                    onChange={(e) => updateField("published_from", e.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-zinc-300">
                  Publicação (até)
                  <input
                    type="date"
                    className={fieldClass}
                    value={form.published_to}
                    onChange={(e) => updateField("published_to", e.target.value)}
                  />
                </label>
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "A guardar…" : "Guardar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
