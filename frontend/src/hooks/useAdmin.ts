import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import type {
  AnalyticsSummary,
  ContactMessageAdmin,
  Experience,
  ExperienceCreate,
  Project,
  ProjectCreate,
  Skill,
  SkillCreate,
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
