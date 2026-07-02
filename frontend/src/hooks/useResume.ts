import { useQuery } from "@tanstack/react-query";
import { apiClient, baseURL } from "@/lib/api";

export function useResumeAvailable() {
  return useQuery({
    queryKey: ["resume-info"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ available: boolean }>("/resume/info");
      return data.available;
    },
    retry: false,
  });
}

export const resumeDownloadUrl = `${baseURL}/resume/download`;
