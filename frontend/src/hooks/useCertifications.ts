import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { Certification } from "@/types/api";

export function useCertifications() {
  return useQuery({
    queryKey: ["certifications"],
    queryFn: async () => {
      const { data } = await apiClient.get<Certification[]>("/certifications");
      return data;
    },
  });
}
