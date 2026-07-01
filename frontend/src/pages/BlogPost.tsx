import { Link, useParams } from "react-router-dom";
import { ErrorState, LoadingState } from "@/components/ui/QueryState";
import { useBlogPost } from "@/hooks/useBlogPosts";

export function BlogPost() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = useBlogPost(slug);

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-24">
      <Link to="/blog" className="text-sm text-primary underline underline-offset-4">
        ← Back to blog
      </Link>

      {isLoading && <LoadingState />}
      {isError && <ErrorState message="Couldn't load this post." />}

      {post && (
        <>
          <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
          <div className="flex gap-3 text-sm text-muted">
            <span>{post.reading_time_minutes} min read</span>
            <span>{post.views_count} views</span>
          </div>
          {/* Markdown rendering (syntax highlighting, etc.) lands in Phase 6 — plain text for now. */}
          <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
            {post.content_markdown}
          </div>
        </>
      )}
    </article>
  );
}
