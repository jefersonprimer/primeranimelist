import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { listAllPostsForAdmin, serializePost } from "@/lib/services/post.service";
import { buildNewsPostPath } from "@/lib/post-url";

function formatDate(iso: string | null) {
  if (!iso) return "Rascunho";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(iso));
}

export default async function AdminNewsPage() {
  const session = await getSession();
  if (!isAdminEmail(session?.user.email)) {
    redirect("/login");
  }

  const result = await listAllPostsForAdmin({ page: 1, limit: 100 });
  const items = result.items.map(serializePost);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-indigo-300">Admin</p>
          <h1 className="text-3xl font-black text-zinc-100">Gerenciar posts</h1>
        </div>
        <Link href="/admin/news/new" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
          Criar post
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900 text-zinc-300">
            <tr>
              <th className="px-4 py-3">Titulo</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Publicado em</th>
              <th className="px-4 py-3">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 bg-[#181818] text-zinc-200">
            {items.map((post) => (
              <tr key={post.id}>
                <td className="px-4 py-3">{post.title}</td>
                <td className="px-4 py-3">{post.is_published ? "Publicado" : "Rascunho"}</td>
                <td className="px-4 py-3">{formatDate(post.published_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <Link href={`/admin/news/${post.id}/edit`} className="text-indigo-300 hover:text-indigo-200">
                      Editar
                    </Link>
                    <Link href={buildNewsPostPath(post)} className="text-zinc-300 hover:text-white">
                      Abrir
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-zinc-400" colSpan={4}>
                  Nenhum post criado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
