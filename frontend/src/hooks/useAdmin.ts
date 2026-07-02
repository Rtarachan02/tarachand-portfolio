import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type {
  AnalyticsSummary,
  BlogPostAdmin,
  BlogPostCreate,
  BlogPostUpdate,
  Certification,
  CertificationCreate,
  ContactMessageAdmin,
  Experience,
  ExperienceCreate,
  Project,
  ProjectCreate,
  Skill,
  SkillCreate,
  TestimonialAdmin,
  TestimonialCreate,
  TestimonialUpdate,
} from "@/types/api";

export function useContactMessages() {
  return useQuery({
    queryKey: ["admin", "contact-messages"],
    queryFn: async () => {
      const { data } = await apiClient.get<ContactMessageAdmin[]>("/contact/admin");
      return data;
    },
  });
}

export function useMarkContactMessageRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.patch<ContactMessageAdmin>(`/contact/admin/${id}/read`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contact-messages"] });
    },
  });
}

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: ["admin", "analytics-summary"],
    queryFn: async () => {
      const { data } = await apiClient.get<AnalyticsSummary>("/analytics/summary");
      return data;
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ProjectCreate) => {
      const { data } = await apiClient.post<Project>("/projects", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ExperienceCreate) => {
      const { data } = await apiClient.post<Experience>("/experience", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/experience/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
    },
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SkillCreate) => {
      const { data } = await apiClient.post<Skill>("/skills", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/skills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    },
  });
}

export function useTestimonialsAdmin() {
  return useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: async () => {
      const { data } = await apiClient.get<TestimonialAdmin[]>("/testimonials/admin");
      return data;
    },
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: TestimonialCreate) => {
      const { data } = await apiClient.post<TestimonialAdmin>("/testimonials", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: TestimonialUpdate }) => {
      const { data } = await apiClient.put<TestimonialAdmin>(`/testimonials/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/testimonials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}

export function useBlogPostsAdmin() {
  return useQuery({
    queryKey: ["admin", "blog-posts"],
    queryFn: async () => {
      const { data } = await apiClient.get<BlogPostAdmin[]>("/blog/admin");
      return data;
    },
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BlogPostCreate) => {
      const { data } = await apiClient.post<BlogPostAdmin>("/blog", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: BlogPostUpdate }) => {
      const { data } = await apiClient.put<BlogPostAdmin>(`/blog/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });
}

export function useCreateCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CertificationCreate) => {
      const { data } = await apiClient.post<Certification>("/certifications", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
    },
  });
}

export function useDeleteCertification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/certifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
    },
  });
}
