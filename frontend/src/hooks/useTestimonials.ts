import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type { Testimonial } from "@/types/api";

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data } = await apiClient.get<Testimonial[]>("/testimonials");
      return data;
    },
  });
}
