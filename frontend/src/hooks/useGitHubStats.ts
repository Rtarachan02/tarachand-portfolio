import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { GitHubStats } from "@/types/profile";

export function useGitHubStats(enabled: boolean) {
  return useQuery({
    queryKey: ["github-stats"],
    queryFn: async () => {
      const { data } = await apiClient.get<GitHubStats>("/github/stats");
      return data;
    },
    enabled,
    retry: false,
  });
}
