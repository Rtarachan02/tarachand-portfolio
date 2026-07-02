export type ProjectCategory = "embedded" | "backend" | "ai_ml" | "frontend" | "other";

export interface Project {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: ProjectCategory;
  tech_stack: string[];
  repo_url: string | null;
  live_url: string | null;
  image_url: string | null;
  featured: boolean;
  start_date: string | null;
  end_date: string | null;
}

export type SkillCategory = "embedded" | "backend" | "ai_ml" | "frontend" | "languages" | "tools";

export interface Skill {
  id: number;
  name: string;
  category: SkillCategory;
  proficiency: number;
  icon: string | null;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  location: string | null;
  employment_type: string | null;
  description: string;
  highlights: string[];
  start_date: string;
  end_date: string | null;
  company_url: string | null;
  logo_url: string | null;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  image_url: string | null;
}

export interface BlogPostSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  tags: string[];
  published_at: string | null;
  reading_time_minutes: number;
  views_count: number;
}

export interface BlogPost extends BlogPostSummary {
  content_markdown: string;
}

export interface BlogPostAdmin extends BlogPost {
  published: boolean;
}

export interface PaginatedBlogPosts {
  items: BlogPostSummary[];
  total: number;
  page: number;
  page_size: number;
}

export interface Testimonial {
  id: number;
  author_name: string;
  author_role: string | null;
  author_company: string | null;
  author_avatar_url: string | null;
  content: string;
  rating: number | null;
}

export interface TestimonialAdmin extends Testimonial {
  is_approved: boolean;
  sort_order: number;
}

export interface TestimonialCreate {
  author_name: string;
  author_role?: string | null;
  author_company?: string | null;
  author_avatar_url?: string | null;
  content: string;
  rating?: number | null;
  is_approved?: boolean;
}

export interface TestimonialUpdate {
  is_approved?: boolean;
}

export interface ContactMessageCreate {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessageAdmin {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AnalyticsSummary {
  total_pageviews: number;
  unique_visitors: number;
  top_paths: { path: string; count: number }[];
}

export interface ProjectCreate {
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: ProjectCategory;
  tech_stack: string[];
  repo_url?: string | null;
  live_url?: string | null;
  image_url?: string | null;
  featured?: boolean;
}

export interface ExperienceCreate {
  company: string;
  role: string;
  location?: string | null;
  employment_type?: string | null;
  description?: string;
  highlights?: string[];
  start_date: string;
  end_date?: string | null;
  company_url?: string | null;
  logo_url?: string | null;
}

export interface CertificationCreate {
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string | null;
  credential_id?: string | null;
  credential_url?: string | null;
  image_url?: string | null;
}

export interface SkillCreate {
  name: string;
  category: SkillCategory;
  proficiency?: number;
  icon?: string | null;
}

export interface BlogPostCreate {
  slug: string;
  title: string;
  excerpt: string;
  content_markdown: string;
  cover_image_url?: string | null;
  tags?: string[];
  published?: boolean;
}

export interface BlogPostUpdate {
  slug?: string;
  title?: string;
  excerpt?: string;
  content_markdown?: string;
  cover_image_url?: string | null;
  tags?: string[];
  published?: boolean;
}
