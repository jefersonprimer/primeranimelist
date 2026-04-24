type PostPathInput = {
  slug: string;
  category?: string | null;
  published_at?: string | null;
  created_at?: string | null;
};

export function buildNewsPostPath(post: PostPathInput) {
  const slug = post.slug?.trim();
  if (!slug) {
    return "/news";
  }

  const category = post.category?.trim().toLowerCase();
  const dateCandidate = post.published_at ?? post.created_at;

  if (!category || !dateCandidate) {
    return `/news/${slug}`;
  }

  const date = new Date(dateCandidate);
  if (Number.isNaN(date.getTime())) {
    return `/news/${slug}`;
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `/news/${category}/${year}/${month}/${day}/${slug}`;
}
