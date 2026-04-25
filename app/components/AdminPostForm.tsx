"use client";

import { type FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { buildNewsPostPath } from "@/lib/post-url";

type PostFormData = {
  title: string;
  slug: string;
  category: string;
  tags: string;
  author: string;
  read_time: string;
  excerpt: string;
  cover_image_url: string;
  content_markdown: string;
  is_published: boolean;
};

type AdminPostFormProps = {
  mode: "create" | "edit";
  postId?: number;
  initialData?: Partial<PostFormData>;
};

function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "-");
}

export function AdminPostForm({
  mode,
  postId,
  initialData,
}: AdminPostFormProps) {
  const [form, setForm] = useState<PostFormData>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    category: initialData?.category ?? "",
    tags: Array.isArray(initialData?.tags) ? initialData.tags.join(", ") : "",
    author:
      typeof initialData?.author === "object" && initialData?.author !== null
        ? JSON.stringify(initialData.author, null, 2)
        : "",
    read_time:
      typeof initialData?.read_time === "number" &&
      Number.isFinite(initialData.read_time)
        ? String(initialData.read_time)
        : "",
    excerpt: initialData?.excerpt ?? "",
    cover_image_url: initialData?.cover_image_url ?? "",
    content_markdown: initialData?.content_markdown ?? "",
    is_published: initialData?.is_published ?? false,
  });
  const [autoSlug, setAutoSlug] = useState(
    mode === "create" && !initialData?.slug,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canPreview = useMemo(
    () => form.content_markdown.trim().length > 0,
    [form.content_markdown],
  );

  const applyWrapper = (prefix: string, suffix = "") => {
    setForm((prev) => ({
      ...prev,
      content_markdown: `${prev.content_markdown}${prefix}${suffix}`,
    }));
  };

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: autoSlug ? slugify(value) : prev.slug,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const endpoint =
        mode === "create" ? "/api/v1/posts" : `/api/v1/posts/${postId}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const payload = {
        ...form,
        slug: form.slug.trim() || slugify(form.title),
        read_time:
          form.read_time.trim().length > 0
            ? Number.parseInt(form.read_time, 10)
            : null,
        author: form.author.trim().length > 0 ? form.author : null,
      };

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        data?: {
          slug?: string;
          category?: string | null;
          published_at?: string | null;
          created_at?: string | null;
        };
        error?: string;
      };

      if (!response.ok) {
        throw new Error(result.error || "Nao foi possivel salvar o post.");
      }

      const savedSlug = result.data?.slug ?? payload.slug;
      window.location.href = buildNewsPostPath({
        slug: savedSlug,
        category: result.data?.category ?? payload.category,
        published_at: result.data?.published_at ?? null,
        created_at: result.data?.created_at ?? null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar post.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-indigo-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-zinc-800 bg-[#181818] p-6"
    >
      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-zinc-300 md:col-span-2">
          Titulo
          <input
            className={inputClass}
            value={form.title}
            onChange={(event) => handleTitleChange(event.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-300 md:col-span-2">
          Slug
          <input
            className={inputClass}
            value={form.slug}
            onChange={(event) => {
              setAutoSlug(false);
              setForm((prev) => ({ ...prev, slug: event.target.value }));
            }}
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-300 md:col-span-2">
          Categoria
          <input
            className={inputClass}
            value={form.category}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, category: event.target.value }))
            }
            placeholder="ex: noticias, guides, announcements"
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-300">
          Tags (separadas por virgula)
          <input
            className={inputClass}
            value={form.tags}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, tags: event.target.value }))
            }
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-300">
          Read time (min, vazio = automatico)
          <input
            className={inputClass}
            type="number"
            min={0}
            value={form.read_time}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, read_time: event.target.value }))
            }
            placeholder="Calculado pelo conteudo"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-300 md:col-span-2">
          Author (JSON)
          <textarea
            className={`${inputClass} min-h-24 font-mono`}
            value={form.author}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, author: event.target.value }))
            }
            placeholder='{"name":"Autor","avatar":"https://..."}'
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-300 md:col-span-2">
          Excerpt / resumo curto
          <textarea
            className={`${inputClass} min-h-24`}
            value={form.excerpt}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, excerpt: event.target.value }))
            }
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-300 md:col-span-2">
          Cover image URL
          <input
            className={inputClass}
            value={form.cover_image_url}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                cover_image_url: event.target.value,
              }))
            }
          />
        </label>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-zinc-200">
          Editor de conteudo (Markdown)
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyWrapper("# ")}
            className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-200"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => applyWrapper("## ")}
            className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-200"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => applyWrapper("### ")}
            className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-200"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => applyWrapper("**texto em negrito**")}
            className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-200"
          >
            Negrito
          </button>
          <button
            type="button"
            onClick={() => applyWrapper("[texto do link](https://)")}
            className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-200"
          >
            Link
          </button>
          <button
            type="button"
            onClick={() => applyWrapper("- item 1\n- item 2")}
            className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-200"
          >
            Lista
          </button>
          <button
            type="button"
            onClick={() => applyWrapper("> citacao")}
            className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-200"
          >
            Citacao
          </button>
          <button
            type="button"
            onClick={() => applyWrapper("```ts\ncodigo aqui\n```")}
            className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-200"
          >
            Codigo
          </button>
        </div>

        <textarea
          className={`${inputClass} min-h-80 font-mono`}
          value={form.content_markdown}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              content_markdown: event.target.value,
            }))
          }
          required
        />
      </div>

      {canPreview && (
        <div className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            Preview
          </p>
          <MarkdownRenderer content={form.content_markdown} />
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-zinc-200">
        <input
          type="checkbox"
          checked={form.is_published}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, is_published: event.target.checked }))
          }
        />
        Publicar agora
      </label>

      <div className="flex justify-end gap-3">
        <Link
          href="/news"
          className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {saving
            ? "Salvando..."
            : mode === "create"
              ? "Criar post"
              : "Salvar alteracoes"}
        </button>
      </div>
    </form>
  );
}
