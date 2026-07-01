import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { ContactMessageCreate } from "@/types/api";

export function useContactForm() {
  return useMutation({
    mutationFn: async (payload: ContactMessageCreate) => {
      const { data } = await apiClient.post("/contact", payload);
      return data;
    },
  });
}
