"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { AdminMediaModal } from "./AdminMediaModal";

type ModalState =
  | null
  | {
      kind: "anime" | "manga";
      mode: "create";
    };

function slugifyTitle(title: string) {
  const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug.length > 0 ? slug : "item";
}

export function AdminNavActions() {
  const { user } = useAuth();
  const [modal, setModal] = useState<ModalState>(null);

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <>
      <div className="flex h-full items-center gap-1 border-l border-zinc-800 pl-3">
        <Link
          href="/admin/news"
          className="flex h-9 items-center rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 text-xs font-semibold text-zinc-100 transition hover:border-indigo-500 hover:text-white"
        >
          News
        </Link>
        <button
          type="button"
          onClick={() => setModal({ kind: "anime", mode: "create" })}
          className="flex h-9 items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 text-xs font-semibold text-zinc-100 transition hover:border-indigo-500 hover:text-white"
        >
          <Plus size={16} aria-hidden />
          Anime
        </button>
        <button
          type="button"
          onClick={() => setModal({ kind: "manga", mode: "create" })}
          className="flex h-9 items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 text-xs font-semibold text-zinc-100 transition hover:border-indigo-500 hover:text-white"
        >
          <Plus size={16} aria-hidden />
          Manga
        </button>
      </div>

      {modal && (
        <AdminMediaModal
          open
          kind={modal.kind}
          mode={modal.mode}
          onClose={() => setModal(null)}
          onSaved={({ mal_id, kind, title }) => {
            setModal(null);
            const slug = slugifyTitle(title);
            window.location.href = kind === "anime" ? `/anime/${mal_id}/${slug}` : `/manga/${mal_id}/${slug}`;
          }}
        />
      )}
    </>
  );
}
