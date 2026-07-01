import { Link } from "react-router-dom";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/QueryState";
import { useBlogPosts } from "@/hooks/useBlogPosts";

export function Blog() {
  const { data, isLoading, isError } = useBlogPosts({ page: 1 });

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-24">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
        <p className="max-w-2xl text-muted">
          Technical writing on embedded systems, backend architecture, and applied AI/ML.
        </p>
      </div>

      {isLoading && <LoadingState />}
      {isError && <ErrorState message="Couldn't load posts from the API." />}
      {data && data.items.length === 0 && <EmptyState>No posts published yet.</EmptyState>}

      <div className="grid gap-4 sm:grid-cols-2">
        {data?.items.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="flex flex-col gap-2 rounded-2xl border border-border bg-surface/60 p-6 transition-colors hover:border-primary/60"
          >
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="text-sm text-muted">{post.excerpt}</p>
            <div className="mt-auto flex items-center gap-3 pt-2 text-xs text-muted">
              <span>{post.reading_time_minutes} min read</span>
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
