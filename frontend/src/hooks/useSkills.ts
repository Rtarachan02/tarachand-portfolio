import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { Skill } from "@/types/api";

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data } = await apiClient.get<Skill[]>("/skills");
      return data;
    },
  });
}
