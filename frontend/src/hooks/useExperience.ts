import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { Experience } from "@/types/api";

export function useExperience() {
  return useQuery({
    queryKey: ["experience"],
    queryFn: async () => {
      const { data } = await apiClient.get<Experience[]>("/experience");
      return data;
    },
  });
}
