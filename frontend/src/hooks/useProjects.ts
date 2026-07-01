import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { Project, ProjectCategory } from "@/types/api";

export function useProjects(options?: { category?: ProjectCategory; featured?: boolean }) {
  return useQuery({
    queryKey: ["projects", options],
    queryFn: async () => {
      const { data } = await apiClient.get<Project[]>("/projects", { params: options });
      return data;
    },
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data } = await apiClient.get<Project>(`/projects/${slug}`);
      return data;
    },
    enabled: Boolean(slug),
  });
}
