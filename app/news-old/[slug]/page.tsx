import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { MarkdownRenderer } from "@/app/components/MarkdownRenderer";
import { getSession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { ensureDatabase } from "@/lib/db/bootstrap";

function formatDate(date: Date | null) {
  if (!date) return "Rascunho";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(date);
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await ensureDatabase();
  const session = await getSession();
  const admin = isAdminEmail(session?.user.email);

  const where = admin ? eq(posts.slug, slug) : and(eq(posts.slug, slug), eq(posts.isPublished, true));
  const result = await db.select().from(posts).where(where).limit(1);
  const post = result[0];

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/news" className="text-sm font-semibold text-indigo-300 hover:text-indigo-200">
          Voltar para /news
        </Link>
        {admin && (
          <Link href={`/admin/news/${post.id}/edit`} className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200">
            Editar post
          </Link>
        )}
      </div>

      <article className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#181818]">
        {post.coverImageUrl && <img src={post.coverImageUrl} alt={post.title} className="max-h-96 w-full object-cover" />}
        <div className="space-y-5 p-8">
          <p className="text-xs uppercase tracking-wide text-zinc-400">{formatDate(post.publishedAt)}</p>
          <h1 className="text-4xl font-black text-zinc-100">{post.title}</h1>
          {post.excerpt && <p className="text-lg text-zinc-300">{post.excerpt}</p>}
          <div className="border-t border-zinc-800 pt-6">
            <MarkdownRenderer content={post.contentMarkdown} />
          </div>
        </div>
      </article>
    </main>
  );
}
