import Link from "next/link";
import { listPublishedPosts, serializePost } from "@/lib/services/post.service";
import { getSession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

function formatDate(iso: string | null) {
  if (!iso) return "Nao publicado";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(iso));
}

export default async function NewsPage() {
  const [{ items }, session] = await Promise.all([
    listPublishedPosts({ page: 1, limit: 24 }),
    getSession(),
  ]);
  const posts = items.map(serializePost);
  const isAdmin = isAdminEmail(session?.user.email);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-indigo-300">News</p>
          <h1 className="text-3xl font-black text-zinc-100">Blog & Noticias</h1>
          <p className="mt-2 text-zinc-400">Atualizacoes, anuncios e guias da plataforma.</p>
        </div>
        {isAdmin && (
          <Link href="/admin/news/new" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
            Novo post
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-[#181818] p-8 text-zinc-300">
          Ainda nao existem posts publicados.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#181818]">
              {post.cover_image_url && (
                <img src={post.cover_image_url} alt={post.title} className="h-48 w-full object-cover" />
              )}
              <div className="space-y-3 p-5">
                <p className="text-xs uppercase tracking-wide text-zinc-400">{formatDate(post.published_at)}</p>
                <h2 className="text-xl font-bold text-zinc-100">
                  <Link href={`/news/${post.slug}`} className="hover:text-indigo-300">
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt && <p className="line-clamp-3 text-sm text-zinc-300">{post.excerpt}</p>}
                <Link href={`/news/${post.slug}`} className="inline-flex text-sm font-semibold text-indigo-300 hover:text-indigo-200">
                  Ler post
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
