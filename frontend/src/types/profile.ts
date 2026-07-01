export interface Profile {
  photo_url: string | null;
  tagline: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  public_email: string | null;
  linkedin_embed_html: string | null;
}

export interface ProfileUpdate {
  photo_url?: string | null;
  tagline?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  public_email?: string | null;
  linkedin_embed_html?: string | null;
}

export interface GitHubRepo {
  name: string;
  url: string;
  description: string | null;
  stars: number;
  updated_at: string;
}

export interface GitHubStats {
  username: string;
  profile_url: string;
  avatar_url: string | null;
  public_repos: number;
  followers: number;
  recent_repos: GitHubRepo[];
}
