import "highlight.js/styles/atom-one-dark.css";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
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
          <div className="prose prose-neutral max-w-none dark:prose-invert prose-a:text-primary prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {post.content_markdown}
            </ReactMarkdown>
          </div>
        </>
      )}
    </article>
  );
}
