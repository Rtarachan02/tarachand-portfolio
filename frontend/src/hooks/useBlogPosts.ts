import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { BlogPost, PaginatedBlogPosts } from "@/types/api";

export function useBlogPosts(options?: { tag?: string; search?: string; page?: number }) {
  return useQuery({
    queryKey: ["blog-posts", options],
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedBlogPosts>("/blog", { params: options });
      return data;
    },
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data } = await apiClient.get<BlogPost>(`/blog/${slug}`);
      return data;
    },
    enabled: Boolean(slug),
  });
}
