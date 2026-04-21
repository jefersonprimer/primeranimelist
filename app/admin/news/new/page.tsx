import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { AdminPostForm } from "@/app/components/AdminPostForm";

export default async function NewPostPage() {
  const session = await getSession();
  if (!isAdminEmail(session?.user.email)) {
    redirect("/login");
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-indigo-300">Admin</p>
          <h1 className="text-3xl font-black text-zinc-100">Criar novo post</h1>
        </div>
        <Link href="/news" className="text-sm font-semibold text-zinc-300 hover:text-white">
          Ver /news
        </Link>
      </div>

      <AdminPostForm mode="create" />
    </main>
  );
}
