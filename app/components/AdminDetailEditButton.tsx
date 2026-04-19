"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { AdminMediaModal } from "./AdminMediaModal";

type Kind = "anime" | "manga";

export function AdminDetailEditButton({ kind, malId }: { kind: Kind; malId: number }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/50 bg-indigo-600/15 px-4 py-2 text-sm font-semibold text-indigo-100 transition hover:border-indigo-400 hover:bg-indigo-600/25"
      >
        <Pencil size={16} aria-hidden />
        Editar ({kind === "anime" ? "anime" : "manga"})
      </button>

      <AdminMediaModal
        open={open}
        onClose={() => setOpen(false)}
        kind={kind}
        mode="edit"
        malId={malId}
        onSaved={() => {
          window.location.reload();
        }}
      />
    </>
  );
}
