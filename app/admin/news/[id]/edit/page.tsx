import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { getPostById } from "@/lib/services/post.service";
import { AdminPostForm } from "@/app/components/AdminPostForm";
import { buildNewsPostPath } from "@/lib/post-url";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!isAdminEmail(session?.user.email)) {
    redirect("/login");
  }

  const { id } = await params;
  const postId = Number.parseInt(id, 10);
  if (!Number.isFinite(postId) || postId <= 0) {
    redirect("/news");
  }

  const post = await getPostById(postId);
  if (!post) {
    redirect("/news");
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-indigo-300">Admin</p>
          <h1 className="text-3xl font-black text-zinc-100">Editar post</h1>
        </div>
        <Link
          href={buildNewsPostPath({
            slug: post.slug,
            category: post.category,
            published_at: post.publishedAt?.toISOString() ?? null,
            created_at: post.createdAt?.toISOString() ?? null,
          })}
          className="text-sm font-semibold text-zinc-300 hover:text-white"
        >
          Ver post
        </Link>
      </div>

      <AdminPostForm
        mode="edit"
        postId={post.id}
        initialData={{
          title: post.title,
          slug: post.slug,
          category: post.category,
          tags: post.tags?.join(", ") ?? "",
          author: post.author ? JSON.stringify(post.author, null, 2) : "",
          read_time: post.readTime !== null && post.readTime !== undefined ? String(post.readTime) : "",
          excerpt: post.excerpt ?? "",
          cover_image_url: post.coverImageUrl ?? "",
          content_markdown: post.contentMarkdown,
          is_published: post.isPublished,
        }}
      />
    </main>
  );
}
